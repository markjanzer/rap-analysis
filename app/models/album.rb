class Album < ActiveRecord::Base
  has_many :album_artist
  has_many :artists, through: :album_artist

  has_many :songs

  def self.addSongOrCreateAlbumAndAddSong(song, album_name)
    Album.create(title: album_name) if Album.where(title: album_name).empty?
    Album.find_by(title: album_name).songs << song
  end
end
