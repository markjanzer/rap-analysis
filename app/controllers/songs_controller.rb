class SongsController < ApplicationController
  # RESTFUL Routes
  def create
    @song = Song.create(song_params)
    @song.add_all_artists(params)
    Album.addSongOrCreateAlbumAndAddSong(@song, params[:album])
    if current_user
      @song.update(trans  criber_id: current_user.id)
      current_user.songs << @song
    end
    # Add default music values for measures per musical phrase, beats per measure, beat subdivision
    redirect_to edit_song_path(@song)
  end

  def show
    @song = Song.find(params[:id])
  end

  def edit
    @song = Song.find(params[:id])
  end

  def destroy
    song = Song.find_by(id: params[:id])
    song.destroy
    redirect_to '/'
  end

  # Section creation and deletion
  def create_section
    song = Song.find(params["id"])
    section_number = params["section-number"].to_i
    song.add_section_with_number_n(section_number)
    section = Section.create(song_id: song.id, section_number: section_number, section_type: params["section-type"], default_subdivision: Integer("16"), number_of_pickup_measures: params["pickup-measures"].to_i)

    # refactor add beats per measure
    section.populate_section(params["measures-in-section"].to_i, params["measures-per-phrase"].to_i)

    Artist.addOrCreateAndAddArtist(section, params["artist"])
    # check if artist-1 returns true all the time
    if !params["artist-1"].blank?
      artist_param = "artist-1"
      artist_counter = 1
      while params[artist_param]
        Artist.addOrCreateAndAddArtist(section, params[artist_param])
        artist_counter += 1
        artist_param = "artist-" + artist_counter.to_s
      end
    end
    # refactor render section
    render template: "songs/_edit_song", locals: { song: song}, layout: false
  end

  def delete_section
    section = Section.find(params["sectionID"])
    song = Song.find(params["id"])
    song.remove_section_with_number_n(section.section_number)
    section.destroy
    render json: {:"destroyed?" => true}
  end

  def render_section_form
    song = Song.find(params[:id])
    artist_names = song.artists.map{ |artist| artist.name }
    render template: "songs/_new_section_form", locals: { section_number: params["sectionNumber"], artist_names: artist_names }, layout: false
  end

  def cancel_section_form
    render template: "songs/_add_section_button", locals: { section_number: params["sectionNumber"]}, layout: false
  end

  # Remove and Render Warnings
  def render_delete_song_warning
    render template: "songs/_delete_song_warning", layout: false
  end

  def render_delete_section_warning
    render template: "songs/_delete_section_warning", layout: false
  end

  # Add and Remove Measures
  def add_measure_after
    section = Cell.find(params["cellID"].to_i).measure.phrase.section
    last_phrase = section.ordered_phrases.last

    if last_phrase.measures.count == last_phrase.number_of_measures
      last_phrase = Phrase.create(section_phrase_number: last_phrase.section_phrase_number + 1, number_of_measures: last_phrase.number_of_measures)
      section.phrases << last_phrase
    end

    added_measure = Measure.create_measure_and_cells(last_phrase.id, last_phrase.measures.count, section.ordered_measures.last.section_measure_number + 1, section.default_subdivision)
    last_phrase.measures << added_measure

    render template: "songs/_edit_section_open_edit_menu", locals: { section: section }, layout: false
  end

  # refactor use section_update
  def add_measure_before
    section = Cell.find(params["cellID"].to_i).measure.phrase.section
    first_phrase = section.ordered_phrases.first
    if first_phrase.measures.count == first_phrase.number_of_measures
      first_phrase = Phrase.create(section_phrase_number: first_phrase.section_phrase_number - 1,
        number_of_measures: first_phrase.number_of_measures)
      section.phrases << first_phrase
    end

    added_measure = Measure.create_measure_and_cells(first_phrase.id, (first_phrase.number_of_measures - 1 - first_phrase.measures.count), 0, section.default_subdivision )
    first_phrase.measures << added_measure

    render template: "songs/_edit_section_open_edit_menu", locals: { section: section }, layout: false
  end

  def delete_measure
    measure = Measure.find(params["measureID"])
    section = measure.phrase.section
    measure.delete
    section.update_measures

    render template: "songs/_edit_section_open_edit_menu", locals: { section: section }, layout: false
  end

  # Add and Remove Cells
  def add_cell
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_measures = all_cells.map { |cell| cell.measure }.uniq
    default_duration = all_cells[0].note_duration
    all_cells.each_with_index do |cell, index|
      if params["before_or_after"] == "before"
        cell_placement = cell.measure_cell_number
      elsif params["before_or_after"] == "after"
        cell_placement = cell.measure_cell_number + 1
      end
      measure = cell.measure
      cells_in_measure = measure.ordered_cells
      cell_added = false
      cells_in_measure.each_with_index do |cell, i|
        if i == cell_placement
          cell.update(measure_cell_number: i + 1)
          measure.cells << Cell.create(note_duration: default_duration, measure_cell_number: i)
          cell_added = true
          next
        end
        if cell_added
          cell.update(measure_cell_number: i + 1)
        end
      end
      if !cell_added
        measure.cells << Cell.create(note_duration: default_duration, measure_cell_number: cells_in_measure.length)
      end
    end

    render json: update_measures_return_hash(all_measures)
  end

  def delete_cell
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    section = all_cells.first.measure.phrase.section
    all_measures = all_cells.map { |cell| cell.measure }.uniq
    all_cells.each { |cell| cell.destroy }
    # If all cells are deleted from a measure, delete the measure. If a measure is deleted, call update_measures on the section, and render the whole section, else just update the measures.
    if all_measures.reduce(false) do |bool, measure|
        if measure.cells.count == 0
          measure.destroy
          bool = true
        else
          measure.check_for_rhythmic_errors
        end
        bool
      end
      section.update_measures
    end
    # render json: update_measures_return_hash(all_measures)
    render template: "songs/_edit_section_open_edit_menu", locals: { section: section }, layout: false
  end

  # Edit Cell Attributes
  def change_rhyme
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_cells.each do |cell|
      cell.update(rhyme: params['quality'])
    end
    render json: {quality: params['quality']}
  end

  def change_stress
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    new_stressed_value = !all_cells.first.stressed
    all_cells.each do |cell|
      cell.update(stressed: new_stressed_value)
    end
    render json: {quality: new_stressed_value}
  end

  def change_end_rhyme
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    new_end_rhyme_value = !all_cells.first.end_rhyme
    all_cells.each do |cell|
      cell.update(end_rhyme: new_end_rhyme_value)
    end
    render json: {quality: new_end_rhyme_value}
  end

  def change_lyrics
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_cells.each do |cell|
      cell.update(content: params["lyrics"])
    end
    # refactor unecessary, might be nice though if I want to show errors
    render json: {quality: params["lyrics"]}
  end

  def change_rhythm
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_cells.each { |cell| cell.update(note_duration: params["duration"].to_i) }
    all_measures = all_cells.map { |cell| cell.measure }.uniq
    render json: update_measures_return_hash(all_measures)
  end

  # Open and Close Edit Menu
  def open_edit_menu
    render template: "songs/_edit_menu", layout: false
  end

  def close_edit_menu
    render template: "songs/_open_edit_menu_button", layout: false
  end

  # Publication
  def tag_for_publication
    song = Song.find(params[:id])
    song.update(tagged_for_publication: true)
    render template: "/songs/_publication_status", locals: { song: song }, layout: false
  end

  def publish
    song = Song.find(params["id"])
    value = params["value"] == "true"
    song.update(published: value)
    if value
      render template: "songs/_unpublish_button", layout: false
    else
      render template: "songs/_publish_button", layout: false
    end
  end

  private

  def song_params
    params.permit(:name)
  end

  def update_measures_return_hash(all_measures)
    # refactor is this redundant because the same process is done in _edit_phrase.html.erb?
    measures_hash = {}
    all_measures.each do |measure|
      measure.update_measure
      if measure.rhythmic_errors
        measures_hash[measure.id] = render_to_string partial: "edit_invalid_measure", locals: {measure: measure}
      else
        measures_hash[measure.id] = render_to_string partial: "edit_measure", locals: {measure: measure}
      end
    end
    measures_hash
  end

end
