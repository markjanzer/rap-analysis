class Measure < ActiveRecord::Base
  has_many :cells
  belongs_to :section
end

