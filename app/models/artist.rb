class Artist < ActiveRecord::Base
  has_many :artist_song
  has_many :songs, through: :artist_song

  has_many :album_artist
  has_many :albums, through: :album_artist

  has_many :artist_section
  has_many :sections, through: :artist_section

  def self.addOrCreateAndAddArtist(song_or_section, artist_name)
    unless artist_name.blank?
      Artist.create(name: artist_name) if Artist.where(name: artist_name).empty?
      song_or_section.artists << Artist.find_by(name: artist_name)
    end
  end


end
