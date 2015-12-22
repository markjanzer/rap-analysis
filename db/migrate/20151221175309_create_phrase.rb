class CreatePhrase < ActiveRecord::Migration
  def change
    create_table :phrases do |t|
      t.integer :phrase_number
      t.integer :phrase_measure_length, default: 4
    end
  end
end
