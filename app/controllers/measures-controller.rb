post '/measures' do
  decimal_durations = params[:cellLengths].split(" ").map { |fraction| Rational(fraction).to_f }
  @measure = Measure.create(section_id: params[:sectionID])
  decimal_durations.inject(1) do |sum, length|
    Cell.create(measure_id: @measure.id, note_beginning: sum, note_duration: length*960)
    sum + length*960
  end
  erb :'partials/textarea-measure', layout: false

end

put '/measures/:id/text' do #THIS IS NOT RESTFUL
  measure = Measure.find(params[:measure_id])
  measure.cells.each do |cell|
    cell.update(content: params[cell.id.to_s])
  end
  { cells: measure.cells }.to_json
end


