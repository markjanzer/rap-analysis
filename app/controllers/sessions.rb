get '/login' do
  erb :'sessions/login'
end

get '/singup' do
  erb :'sessions/signup'
end

post '/session' do
  p params
  user = User.find_by(username: params[:username])
  if user && user.password == params[:password]
    session[:id] = user.id
    redirect '/songs'
  else
    # ADD ERROR MESSAGES HERE
    erb :'/sessions/login'
  end
end

get '/logout' do
  session[:id] = nil
  redirect '/songs'
  # RAISE SOME CONFRIMATION HERE
end

