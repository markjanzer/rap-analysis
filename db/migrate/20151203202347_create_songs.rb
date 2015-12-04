class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.integer :album_id, null: false
      t.timestamps
    end
  end
end
