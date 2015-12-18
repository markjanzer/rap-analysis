class Artist < ActiveRecord::Base
  has_many :artists_songs
  has_many :songs, through: :artists_songs
  has_many :albums_artists
  has_many :albums, through: :albums_artists
  has_many :sections
  has_many :measures, through: :sections
  has_many :cells, through: :measures

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


end
