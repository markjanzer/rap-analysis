class AddErrorsAndTotalRhythmicDurationToMeasures < ActiveRecord::Migration
  def change
    add_column :measures, :errors, :boolean, default: :false
    add_column :measures, :total_rhythmic_duration, :float
  end
end
