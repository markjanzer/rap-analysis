class Artist < ActiveRecord::Base
  has_many :artist_song
  has_many :songs, through: :artist_song

  has_many :album_artist
  has_many :albums, through: :album_artist

  has_many :artist_section
  has_many :sections, through: :artist_section
end
