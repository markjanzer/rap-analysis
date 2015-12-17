class Song < ActiveRecord::Base
  has_many :artists_songs
  has_many :artists, through: :artists_songs
  has_many :sections
  belongs_to :transcriber, class_name: "User"
  belongs_to :album

  def sorted_sections
    sections = self.sections.sort_by do |section|
      section.id
    end
    return sections
  end
end
