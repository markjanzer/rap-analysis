module Statistics

  def percent_of_rhyming_syllables
    self.cells.where.not(rhyme: 0).count/self.cells.where.not(content: nil).count.to_f
  end

  def percent_of_measures_with_stress_on_beat_one
    stressed_one = self.measures.select do |measure|
      measure.cells.any? do |cell|
        cell.note_beginning == 1 && cell.stressed == true
      end
    end
    stressed_one.count / self.measures.count.to_f
  end

  def measures_with_end_rhyme
    self.measures.select do |measure|
      measure.cells.any? do |cell|
        cell.stressed
      end
    end
  end

  def average_end_rhyme_syllable_count
    (self.cells.where(end_rhyme: true).count) / (self.measures_with_end_rhyme.count).to_f
  end

  def placement_of_stressed_syllables
    hash = {}
    self.cells.where(stressed: true).each do |cell|
      # edge case of first note
      beginning = ((cell.note_beginning - 1)/960.0).to_s.to_r
      hash[beginning] ||= 0
      hash[beginning] += 1
    end
    sorted_array = []
    hash.keys.sort.each do |key|
      sorted_array.push({onset: key, quantity: hash[key]})
    end
    sorted_array
  end

  def placement_of_end_rhymes
    hash = {}
    self.cells.where(end_rhyme: true).each do |cell|
      # edge case of first note
      beginning = ((cell.note_beginning - 1)/960.0).to_s.to_r
      hash[beginning] ||= 0
      hash[beginning] += 1
    end
    sorted_array = []
    hash.keys.sort.each do |key|
      sorted_array.push({onset: key, quantity: hash[key]})
    end
    sorted_array
  end

end