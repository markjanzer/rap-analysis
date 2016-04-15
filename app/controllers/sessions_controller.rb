class SessionsController < ApplicationController

  def new
  end

  def create
    @user = User.find_by_username(session_params[:username])
    if @user && @user.password == session_params[:password]
      session[:current_user_id] = @user.id
      redirect_to "/"
    else
      flash[:error] = "Incorrect username/password combination"
      redirect_to login_path
    end
  end

  def destroy
    session[:current_user_id] = nil
    redirect_to "/"
  end

  private
  def session_params
    params.require(:session).permit(:username, :password)
  end
end
