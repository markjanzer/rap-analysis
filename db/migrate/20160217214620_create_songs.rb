class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.string :region

      t.integer :album_id

      t.timestamps null: false
    end
  end
end
