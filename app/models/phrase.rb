class Phrase < ActiveRecord::Base
  has_many :measures

  belongs_to :section

  def ordered_measures
    ordered = []
    self.measures.order(:phrase_measure_number).each do |measure|
      ordered << measure
    end
    ordered
  end
end
