class Phrase < ActiveRecord::Base
  has_many :measures
  has_many :cells, through: :measures
  belongs_to :section

end
