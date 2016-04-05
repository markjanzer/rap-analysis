class SectionsController < ApplicationController

  def new
    render template: "songs/_new_section_form", locals: { section_number: params["sectionNumber"]}, layout: false
  end

  def create
    section = Section.create(song_id: params["songID"], section_number: params["section-number"], section_type: params["section-type"], default_subdivision: Integer(params["beat-subdivision"]), number_of_pickup_measures: params["pickup-measures"].to_i)

    # refactor add beats per measure
    section.populate_section(params["measures-in-section"].to_i, params["measures-per-phrase"].to_i)

    # refactor render section
    render template: "songs/_edit_song", locals: { song: Song.find_by(id: Integer(params["songID"]))}, layout: false
  end

  def destroy
    section = Section.find(params["sectionID"])
    section.destroy
    render json: {"destroyed?": true}
  end

  def cancel_section_creation
    render template: "songs/_add_section_button", locals: { section_number: params["sectionNumber"]}, layout: false
  end

end
