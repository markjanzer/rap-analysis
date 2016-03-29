class Section < ActiveRecord::Base
  has_many :phrases

  has_many :measures, through: :phrases

  has_many :artist_section
  has_many :artists, through: :artist_section

  belongs_to :song

  def ordered_phrases
    phrases = self.phrases.sort_by { |phrase| phrase.section_phrase_number }
    return phrases
  end
end
