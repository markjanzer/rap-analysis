require 'rails_helper'

feature 'User visits homepage' do
  scenario 'they see a login button' do
    visit '/'
    expect(page).to have_css '.logo'
  end
end