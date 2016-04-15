class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.string :region

      t.integer :album_id
      t.integer :transcriber_id

      t.boolean :published, default: false
      t.boolean :tagged_for_publication, default: false

      t.timestamps null: false
    end
  end
end
