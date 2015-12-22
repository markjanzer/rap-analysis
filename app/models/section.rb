class Section < ActiveRecord::Base
  belongs_to :song
  belongs_to :artist
  has_many :phrases
  has_many :measures
  has_many :cells, through: :measures

  def sorted_measures
    measures = self.measures.sort_by do |measure|
      section.id
    end
    return measures
  end
end
