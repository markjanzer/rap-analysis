class Measure < ActiveRecord::Base
  has_many :cells

  belongs_to :phrase

  def ordered_cells
    cells = self.cells.sort_by { |cell| cell.measure_cell_number }
    return cells
  end

  def update_measure
    self.update_cell_numbers
    self.update_cell_beginnings
    self.check_for_rhythmic_errors
  end

  def update_cell_numbers
    ordered_cells = self.ordered_cells
    ordered_cells.each_with_index do |cell, index|
      cell.update(measure_cell_number: index)
    end
  end

  def update_cell_beginnings
    cells = self.ordered_cells
    cells.inject(1) do |location, cell|
      cell.update(note_beginning: location)
      location + cell.note_duration
    end
  end

  def check_for_rhythmic_errors
    self.update(total_rhythmic_value: self.cellws.inject(0) { |sum, cell| sum + cell.note_duration } / 960.0)
    self.total_rhythmic_value == 1 ? self.update(rhythmic_errors: false) : self.update(rhythmic_errors: true)
  end

  def self.create_measure_and_cells(phrase_id, phrase_measure_number, section_measure_number, subdivision)
    measure = Measure.create(phrase_id: phrase_id, phrase_measure_number: phrase_measure_number, section_measure_number: section_measure_number)
    subdivision.times do |c|
      cell = Cell.create(measure_id: measure.id, measure_cell_number: c, note_beginning: (c * 960/subdivision)+1, note_duration:  960/subdivision)
      measure.cells << cell
    end
    return measure
  end

end
