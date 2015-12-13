get '/songs' do
  @songs = Song.all
  @current_user = User.find(session[:id]) if !session[:id].nil?
  erb :'songs/show'
end

get '/songs/new' do
  erb :'songs/new'
end

post '/songs' do
  # Create Album and Artist if they do not already exist
  Artist.create(name: params[:artist]) if Artist.find_by(name: param[:artist]).nil?
  Album.create(title: params[:album]) if Album.find_by(title: param[:album]).nil?
  artist = Artist.find_by(name: param[:artist])
  album = Album.find_by(name: param[:album])

  song = Song.create(name: params[:song])
  artist.songs << song
  album.songs << song

  erb :'/partials/'


end
