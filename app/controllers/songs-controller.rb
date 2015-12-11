get '/songs' do
  @songs = Song.all
  @current_user = User.find(session[:id]) if !session[:id].nil?
  erb :'songs/show'
end

get '/songs/new' do
  erb :'songs/new'
end
