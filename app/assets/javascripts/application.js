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


$(document).ready(function() {
  createSection();
  purplify();
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
      console.log("MADE IT BOYS")
    })
  })
}

function purplify(){
  $(document).on("click", "h1", function(event){
    event.preventDefault();
    $("body").css("background-color", "yellow");
  })
}
