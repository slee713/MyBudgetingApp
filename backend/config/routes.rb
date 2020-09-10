Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/users/:username', to: 'users#show'
  post '/users', to: 'users#create'
  patch '/users/:id', to: 'users#update'
  delete '/users/:id', to: 'users#destroy'

  get '/transactions', to: 'transactions#index'
  get '/transactions/:username/', to: 'transactions#index'
  get '/transactions/:username/:year', to: 'transactions#index' 
  get '/transactions/:username/:year/:month', to: 'transactions#index' 
  get '/transactions/:username/:year/:month/:category', to: 'transactions#index'
  # get '/transactions/:username/:page', to: 'transactions#limit'
  post '/transactions/', to: 'transactions#create'
  patch '/transactions/:id', to: 'transactions#update'
  delete '/transactions/:id', to: 'transactions#destroy'
end
