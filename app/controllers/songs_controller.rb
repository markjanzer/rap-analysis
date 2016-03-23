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
    all_cells = params["cellIDs"].map do |cell_id|
      Cell.find(cell_id.to_i)
    end
    if params["quality"] == "stressed"
      new_stressed_value = !all_cells.first.stressed
      all_cells.each do |cell|
        cell.update(stressed: new_stressed_value)
      end
      render json: {quality: new_stressed_value}

    elsif params["quality"] == "end-rhyme"
      new_end_rhyme_value = !all_cells.first.end_rhyme
      all_cells.each do |cell|
        cell.update(end_rhyme: new_end_rhyme_value)
      end
      render json: {quality: new_end_rhyme_value}

    elsif params["quality"] == "lyrics"
      all_cells.each do |cell|
        cell.update(content: params["lyrics"])
      end
      # refactor unecessary, might be nice though if I want to show errors
      render json: {quality: params["lyrics"]}

    elsif params["quality"] == "rhythm"
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

    else
      all_cells.each do |cell|
        cell.update(rhyme: params['quality'])
      end
      render json: {quality: params['quality']}
    end
  end

  def destroy
  end

  private

  def song_params
    params.permit(:name)
  end

end
