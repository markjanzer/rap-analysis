class CreateJoinTableAlbumsArtists < ActiveRecord::Migration
  def change
    create_join_table :albums, :artists do |t|
      t.index :album_id
      t.index :artist_id
    end
  end
end
