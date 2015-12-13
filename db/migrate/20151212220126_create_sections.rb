class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.integer :song_id
      t.integer :section_number
      t.string :section_type, default: "verse"
    end
  end
end
