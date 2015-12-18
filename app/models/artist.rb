require_relative "stats_module"

class Artist < ActiveRecord::Base

  has_many :artists_songs
  has_many :songs, through: :artists_songs
  has_many :albums_artists
  has_many :albums, through: :albums_artists
  has_many :sections
  has_many :measures, through: :sections
  has_many :cells, through: :measures

  include Statistics

end
