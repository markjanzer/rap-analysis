class ArtistSection < ActiveRecord::Base
  belongs_to :artist
  belongs_to :section
end
