class CreateAlbums < ActiveRecord::Migration
  def change
    create_table :albums do |t|
      t.string :title
      t.integer :year

      t.integer :artist_id, null: false

      t.timestamps
    end
  end
end
