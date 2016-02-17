class SongsController < ApplicationController
  def index
  end

  def show
  end

  def new
    @song = Song.new
  end

  def edit
  end

  def create
    @song = Song.create()
    redirect_to edit_song_path(@song)
  end

  def update
  end

  def destroy
  end

end
