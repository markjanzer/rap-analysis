$(document).ready(function() {
  beginMeasureCreation();
  beginTextAddition();
  addValueToMeasure();
  retryRhythmCreation();
  createSong();
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
});

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
    // console.log($(".measure-creation-values").text())
    $.ajax({
      method: "POST",
      data: { data: $(".measure-creation-values").text() },
      url: "/measures"
    }).done(function(response){
      $(".rhythm-creation-div").hide();
      $(".add-text-div").show();

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

var createSong = function(){
  $(".create-song").on("submit", function(event){
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/songs",
      data: $(".create-song").serialize()
    }).done(function(response){
      $(".song-form").hide();
      var songHeader = $("div");
      var songName = $("h3").text("Song: " + response["song"])
      var artistName = $("h4").text("Artist: " + response["artist"])
      var albumName = $("h4").text("Album: " + response["album"])
      songHeader.prepend(songName, artistName, albumName)
      console.log("THIS IS THE SONGHEADER")
      console.log(songHeader.html())
      $(".container").prepend(songHeader.html())
    })
  })
}

