Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/users/:username', to: 'users#show'
  post '/users', to: 'users#create'
  patch '/users/:username', to: 'users#update'
  delete '/users/:username', to: 'users#destroy'

  get '/transactions', to: 'transactions#index'
  # get '/transactions/:username/:year/:month', to: 'transactions#index'
  get '/transactions/:username/', to: 'transactions#index' 
  get '/transactions/:username/:year', to: 'transactions#index' 
  get '/transactions/:username/:year/:month', to: 'transactions#index' 
  get '/transactions/:username/:year/:month/:category', to: 'transactions#index'
  # get '/transactions/:username/:page', to: 'transactions#limit'
  post '/transactions/:username/', to: 'transactions#create'
end
