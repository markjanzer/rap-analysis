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
    all_cells.each do |cell|
      cell.rhyme = params['quality']
      cell.save
    end
    render json: {quality: params['quality']}
  end

  def destroy
  end

  private

  def song_params
    params.permit(:name)
  end

end
