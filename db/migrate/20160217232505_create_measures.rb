class CreateMeasures < ActiveRecord::Migration
  def change
    create_table :measures do |t|
      t.integer :phrase_id
      t.integer :section_measure_number
      t.integer :phrase_measure_number

      t.timestamps null: false
    end
  end
end
