class HomepageController < ApplicationController
  def index
    @songs = Song.all
  end
end
