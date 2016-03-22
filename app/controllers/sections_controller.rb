class SectionsController < ApplicationController

  def create
    section = Section.create(song_id: params["song-id"], section_number: params["section-number"], section_type: params["section-type"])

    # Do it without beats per measure first
    # refactor to use methods defined in each of the models
    Integer(params["phrases-in-section"]).times do |a|
      phrase = Phrase.create(section_id: section.id, section_phrase_number: a)
      section.phrases << phrase
      Integer(params["measures-per-phrase"]).times do |b|
        # Section measure number needs to be figured out
        measure = Measure.create(phrase_id: phrase.id, phrase_measure_number: b)
        phrase.measures << measure
        # Needs to be changed to allow for songs without 4 beats per measure
        subdivision = Integer(params["beat-subdivision"])
        subdivision.times do |c|
          cell = Cell.create(measure_id: measure.id, measure_cell_number: c, note_beginning: (c * 960/subdivision)+1, note_duration:  960/subdivision)
          measure.cells << cell
        end
      end
    end
    render template: "songs/_edit_song", locals: { song: Song.find_by(id: Integer(params["song-id"]))}, layout: false
  end

end
