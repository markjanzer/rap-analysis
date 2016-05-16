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
  selectable();

  // Section creation and deletion
  createSection();
  deleteSection();
  renderNewSectionForm();
  cancelSectionCreation();
  addArtist();

  // Remove and Render Warnings
  renderDeleteSectionWarning();
  removeDeleteSectionWarning();
  renderDeleteSongWarning();
  removeDeleteSongWarning();

  // Add and Remove Measures
  addMeasureAfter();
  addMeasureBefore();
  deleteMeasure();

  // Add and Remove Cells
  addCell();
  removeCell();

  // Edit Cell Attributes
  changeRhyme();
  changeStress();
  changeEndRhyme();
  changeLyric();
  changeRhythm();

  // Open and Close Edit Menu
  openEditMenu();
  closeEditMenu();

  // Publication
  tagForPublication();
  publish();

  // Tabbing and Adding Lyrics
  tabToCell();
  focusLyrics();
  submitLyrics();
});

var selectable = function(){
  $('.selectable').selectable({
    filter: ".select",
  });
}

// --------- Section Creation and Deletion ---------
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
      $(".song-edit").html(response);
      selectable();
    })
  })
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

var addArtist = function(){
  $(document).on("click", ".add-artist", function(event){
    event.preventDefault();
    console.log("Ran once")
    var prevArtistNum = $(this).prev().attr("data-value");
    var artistNum = (parseInt(prevArtistNum) + 1).toString();
    $(this).before('<input type="text" name="artist-' + artistNum + '" data-value="' + artistNum + '" placeholder="Artist">');
  });
}

// --------- Remove and Render Warnings ---------
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

// --------- Add and Remove Measures ---------
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
      selectable();
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
      selectable();
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
      selectable();
    });
  });
}


// --------- Add and Remove Cells ---------
var addCell = function(){
  $(document).on("click", ".add-cell", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var allCells = $(".ui-selected")
    var cellIDs = getCellIDs(allCells);
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
      selectCellsByID(cellIDs);
    })
  })
}

var removeCell = function(){
  $(document).on("click", ".remove-cell", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var thisSection = $(this).parents(".edit-section");
    var allCells = $(".ui-selected")
    var previousCells = getPreviousCells(allCells);
    var previousCellIDs = getCellIDs(previousCells);
    var cellIDs = getCellIDs(allCells);
    $.ajax({
      method: "PUT",
      url: ("/songs/" + songID + "/delete_cell"),
      data: {
        cellIDs: cellIDs,
        authenticity_token: getCSRFTokenValue()
      }
    }).done(function(response){
      // for (var key in response){
      //   $("input[value='" + key + "'][name='measure_id']").parent().replaceWith(response[key])
      // }
      thisSection.replaceWith(response);
      selectable();
      selectCellsByID(previousCellIDs);
    })
  })
}

// --------- Edit Cell Attributes ---------
var changeRhyme = function(){
  $(document).on("click", ".change-rhyme", function(event){
    event.preventDefault();
    var allCells = $(".ui-selected");
    var cellIDs = getCellIDs(allCells);
    var quality = $(this).val();
    // refactor This is to get song id
    var songID = $("input[name='song-id']").attr("value");
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
    var cellIDs = getCellIDs(allCells);
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
    var cellIDs = getCellIDs(allCells);
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
    var cellIDs = getCellIDs(allCells);
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
      });
      selectNextCells();
    })
  })
}

var changeRhythm = function(){
  $(document).on("click", ".change-rhythm", function(event){
    event.preventDefault();
    var songID = $("input[name='song-id']").attr("value");
    var allCells = $(".ui-selected")
    var cellIDs = getCellIDs(allCells);
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
      selectCellsByID(cellIDs);
    })
  })
}


// --------- Open and Close Edit Menu ---------
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

// --------- Publication ---------
// Allows super users to publish a song
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

// Allows users to tag their song for publication
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

// --------- Tabbing and Adding Lyrics ---------
var tabToCell = function(){
  $(document).off("keydown", "body").on("keydown", "body", function(event){
    if (event.keyCode === 9){
      var selectedCell = $(".ui-selected");
      if (selectedCell.length){
        event.preventDefault();
        if (event.shiftKey){
          selectPreviousCells();
        } else {
          selectNextCells();
        }
      }
    }
  });
}

var submitLyrics = function(){
  $(document).off("keypress", ".replacement-lyrics").on("keypress", ".replacement-lyrics", function(event){
    if (event.keyCode === 13){
      $(".change-lyrics").click();
    }
  })
}

var focusLyrics = function(){
  $(document).off("keypress", "body").on("keypress", "body", function(event){
    $(".replacement-lyrics").focus();
  })
}

//--------------- HELPER METHODS -------------------
var getCSRFTokenValue = function(){
  return $('meta[name="csrf-token"]').attr('content');
}

var selectNextCells = function(){
  var selectedCells = $(".ui-selected");
  var nextCells = getNextCells(selectedCells);
  unselectCells(selectedCells);
  selectCells(nextCells);
}


var selectPreviousCells = function(){
  var selectedCells = $(".ui-selected");
  var previousCells = getPreviousCells(selectedCells);
  unselectCells(selectedCells);
  selectCells(previousCells);
}

// returns the next cell in the measure, or the first cell in the next measure, or the firt cell in the next section, or undefined if none of the above.
var getNextCells = function(currentCells){
  var nextCells = currentCells.map(function(){
    var cell = $(this);
    var nextCell;
    if (cell.next().length){
      nextCell = cell.next();
    } else if (cell.parents(".edit-measure").next().find(".col.select").first().length) {
      nextCell = cell.parents(".edit-measure").next().find(".col.select").first();
    } else {
      nextCell = cell.parents(".phrase-div").next().find(".col.select").first();
    }
    return nextCell;
  });
  return nextCells;
}

// returns previous cell in measure, or the last cell in previous measure, or the last cell in previous section, or undefined if none of the above.
var getPreviousCells = function(currentCells){
  var previousCells = currentCells.map(function(){
    var cell = $(this);
    var prevCell;
    if (cell.prev().length){
      prevCell = cell.prev();
    } else if (cell.parents(".edit-measure").prev().find(".col.select").last().length) {
      prevCell = cell.parents(".edit-measure").prev().find(".col.select").last();
    } else {
      prevCell = cell.parents(".phrase-div").prev().find(".col.select").last();
    }
    return prevCell;
  });
  return previousCells;
}


var selectCells = function(cells){
  // iterate through array of jQuery cells
  cells.each(function(){
    // if not undefined, select the cell
    if ($(this)){
      $(this).addClass("ui-selected");
    }
  });
}

var unselectCells = function(cells){
  // iterate through array of jQuery cells
  cells.each(function(){
    // if not undefined, unselect the cell
    if ($(this)){
      $(this).removeClass("ui-selected");
    }
  });
}

var getCellIDs = function(cells){
  var cellIDs = $.map(cells, function(cell){
      return $(cell).attr("name");
  });
  return cellIDs;
}

// I need this for cells in measures that are rendered with errors because the cells cannot be saved as jQuery objects (because they are replaced)
var selectCellsByID = function(cellIDs){
  // if cell with cellID exists, add stress
  for (var i = 0; i < cellIDs.length; i++){
    if ($('div.col[name="' + cellIDs[i] + '"]')){
      $('div.col[name="' + cellIDs[i] + '"]').addClass("ui-selected");
    }
  }
}