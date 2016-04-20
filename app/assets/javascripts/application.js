//= require jquery
//= require jquery_ujs
//= require jquery-ui/selectable
//= require turbolinks
//= require foundation
//= require_tree .


$(document).on('ready page:load', function(){
  // Prevents duplicate event bindings
  $(document).off("click");
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
  addArtist();
  tagForPublication();
  renderDeleteSectionWarning();
  removeDeleteSectionWarning();
  renderDeleteSongWarning();
  removeDeleteSongWarning();
  tabToNextCell();
  focusLyrics();
  submitLyrics();
});

var createSection = function(){
  $(document).on("submit", ".new-section-form", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var sectionData = $(".new-section-form").serializeArray();
    var thisFormAndContainers = $(this).parent().parent().parent();
    var request = $.ajax({
      url: "/songs/" + songID + "/create_section",
      type: "PUT",
      data: sectionData
    });
    request.done(function(response){
      // Need to replace thisFormAndContainers with the renderNewSectionFormButton
      // thisFormAndContainers.replaceWith()
      $(".song-edit").html(response);
      selectable();
    })
  })
}

var selectable = function(){
  $('.selectable').selectable({
    filter: ".select",
  });
}

var submitLyrics = function(){
  $(document).on("keypress", ".replacement-lyrics", function(event){
    if (event.keyCode === 13){
      $(".change-lyrics").click();
    }
  })
}

var focusLyrics = function(){
  $(document).on("keypress", "body", function(event){
    $(".replacement-lyrics").focus();
  })
}

var tabToNextCell = function(){
  $(document).on("keydown", "body", function(event){
    if (event.keyCode === 9){
      event.preventDefault();
      var selectedCell = $(".ui-selected").first();
      var nextCell = undefined;
      // assign nextCell to the next cell in the measure, or if at end of measure, then to the first cell in the next measure.
      if (selectedCell.next().length){
        nextCell = selectedCell.next();
      } else {
        nextCell = selectedCell.parents(".edit-measure").next().children("div").children().first(".col.select");
      }
      selectedCell.removeClass("ui-selected");
      nextCell.addClass("ui-selected");
    }
  })
}

var changeRhyme = function(){
  $(document).on("click", ".change-rhyme", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected");
    var cellIDs = $.map(allCells, function(cell){
      return $(cell).attr("name");
    });
    var quality = $(this).val();
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
        $(this).attr("data-rhyme", response['quality'])
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
    $(".replacement-lyrics").val('');
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
    var thisSection = $(this).parents(".edit-section");
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
      thisSection.replaceWith(response);
    });
  });
}

var addMeasureBefore = function(){
  $(document).on("click", ".add-measure-before", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var thisSection = $(this).parents(".edit-section");
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
      thisSection.replaceWith(response);
    });
  });
}

var deleteMeasure = function(){
  $(document).on("click", ".delete-measure", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var thisSection = $(this).parents(".edit-section");
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
      thisSection.replaceWith(response);
    });
  });
}

var deleteSection = function(){
  $(document).on("click", ".delete-section", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var section = $(this).parents(".edit-section");
    var sectionID = section.children("input[name='section-id']").val();
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

var openEditMenu = function(){
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

var closeEditMenu = function(){
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

var addArtist = function(){
  $(document).on("click", ".add-artist", function(event){
    event.preventDefault();
    console.log("Ran once")
    var prevArtistNum = $(this).prev().attr("data-value");
    var artistNum = (parseInt(prevArtistNum) + 1).toString();
    $(this).before('<input type="text" name="artist-' + artistNum + '" data-value="' + artistNum + '" placeholder="Artist">');
  });
}

var tagForPublication = function(){
  $(document).on("click", ".tag-for-publication", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var thisButton = $(this);
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/tag_for_publication",
      data: {
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      thisButton.replaceWith(response);
    })

  })
}


var renderDeleteSectionWarning = function(){
  $(document).on("click", ".render-delete-section-warning", function(event){
    event.preventDefault();
    var thisButton = $(this);
    var songID = $("input[name='song-id']").attr("value");
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/render_delete_section_warning",
      data: {
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      thisButton.replaceWith(response);
    })

  })
}

var removeDeleteSectionWarning = function(){
  $(document).on("click", ".cancel-section-deletion", function(event){
    event.preventDefault();
    var thisForm = $(this).parent().parent().parent();
    thisForm.replaceWith('<button class="alert button float-right render-delete-section-warning">Delete Section</button>');
  })
}

var renderDeleteSongWarning = function(){
  $(document).on("click", ".render-delete-song-warning", function(event){
    event.preventDefault();
    var thisButton = $(this);
    var songID = $("input[name='song-id']").attr("value");
    $.ajax({
      method: "PUT",
      url: "/songs/" + songID + "/render_delete_song_warning",
      data: {
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      thisButton.replaceWith(response);
    })
  })
}

var removeDeleteSongWarning = function(){
  $(document).on("click", ".cancel-song-deletion", function(event){
    event.preventDefault();
    var thisForm = $(this).parent().parent().parent();
    thisForm.replaceWith('<button class="alert button float-right render-delete-song-warning">Delete Song</button>');
  })
}

//----------- HELPERS -------------------
function getCSRFTokenValue(){
  return $('meta[name="csrf-token"]').attr('content');
}

$(function(){ $(document).foundation(); });
