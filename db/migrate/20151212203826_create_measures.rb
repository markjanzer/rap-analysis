class CreateMeasures < ActiveRecord::Migration
  def change
    create_table :measures do |t|
      t.integer :section_id
      t.integer :phrase_id
      t.integer :section_measure_number
      t.integer :phrase_measure_number
    end
  end
end
