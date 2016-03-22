class CreateMeasures < ActiveRecord::Migration
  def change
    create_table :measures do |t|
      t.integer :phrase_id
      t.integer :section_measure_number
      t.integer :phrase_measure_number
      t.float :total_rhythmic_value
      t.boolean :rhythmic_errors

      t.timestamps null: false
    end
  end
end
