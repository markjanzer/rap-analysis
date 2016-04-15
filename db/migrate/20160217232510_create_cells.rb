class CreateCells < ActiveRecord::Migration
  def change
    create_table :cells do |t|
      t.integer :measure_id
      t.integer :measure_cell_number
      t.integer :note_beginning
      t.integer :note_duration
      t.boolean :stressed, default: false
      t.boolean :end_rhyme, default: false
      t.integer :rhyme, default: 0
      t.string :content, default: nil

      t.timestamps null: false
    end
  end
end
