class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # loads lib for modules

  def current_user
    @current_user ||= User.find_by_id(session[:current_user_id])
  end
  helper_method :current_user

  def super_user
    if current_user
      current_user.super
    else
      false
    end
  end
  helper_method :super_user

end
