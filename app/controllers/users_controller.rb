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

  def show
    current_user
  end

  private

  def user_params
    params.permit(:username)
  end

end
