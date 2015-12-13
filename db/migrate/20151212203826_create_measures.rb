class CreateMeasures < ActiveRecord::Migration
  def change
    create_table :measures do |t|
      # t.integer :section_id
      # t.integer :measure_number
    end
  end
end
