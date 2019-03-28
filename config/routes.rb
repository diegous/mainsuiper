Rails.application.routes.draw do
  devise_for :users

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :games, only: [:show, :create] do
    member do
      post :play
      post :flag
    end
  end

  get '*path', to: 'spa#index'
end
