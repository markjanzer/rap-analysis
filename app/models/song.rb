class Song < ActiveRecord::Base
  include Statistics

  has_many :artist_song
  has_many :artists, through: :artist_song

  has_many :sections
  has_many :phrases, through: :sections
  has_many :measures, through: :phrases
  has_many :cells, through: :measures

  belongs_to :album
  belongs_to :transcriber, class_name: :User

  # Searches through artists in params and adds them to song
  def add_all_artists(params)
    artist_param = "artist-0"
    artist_counter = 0
    while params[artist_param]
      Artist.addOrCreateAndAddArtist(self, params[artist_param])
      artist_counter += 1
      artist_param = "artist-" + artist_counter.to_s
    end
  end

  # refactor as module to belong to song, section, and album
  def comma_separated_artists
    artist_names = self.artists.map{ |artist| artist.name }
    artist_names.join(", ")
  end

  def ordered_sections
    ordered = []
    self.sections.order(:section_number).each do |section|
      ordered << section
    end
    ordered
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
