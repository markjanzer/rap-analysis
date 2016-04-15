Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'homepage#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
    get 'login' => 'sessions#new'
    post 'login' => 'sessions#create'
    get 'logout' => 'sessions#destroy'

    resources :artists
    resources :albums
    resources :users


    resources :songs do
      member do
        put 'render_section_form'
        put 'cancel_section_form'
        put 'create_section'
        put 'delete_section'
        put 'change_stress'
        put 'change_end_rhyme'
        put 'change_lyrics'
        put 'change_rhythm'
        put 'change_rhyme'
        put 'add_cell'
        put 'delete_cell'
        put 'add_measure_after'
        put 'add_measure_before'
        put 'delete_measure'
        put 'publish'
        put 'open_edit_menu'
        put 'close_edit_menu'
        put 'tag_for_publication'
        put 'render_delete_song_warning'
        put 'render_delete_section_warning'
      end
    end


  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
