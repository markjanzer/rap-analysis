class SongsController < ApplicationController
  def index
  end

  def show
    @song = Song.find(params[:id])
  end

  def new
  end

  def edit
    @song = Song.find(params[:id])
  end

  def create
    @song = Song.create(song_params)
    artist = Artist.create(name: params[:artist]) if Artist.all.where(name: params[:artist]).empty?
    @song.artists << Artist.find_by(name: params[:artist])
    album = Album.create(title: params[:album]) if Album.all.where(title: params[:album]).empty?
    Album.find_by(title: params[:album]).songs << @song

    # Add default music values for measures per musical phrase, beats per measure, beat subdivision
    redirect_to edit_song_path(@song)
  end

  def update
  end

  def change_rhyme
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_cells.each do |cell|
      cell.update(rhyme: params['quality'])
    end
    render json: {quality: params['quality']}
  end

  def change_rhythm
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_cells.each { |cell| cell.update(note_duration: params["duration"].to_i) }
    all_measures = all_cells.map { |cell| cell.measure }.uniq
    measures_hash = {}
    all_measures.each do |measure|
      measure.update_measure
      if measure.rhythmic_errors
        measures_hash[measure.id] = render_to_string partial: "edit_invalid_measure", locals: {measure: measure}
      else
        measures_hash[measure.id] = render_to_string partial: "edit_measure", locals: {measure: measure}
      end
    end
    render json: measures_hash
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

  def delete_cell
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_measures = all_cells.map { |cell| cell.measure }.uniq
    all_cells.each { |cell| cell.destroy }
    measures_hash = {}
    all_measures.each do |measure|
      measure.update_measure
      if measure.rhythmic_errors
        measures_hash[measure.id] = render_to_string partial: "edit_invalid_measure", locals: {measure: measure}
      else
        measures_hash[measure.id] = render_to_string partial: "edit_measure", locals: {measure: measure}
      end
    end
    render json: measures_hash
  end

  def add_cell_before
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    all_measures = all_cells.map { |cell| cell.measure }.uniq
    default_duration = all_cells[0].note_duration
    all_cells.each do |cell|
      # if add_cell_after, the only difference is cell_placement = cell.measure_cell_number + 1
      cell_placement = cell.measure_cell_number
      measure = cell.measure
      cells_in_measure = measure.ordered_cells
      cell_added = false
      cells_in_measure.each_with_index do |cell, i|
        if i == cell_placement
          cell.update(measure_cell_number: i + 1)
          Cell.create(note_duration: default_duration, measure_cell_number: i)
          next
        end
        if cell_added
          cell.update(measure_cell_number: i + 1)
        end
      end
      if !cell_added
        Cell.create(note_duration: default_duration, measure_cell_number: cells_in_measure.length)
      end
    end

    measures_hash = {}
    all_measures.each do |measure|
      measure.update_measure
      if measure.rhythmic_errors
        measures_hash[measure.id] = render_to_string partial: "edit_invalid_measure", locals: {measure: measure}
      else
        measures_hash[measure.id] = render_to_string partial: "edit_measure", locals: {measure: measure}
      end
    end
    render json: measures_hash
  end


  def destroy
  end

  private

  def song_params
    params.permit(:name)
  end

end
