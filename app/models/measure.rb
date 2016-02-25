class Measure < ActiveRecord::Base
  has_many :cells

  def ordered_cells
    cells = self.cells.sort_by { |cell| cell.measure_cell_number }
    return cells
  end
end
