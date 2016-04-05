class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    p params
    @user = User.new(user_params)
    @user.password = params[:user][:password]
    @user.save!
    session[:current_user_id] = @user.id
    redirect_to "/"
  end

  def login
    @user = User.find_by_username(params[:username])
    if @user.password == params[:password]
      session[:current_user_id] = @user.id
    else
      redirect_to root
    end
  end

  private

  def user_params
    params.require(:user).permit(:username)
  end

end
