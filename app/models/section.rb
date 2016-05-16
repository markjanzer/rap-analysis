class Section < ActiveRecord::Base

  has_many :phrases

  has_many :measures, through: :phrases

  has_many :artist_section
  has_many :artists, through: :artist_section

  belongs_to :song

  # refactor belongs to songs too
  def comma_separated_artists
    artist_names = self.artists.map{ |artist| artist.name }
    artist_names.join(", ")
  end

  def ordered_phrases
    ordered = []
    self.phrases.order(:section_phrase_number).each do |phrase|
      ordered << phrase
    end
    ordered
  end

  def ordered_measures
    ordered = []
    self.measures.order(:section_measure_number).each do |measure|
      ordered << measure
    end
    ordered
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
      phrase
    end
  end

  def delete_all_measures_from_phrases
    self.phrases.each do |phrase|
      phrase.measures.delete_all
    end
  end

  def update_measures
    ordered_measures = self.ordered_measures
    ordered_phrases = self.ordered_phrases
    self.delete_all_measures_from_phrases
    pickup_phrase = ordered_phrases.shift
    # Add appropriate number of pickup measures to the pickup_phrase. refactor not sure if negatives will work out well
    self.number_of_pickup_measures.times do |i|
      measure = ordered_measures.shift
      measure.update(section_measure_number: i, phrase_measure_number: i - self.number_of_pickup_measures)
      pickup_phrase.measures << measure
    end

    ordered_measures.each.with_index.reduce(ordered_phrases.shift) do |phrase, (measure, index)|
      # if phrase is full and there are no phrases left, create a new phrase for the section
      if phrase.measures.count == phrase.number_of_measures && ordered_phrases.empty?
        phrase = Phrase.create(section_id: self.id, section_phrase_number: phrase.section_phrase_number + 1, number_of_measures: phrase.number_of_measures)
      # else if the phrase is full, move on to the next phrase
      elsif phrase.measures.count == phrase.number_of_measures
        phrase = ordered_phrases.shift
      end
      # Add measure to phrase
      measure.update(phrase_id: nil)
      phrase.measures << measure
      measure.update(section_measure_number: index + self.number_of_pickup_measures, phrase_measure_number: phrase.measures.count + 1)
      phrase
    end
  end
end