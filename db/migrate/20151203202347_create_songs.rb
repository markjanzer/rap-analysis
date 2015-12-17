class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.integer :album_id
      t.integer :transcriber_id

      t.timestamps
    end
  end
end
