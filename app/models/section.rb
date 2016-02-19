class Section < ActiveRecord::Base
  has_many :phrases

  has_many :artist_section
  has_many :artists, through: :artist_section
end
