module Statistics
  def average_end_rhyme_syllable_count
    (self.cells.where(end_rhyme: true).count) / (self.measures.count).to_f
  end

  def placement_of_stressed_syllables
    hash = {}
    self.cells.where(stressed: true).each do |cell|
      beginning = ((cell.note_beginning - 1)/60).to_s + "/16"
      hash[beginning] ||= 0
      hash[beginning] += 1
    end
    return hash
  end

  def placement_of_end_rhymes
    hash = {}
    self.cells.where(end_rhyme: true).each do |cell|
      beginning = ((cell.note_beginning - 1)/60).to_s + "/16"
      hash[beginning] ||= 0
      hash[beginning] += 1
    end
    return hash
  end

  def percent_of_rhyming_syllables
    self.cells.where.not(rhyme: nil).count/self.cells.where.not(content: "").count.to_f
  end

  def percent_of_measures_with_stress_on_beat_one
    stressed_one = self.measures.select do |measure|
      measure.cells.any? do |cell|
        cell.note_beginning == 1 && cell.stressed == true
      end
    end
    stressed_one.count / self.measures.count.to_f
  end
end