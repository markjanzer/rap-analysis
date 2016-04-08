//= require jquery
//= require jquery_ujs
//= require jquery-ui/selectable
//= require turbolinks
//= require foundation
//= require_tree .


$(document).on('ready page:load', function(){
  $(document).foundation();
  createSection();
  selectable();
  changeRhyme();
  changeStress();
  changeEndRhyme();
  changeLyric();
  changeRhythm();
  removeCell();
  addCell();
  addMeasureAfter();
  addMeasureBefore();
  deleteMeasure();
  deleteSection();
  renderNewSectionForm();
  cancelSectionCreation();
  publish();
  openEditMenu();
  closeEditMenu();
});

function createSection(){
  $(document).on("submit", ".new-section-form", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var sectionData = $(".new-section-form").serializeArray();
    sectionData.push({ name: "songID", value: songID });
    // refactor might not have to add songID to sectionData
    var request = $.ajax({
      url: "/songs/" + songID + "/create_section",
      type: "PUT",
      data: sectionData
    })
    request.done(function(response){
      $(".song-edit").html(response)
    })
  })
}

function selectable(){
  $('.selectable').selectable({
    filter: ".select",
    cancel: "a"
  });
}

var changeRhyme = function(){
  $(document).on("click", ".change-rhyme", function(event){
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
      url: ("/songs/" + songID + "/change_rhyme"),
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
  $(document).on("click", ".change-stress", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected");
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    // refactor Don't think I need following line
    // var quality = $(this).attr("value");
    // refactor This is to get song id
    var songID = $("input[name='song-id']").attr("value");
    // refactor to not include authenticity_token in params if possible
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/change_stress"),
      data: {
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
  $(document).on("click", ".change-end-rhyme", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected");
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    // refactor This is to get song id
    var songID = $("input[name='song-id']").attr("value");
    // refactor to not include authenticity_token in params if possible
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/change_end_rhyme"),
      data: {
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
  $(document).on("click", ".change-lyrics", function(event){
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
      url: ("/songs/" + songID + "/change_lyrics"),
      data: {
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
  $(document).on("click", ".change-rhythm", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var allCells = $(".ui-selected")
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var replacementDuration = $(this).val();
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/change_rhythm"),
      data: {
        duration: replacementDuration,
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      for (var key in response){
        $("input[value='" + key + "'][name='measure_id']").parent().replaceWith(response[key])
      }
    })
  })
}

var removeCell = function(){
  $(document).on("click", ".remove-cell", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var allCells = $(".ui-selected")
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/delete_cell"),
      data: {
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      for (var key in response){
        $("input[value='" + key + "'][name='measure_id']").parent().replaceWith(response[key])
      }
    })
  })
}

var addCell = function(){
  $(document).on("click", ".add-cell", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var allCells = $(".ui-selected")
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var beforeOrAfter = $(this).val();
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/add_cell"),
      data: {
        cellIDs: cellIDs,
        before_or_after: beforeOrAfter,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      for (var key in response){
        $("input[value='" + key + "'][name='measure_id']").parent().replaceWith(response[key])
      }
    })
  })
}

var addMeasureAfter = function(){
  $(document).on("click", ".add-measure-after", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var cellID = $(".ui-selected").first().attr("name");
    // refactor use this when combining before and after
    var beforeOrAfter = $(this).val();
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/add_measure_after"),
      data: {
        cellID: cellID,
        before_or_after: beforeOrAfter,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      $(".ui-selected").closest("div.edit-section").append(response)
    });
  });
}

var addMeasureBefore = function(){
  $(document).on("click", ".add-measure-before", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var cellID = $(".ui-selected").first().attr("name");
    var beforeOrAfter = $(this).val();
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/add_measure_before"),
      data: {
        cellID: cellID,
        before_or_after: beforeOrAfter,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      $(".ui-selected").parent().parent().siblings(".section-duration-header").after(response)
    });
  });
}

var deleteMeasure = function(){
  $(document).on("click", ".delete-measure", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var measure = $(".ui-selected").first().parent().parent()
    var measureID = measure.children("input").val();
    console.log("this is measureID" + measureID)
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/delete_measure"),
      data: {
        measureID: measureID,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      measure.remove();
    });
  });
}

var deleteSection = function(){
  $(document).on("click", ".delete-section", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var sectionID = $(this).siblings("input").val();
    var section = $(this).parent();
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/delete_section"),
      data: {
        sectionID: sectionID,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      section.remove();
    })
  })
}

var renderNewSectionForm = function(){
  $(document).on("click", ".add-section-button", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var thisButton = $(this);
    var sectionNumber = $(this).attr("data-value");
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/render_section_form",
      data: {
        sectionNumber: sectionNumber,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      $(thisButton).replaceWith(response)
    })
  })
}

var cancelSectionCreation = function(){
  $(document).on("click", ".cancel-section-creation", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var thisForm = $(this).parent().parent();
    var thisFormsWrapper = thisForm.parent().parent();
    var sectionNumber = $(this).siblings("input[name='section-number']").val();
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/cancel_section_form",
      data: {
        sectionNumber: sectionNumber,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      $(thisFormsWrapper).replaceWith(response);
    })
  })
}

var publish = function(){
  $(document).on("click", ".publish", function(event){
    event.preventDefault();
    var thisButton = $(this);
    var value = $(this).val();
    var songID = $("input[name='song-id']").attr("value");
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/publish",
      data: {
        value: value,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      thisButton.replaceWith(response);
    })
  })
}

function openEditMenu(){
  $(document).on("click", ".open-edit-menu", function(event){
    event.preventDefault();
    var thisButton = $(this);
    var songID = $("input[name='song-id']").attr("value");
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/open_edit_menu",
      data: {
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      thisButton.replaceWith(response);
    })
  })
}

function closeEditMenu(){
  $(document).on("click", ".close-edit-menu", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var thisForm = $(this).parent().parent().parent();
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/close_edit_menu",
      data: {
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      thisForm.replaceWith(response);
    })
  })
}

//----------- HELPERS -------------------
function getCSRFTokenValue(){
  return $('meta[name="csrf-token"]').attr('content');
}

$(function(){ $(document).foundation(); });
