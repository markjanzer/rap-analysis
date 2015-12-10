class CreateArtistsSongs < ActiveRecord::Migration
  def change
    create_table :artists_songs do |t|
      t.integer :artist_id, null: false
      t.integer :song_id, null: false
    end
  end
end
