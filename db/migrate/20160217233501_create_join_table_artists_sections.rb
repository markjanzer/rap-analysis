class CreateJoinTableArtistsSections < ActiveRecord::Migration
  def change
    create_join_table :artists, :sections do |t|
      t.index :section_id
      t.index :artist_id
    end
  end
end
