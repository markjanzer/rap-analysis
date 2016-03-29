class CreatePhrases < ActiveRecord::Migration
  def change
    create_table :phrases do |t|
      t.integer :section_id
      t.integer :section_phrase_number
      t.integer :number_of_measures

      t.timestamps null: false
    end
  end
end
