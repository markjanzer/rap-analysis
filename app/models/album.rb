class Album < ActiveRecord::Base
  has_many :album_artist
  has_many :artists, through: :album_artist

  has_many :songs
end
