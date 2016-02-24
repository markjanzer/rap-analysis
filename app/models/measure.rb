class Measure < ActiveRecord::Base
  has_many :cells

  def ordered_cells
    cells = this.cells.sort_by { |cell| cell.measure_number }
    return cells
  end
end
