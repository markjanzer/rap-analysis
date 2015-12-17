class Section < ActiveRecord::Base
  belongs_to :song
  belongs_to :artist
  has_many :measures

  def sorted_measures
    measures = self.measures.sort_by do |measure|
      section.id
    end
    return measures
  end
end
