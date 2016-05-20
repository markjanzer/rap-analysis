describe Song, '#comma_separated_artists' do
  it 'returns artist names separated by commas' do
    # setup
    song = create(:song)
    params = {'artist-0': "Chance the Rapper", 'artist-1': "Krizz Kaliko", 'artist-2': "Lil B"}
    song.add_all_artists(params)

    # exercise
    csa = song.comma_separated_artists

    # verify
    expect(csa).to eq "Chance the Rapper, Krizz Kaliko, Lil B"

    # teardown handled by RSpec?
  end
end