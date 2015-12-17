get '/songs' do
  @songs = Song.all
  @current_user = User.find(session[:id]) if !session[:id].nil?
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
  @song = Song.find(params[:id])
  @artists = @song.artists
  @album = @song.album
  erb :'/songs/edit'
end



