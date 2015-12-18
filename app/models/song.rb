class Song < ActiveRecord::Base
  has_many :artists_songs
  has_many :artists, through: :artists_songs
  belongs_to :transcriber, class_name: "User"
  belongs_to :album
  has_many :sections
  has_many :measures, through: :sections
  has_many :cells, through: :measures

  def sorted_sections
    sections = self.sections.sort_by do |section|
      section.id
    end
    return sections
  end
end
