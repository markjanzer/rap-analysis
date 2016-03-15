// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require jquery-ui/selectable


$(document).ready(function() {
  createSection();
  selectable();
  changeRhyme();
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
      data: { quality: quality, cellIDs: cellIDs, authenticity_token: getCSRFTokenValue() }
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
    var allCells = $(".ui-selected")
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name")
    });
    var quality = $(this).attr("value")
    // refactor This is to get song id
    var songID = $("input[name='song-id']").attr("value")
    // refactor to not include authenticity_token in params if possible
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID),
      data: { quality: quality, cellIDs: cellIDs, authenticity_token: getCSRFTokenValue() }
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



function getCSRFTokenValue(){
  return $('meta[name="csrf-token"]').attr('content');
}
