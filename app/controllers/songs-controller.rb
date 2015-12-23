
get '/songs' do
  @songs = Song.all
  current_user
  erb :'songs/index'
end

get '/songs/new' do
  erb :'songs/new'
end

get '/songs/:id' do
  @song = Song.find(params[:id])
  @artists = @song.artists
  @album = @song.album
  erb :'songs/show'
end

post '/songs' do
  # Create Album and Artist if they do not already exist
  # For each of the params with a key of artist-#, create the artist if they do not alredy
  # Exist. Add all of these artist to the song
  byebug
  artist_keys = params.keys.select { |key| key.slice(0, 6) == "artist" }
  artist_names = artist_keys.map do |key|
    params[key]
  end
  artist_names.each do |artist_name|
    Artist.create(name: params[artist_name]) if Artist.find_by(name: params[artist_name]).nil?
  end

  Album.create(title: params[:album]) if Album.find_by(title: params[:album]).nil?

  artists = artist_names.map { |name| Artist.find_by(name: name) }
  album = Album.find_by(title: params[:album])

  song = Song.create(name: params[:song], transcriber: current_user, spotify_uri: params["spotify-uri"])
  artists.each { |artist| artist.songs << song }
  album.songs << song

  redirect "/songs/#{song.id}/edit"
end

get '/songs/:id/edit' do
  @song = Song.find(params[:id])
  @artists = @song.artists
  @artists_names = @artists.map { |artist| artist.name }
  @artists_names.join(", ")
  @album = @song.album
  erb :'/songs/edit'
end


delete '/songs/:id' do
  song = Song.find(params[:id])
  # REFACTOR Fix this destroy method
  song.destroy
  redirect '/songs'
end
