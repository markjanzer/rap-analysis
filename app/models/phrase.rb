class Phrase < ActiveRecord::Base
  has_many :measures

  belongs_to :section

  def ordered_measures
    measures = self.measures.sort_by { |measure| measure.phrase_measure_number }
    return measures
  end
end
