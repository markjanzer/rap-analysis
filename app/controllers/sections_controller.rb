class SectionsController < ApplicationController

  def create
    @section = Section.create(song_id: params["song-id"], section_number: params["section-number"], type: params["section-type"])

    # Do it without beats per measure first

    Integer(params["phrases-in-section"]).times do |a|
      phrase = Phrase.create(section_id: @section.id, section_phrase_number: n)
      Integer(params["measures-per-phrase"]).times do |b|
        # Section measure number needs to be figured out
        measure = Measure.create(phrase_id: phrase.id, phrase_measure_number: b)
        # Needs to be changed to allow for songs without 4 beats per measure
        Integer(params["beat-subdivision"]).times do |c|
          Cell.create(measure_id: measure.id, measure_cell_number: c, )

  end

end
