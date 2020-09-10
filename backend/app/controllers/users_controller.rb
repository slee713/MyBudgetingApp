class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    
    def show
        user = User.find_by(username: params[:username])
        if user 
            render json: user
        else
            user = User.create(username: params[:username])
            render json: user
        end

    end

    def update
        user = User.find(params[:id])
        user.update(user_params)
    end


    private

    def user_params
        params.require(:user).permit(:username)
    end
end
