class Section < ActiveRecord::Base
  belongs_to :song
  has_many :measures
end
