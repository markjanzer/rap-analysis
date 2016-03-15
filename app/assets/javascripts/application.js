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
  $(document).on("click", "button.add-quality", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected")
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name")
    });
    var quality = $(this).attr("value")
    var songID = $("input[name='song-id']").attr("value")
    // refactor to not include authenticity_token in params if possible
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID),
      data: { quality: quality, cellIDs: cellIDs, authenticity_token: getCSRFTokenValue() }
    }).done(function(response){
      $.each(allCells, function(){
        console.log($(this));
        console.log(response['quality']);
        $(this).css("background-color", response['quality'].slice(0, -5))
      })
    })
  })
}



function getCSRFTokenValue(){
  return $('meta[name="csrf-token"]').attr('content');
}
