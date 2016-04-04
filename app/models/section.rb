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

  def ordered_measures
    measures = self.measures.sort_by { |measure| measure.section_measure_number }
    return measures
  end

  # Fill a section with phrases and cells and number them appropriately
  def populate_section(measures_in_section, measures_per_phrase)
    # refactor don't make phrase if no pickup phrases are necessary
    pickup_phrase = Phrase.create(section_id: self.id, section_phrase_number: 0, number_of_measures: measures_per_phrase)
    self.phrases << pickup_phrase
    self.number_of_pickup_measures.times do |i|
      pickup_phrase.measures << Measure.create_measure_and_cells(pickup_phrase.id, pickup_phrase.number_of_measures - (self.number_of_pickup_measures + i), i, self.default_subdivision)
    end

    (0..(measures_in_section - 1)).reduce(nil) do |phrase, i|
      phrase_measure_number = i % (measures_per_phrase)
      if (phrase_measure_number == 0)
        phrase = Phrase.create(section_id: self.id, section_phrase_number: 1 + (i/measures_per_phrase), number_of_measures: measures_per_phrase)
        self.phrases << phrase
      end
      phrase.measures << Measure.create_measure_and_cells(phrase.id, phrase_measure_number, self.number_of_pickup_measures + i, self.default_subdivision)
      p phrase.measures.count
      phrase
    end
  end

  def update_measures
    # is upadting all measures to remove associations to phrases necessary?
    # self.phrases.update(measures: [])
    ordered_measures = self.ordered_measures
    ordered_phrases = self.ordered_phrases
    # self.measures.update_all(phrase_id: 0)

    pickup_phrase = ordered_phrases.shift
    self.number_of_pickup_measures.times do |i|
      measure = ordered_measures.shift
      measure.update(section_measure_number: i, phrase_measure_number: i - self.number_of_pickup_measures)
      pickup_phrase.measures << measure
    end

    ordered_measures.each.with_index.reduce(ordered_phrases.shift) do |phrase, (measure, index)|
      if phrase.measures.count == phrase.number_of_measures && ordered_phrases.empty?
        phrase = Phrase.create(section_id: self.id, section_phrase_number: phrase.section_phrase_number + 1, number_of_measures: phrase.number_of_measures)
      elsif phrase.measures.count == phrase.number_of_measures
        phrase = ordered_phrases.shift
      end
      measure.update(section_measure_number: index + self.number_of_pickup_measures, phrase_measure_number: phrase.measures.count + 1)
      phrase.measures << measure
      phrase
    end
  end
end