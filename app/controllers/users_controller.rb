class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    @user.password = params[:password]
    @user.save!
    session[:current_user_id] = @user.id
    redirect_to "/"
  end

  def edit

  end

  def update
    if current_user.password == params["old-password"]
      current_user.password = params["new-password"]
      current_user.save
      redirect_to user_path(current_user)
    else
      # refactor to include errors
      flash[:error] = "Incorrect password"
      redirect_to edit_user_path(current_user)
    end
  end

  def show
    current_user
    @number_of_songs = current_user.songs.count
    @account_creation_date = current_user.created_at.to_date
  end

  private

  def user_params
    params.permit(:username)
  end

end
