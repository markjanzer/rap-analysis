class Section < ActiveRecord::Base
  belongs_to :song
  belongs_to :artist
  has_many :measures
end
