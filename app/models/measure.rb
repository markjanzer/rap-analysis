class Measure < ActiveRecord::Base
  has_many :cells
  belongs_to :section

  def sorted_cells
    sorted = self.cells.sort_by do |cell|
      cell.id
    end
    return sorted
  end
end

