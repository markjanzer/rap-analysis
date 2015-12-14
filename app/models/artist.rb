class Artist < ActiveRecord::Base
  has_many :artists_songs
  has_many :songs, through: :artists_songs
  has_many :albums_artists
  has_many :albums, through: :albums_artists
  has_many :sections
end
