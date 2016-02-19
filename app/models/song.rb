class Song < ActiveRecord::Base
  has_many :artist_song
  has_many :artists, through: :artist_song
  has_many :sections
end
