class Song < ActiveRecord::Base
  has_many :artists_songs
  has_many :artists, through: :artists_songs
  belongs_to :user
  belongs_to :album
end
