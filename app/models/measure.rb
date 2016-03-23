class Measure < ActiveRecord::Base
  has_many :cells

  def ordered_cells
    cells = self.cells.sort_by { |cell| cell.measure_cell_number }
    return cells
  end

  def update_measure
    self.update_cell_beginnings
    self.check_for_rhythmic_errors
  end

  def update_cell_beginnings
    cells = self.ordered_cells
    cells.inject(1) do |location, cell|
      cell.update(note_beginning: location)
      location + cell.note_duration
    end
  end

  def check_for_rhythmic_errors
    self.update(total_rhythmic_value: self.cells.inject(0) { |sum, cell| sum + cell.note_duration } / 960.0)
    self.total_rhythmic_value == 1 ? self.update(rhythmic_errors: false) : self.update(rhythmic_errors: true)
  end

end
