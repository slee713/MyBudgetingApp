class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    
    def show
        user = User.find_by(username: params[:username])
        render json: user
    end

    def create
        user=User.create(user_params)
        render json: user
    end

    def update
        user = User.find(params[:id])
        user.update(user_params)
    end

    def destroy
        user = User.find(params[:id])
        user.destroy()
    end



    private

    def user_params
        params.require(:user).permit(:username)
    end
end
