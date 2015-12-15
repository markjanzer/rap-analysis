require 'json'

post '/sections' do
  section = Section.create(artist_id: params["section-artist-id"], song_id: params["song-id"], section_type: params["section-type"])
  puts section
  { artist_name: Artist.find(section.artist_id).name, section: section }.to_json
end

