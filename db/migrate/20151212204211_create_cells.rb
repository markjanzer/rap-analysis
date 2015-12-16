class CreateCells < ActiveRecord::Migration
  def change
    create_table :cells do |t|
      t.integer :measure_id
      t.integer :note_beginning
      t.integer :note_duration
      t.boolean :stressed, default: false
      t.boolean :end_rhyme, default: false
      t.string :rhyme
      t.string :content
    end
  end
end
