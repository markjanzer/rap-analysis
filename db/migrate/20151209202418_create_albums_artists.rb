class CreateAlbumsArtists < ActiveRecord::Migration
  def change
    create_table :albums_artists do |t|
      t.integer :album_id, null: false
      t.integer :artist_id, null: false
    end
  end
end
