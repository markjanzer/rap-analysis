class Phrase < ActiveRecord::Base
  has_many :measures

  belongs_to :section
end
