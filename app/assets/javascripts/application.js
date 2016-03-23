//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require jquery-ui/selectable


$(document).on('ready page:load', function(){
  createSection();
  selectable();
  changeRhyme();
  changeStress();
  changeEndRhyme();
  changeLyric();
  changeRhythm();
});

function createSection(){
  $(document).on("click", ".new-section-form", function(event){
    event.preventDefault();
    var sectionData = $(".new-section-form").serialize();
    var request = $.ajax({
      url: "/sections/",
      type: "POST",
      data: sectionData
    })
    request.done(function(response){
      $(".song-edit").html(response)
    })
  })
}

function selectable(){
  $('.selectable').selectable({
    filter: ".select"
  });
}

var changeRhyme = function(){
  $(document).on("click", "button.change-rhyme", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected");
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var quality = $(this).attr("value");
    // refactor This is to get song id
    var songID = $("input[name='song-id']").attr("value");
    // refactor to not include authenticity_token in params if possible
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID),
      data: {
        quality: quality,
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      $.each(allCells, function(){
        $(this).css("background-color", response['quality'].slice(0, -5))
      })
    })
  })
}

var changeStress = function(){
  $(document).on("click", "button.change-stress", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected");
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var quality = $(this).attr("value");
    // refactor This is to get song id
    var songID = $("input[name='song-id']").attr("value");
    // refactor to not include authenticity_token in params if possible
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID),
      data: { quality: quality,
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      if (response['quality']){
        $.each(allCells, function(){
          $(this).addClass("stressed");
        })
      } else {
        $.each(allCells, function(){
          $(this).removeClass("stressed");
        })
      }
    })
  })
}

var changeEndRhyme = function(){
  $(document).on("click", "button.change-end-rhyme", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected");
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var quality = $(this).attr("value");
    // refactor This is to get song id
    var songID = $("input[name='song-id']").attr("value");
    // refactor to not include authenticity_token in params if possible
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID),
      data: {
        quality: quality,
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      if (response['quality']){
        $.each(allCells, function(){
          $(this).addClass("end-rhyme");
        })
      } else {
        $.each(allCells, function(){
          $(this).removeClass("end-rhyme");
        })
      }
    })
  })
}

var changeLyric = function(){
  $(document).on("click", "button.change-lyrics", function(event){
    event.preventDefault();
    // refactor I use next two lines repeatedly
    var songID = $("input[name='song-id']").attr("value");
    var allCells = $(".ui-selected")
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var replacementLyrics = $(".replacement-lyrics").val();
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID),
      data: {
        quality: "lyrics",
        lyrics: replacementLyrics,
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      $.each(allCells, function(){
        $(this).html(replacementLyrics);
      })
    })
  })
}

var changeRhythm = function(){
  $(document).on("click", "button.change-rhythm", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var allCells = $(".ui-selected")
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var replacementDuration = $(this).val();
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID),
      data: {
        quality: "rhythm",
        duration: replacementDuration,
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      console.log(response)
      for (var key in response){
        console.log($("input[value='" + key + "'][name='measure_id']").parent());
        console.log(response[key])
        $("input[value='" + key + "'][name='measure_id']").parent().replaceWith(response[key])
      }
    })
  })
}

function getCSRFTokenValue(){
  return $('meta[name="csrf-token"]').attr('content');
}
