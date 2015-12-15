get '/songs' do
  @songs = Song.all
  p "get/song" + "*"*90
  p Song.all.count
  @current_user = User.find(session[:id]) if !session[:id].nil?
  erb :'songs/show'
end

get '/songs/new' do
  erb :'songs/new'
end

post '/songs' do
  # Create Album and Artist if they do not already exist
  Artist.create(name: params[:artist]) if Artist.find_by(name: params[:artist]).nil?
  Album.create(title: params[:album]) if Album.find_by(title: params[:album]).nil?

  artist = Artist.find_by(name: params[:artist])
  album = Album.find_by(title: params[:album])

  song = Song.create(name: params[:song])
  artist.songs << song
  album.songs << song

  redirect "/songs/#{song.id}/edit"
end

get '/songs/:id/edit' do
  p params[:id]
  @song = Song.find(params[:id])
  p @song
  @artists = @song.artists
  @album = @song.album
  erb :'/songs/edit'
end


