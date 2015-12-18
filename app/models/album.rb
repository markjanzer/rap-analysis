require_relative "stats_module"

class Album < ActiveRecord::Base
  include Statistics

  has_many :albums_artists
  has_many :artists, through: :albums_artists
  has_many :songs
  has_many :sections, through: :songs
  has_many :measures, through: :sections
  has_many :cells, through: :measures
end
