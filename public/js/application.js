$(document).ready(function() {

  beginSectionCreation();
  createSection();

  beginMeasureCreation();
  addValueToMeasure();
  retryRhythmCreation();

  beginTextAddition();
  addTextToMeasure();

  selectCell();
  addQuality();

  completeMeasure();

  completeSongCreation();

});

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
      // refactor should be partial
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

var retryRhythmCreation = function(){
  $(document).on("click", ".retry-rhythm-creation", function(event){
    event.preventDefault();
    $(".measure-creation-values").text("");
    $(".measure-creation-total").text("0");
  })
}

var beginTextAddition = function(){
  $(document).on("click", ".create-rhythm", function(event){
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/measures",
      data: {
        cellLengths: $(".measure-creation-values").text(),
        sectionID: $(".section-id").val()
        },
    }).done(function(response){
      $(".measure-creation-values").empty()
      $(".measure-creation-total").empty()
      $(".rhythm-creation-div").hide()
      $(".input-text-div").append(response)
      $(".input-text-div").show()
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

var addTextToMeasure = function(){
  $(document).on("submit", "form.add-text-to-measure", function(event){
    event.preventDefault();
    $.ajax({
      method: "PUT",
      url: "/measures/:id/text",
      data: $("form.add-text-to-measure").serialize()
    }).done(function(response){
      console.log("made it here")
      $(".input-text-div").empty()
      $(".input-qualities-div").show()
      $(".input-qualities-div").append(response)
    })
  })
}

var selectCell = function(){
  $(document).on("click", "button.select", function(event){
    event.preventDefault();
    var cellID = $(this).attr("name")
    $("input.selected").attr("value", cellID)
    console.log($(this))
  })
}

var addQuality = function(){
  $(document).on("click", "button.add-quality", function(event){
    event.preventDefault();
    console.log($(this).attr("value"))
    var cellID = $("input.selected").attr("value")
    var selectedButton = $("button.select[name=" + cellID + "]")
    var quality = $(this).attr("value")
    // console.log(quality)
    $.ajax({
      method: "PUT",
      url: ("/cells/" + cellID + ""),
      data: { quality: quality }
    }).done(function(response){
      $(".input-qualities-div").empty()
      $(".input-qualities-div").append(response)
    })
  })
}

var completeMeasure = function(){
  $(document).on("submit", "form.add-qualities-to-cells", function(event){
    event.preventDefault();
    measureID = $(this).children("input[name=measure_id]").val()
    $.ajax({
      method: "PUT",
      url: "/measures/" + measureID + "/complete"
      }).done(function(response){
      $(".input-qualities-div").empty()
      $("div.display-section").append(response)
      $("button.begin-measure-creation").show()
    })
  })
}

var completeSongCreation = function(){
  $(document).on("click", "button.complete-song-creation", function(event){
    event.preventDefault();
    $.ajax({
      method: "GET"
    })
  })
}



