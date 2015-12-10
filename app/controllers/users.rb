get '/users/new' do
  erb :'users/new'
end

post '/users' do
  if params[:password] == params[:confirmed_password]
    new_user = User.create(username: params[:username])
    new_user.password = params[:password]
    redirect '/songs'
  else
    # RAISE AN ERROR HERE
    redirect '/users/new'
  end
end
