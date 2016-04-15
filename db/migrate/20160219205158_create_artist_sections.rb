class CreateArtistSections < ActiveRecord::Migration
  def change
    create_table :artist_sections do |t|
      t.integer :artist_id
      t.integer :section_id

      t.timestamps null: false
    end
  end
end
