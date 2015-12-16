put "/cells/:id" do
  cell = Cell.find(params[:id].to_s)
  quality = params[:quality]
  @measure = cell.measure
  p params

  case quality
  when "end-rhyme"
    # puts "Wtf are we in here too?"
    cell.end_rhyme = !cell.end_rhyme
    # changed_quality = cell.endRhyme
  when "stressed"
    cell.stressed = !cell.stressed
    # changed_quality = cell.stressed
  else
    # puts "WE GOT TO RHYME"
    cell.rhyme = quality
    # changed_quality = cell.rhyme
  end
  cell.save

  erb :'/partials/button-measure', layout: false

end

