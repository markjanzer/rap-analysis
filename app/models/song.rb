class Song < ActiveRecord::Base
  has_many :artist_song
  has_many :artists, through: :artist_song

  has_many :sections
  has_many :phrases, through: :sections
  has_many :measures, through: :phrases
  has_many :cells, through: :measures

  belongs_to :album

  # refactor as module to belong to song, section, and album
  def comma_separated_artists
    artist_names = self.artists.map{ |artist| artist.name }
    artist_names.join(", ")
  end

  def ordered_sections
    sections = self.sections.sort_by { |section| section.section_number}
    return sections
  end

  # refactor use .update_all("section_number = section_number + 1")
  def add_section_with_number_n(n)
    self.sections.where("section_number >= ?", n).each do |section|
      section.update(section_number: section.section_number + 1)
    end
  end

  # refactor use .update_all("section_number = section_number - 1")
  def remove_section_with_number_n(n)
    self.sections.where("section_number > ?", n).each do |section|
      section.update(section_number: section.section_number - 1)
    end
  end
end
