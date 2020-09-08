class UsersController < ApplicationController
    def show
        user = User.find_by(username: params[:username])
        if user 
            render json: user
        else
            user = User.create(username: params[:username])
            render json: user
        end

    end
end
