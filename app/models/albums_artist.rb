class AlbumsArtist < ActiveRecord::Base
  belongs_to :album
  belongs_to :artist
end
