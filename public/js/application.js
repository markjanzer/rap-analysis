$(document).ready(function() {
  // createSong();

  beginSectionCreation();
  createSection();

  beginMeasureCreation();
  addValueToMeasure();
  retryRhythmCreation();

  beginTextAddition();

});

// var createSong = function(){
//   $(document).on("submit", ".create-song", function(event){
//     event.preventDefault();
//     $.ajax({
//       method: "POST",
//       url: "/songs",
//       data: $(".create-song").serialize()
//     }).done(function(response){
//       $(".song-form").hide();
//       $(".begin-section-creation").show();
//       jsonResponse = JSON.parse(response)
//       $(".container").prepend($("<h4>" + jsonResponse['album'] + "</h4>"))
//       $(".container").prepend($("<h4>" + jsonResponse['artist'] + "</h4>"))
//       $(".container").prepend($("<h3>" + jsonResponse['song'] + "</h3>"))
//     })
//   })
// }

var beginSectionCreation = function(){
  $(document).on("click", ".begin-section-creation", function(event){
    event.preventDefault();
    $(".begin-section-creation").hide();
    $(".section-creation-div").show();
  })
}

var createSection = function(){
  $(document).on("submit", ".create-section", function(event){
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/sections",
      data: $(".create-section").serialize()
    }).done(function(response){
      var parsedResponse = JSON.parse(response)
      var hiddenSectionID = $('<input type="hidden" class="section-id" value="' + parsedResponse.section.id + '">')
      $(".section-creation-div").before($("<h5>" + parsedResponse.section.section_type +" by " + parsedResponse.artist_name + "</h5>"), hiddenSectionID)
      $(".section-creation-div").hide()
      $(".begin-measure-creation").show();
    })
  })
}


var beginMeasureCreation = function(){
  $(document).on("click", ".begin-measure-creation", function(event){
    event.preventDefault();
    $(".begin-measure-creation").hide();
    $(".rhythm-creation-div").show();
  })
}

var beginTextAddition = function(){
  $(document).on("click", ".create-rhythm", function(event){
    event.preventDefault();
    $.ajax({
      method: "POST",
      data: {
        cellLengths: $(".measure-creation-values").text(),
        sectionID: $(".section-id").val()
        },
      url: "/measures"
    }).done(function(response){
      // console.log(typeof response)
      $(".rhythm-creation-div").append(response)
      // var measureID = JSON.parse(response).measure_id
      // var cells = JSON.parse(response).cells

      // $(".rhythm-creation-div").hide();
      // $(".add-text-div").show();

    })
  })
}

var addValueToMeasure = function(){
  $(document).on("click", ".duration-button", function(event){
    event.preventDefault();
    var duration = $(this).val();
    $(".measure-creation-values").append(duration);
    $(".measure-creation-values").append(" ");

    if (duration.split(" ").length > 1) {
      $(".measure-creation-total").text("1")
    } else {
      var previous_sum = $(".measure-creation-total").text()
      var current_sum = eval(duration) + eval(previous_sum)
      $(".measure-creation-total").text(current_sum.toString())
    }
  })
}

var retryRhythmCreation = function(){
  $(document).on("click", ".retry-rhythm-creation", function(event){
    event.preventDefault();
    $(".measure-creation-values").text("");
    $(".measure-creation-total").text("0");
  })
}


