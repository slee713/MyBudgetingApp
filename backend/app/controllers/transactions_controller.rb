class TransactionsController < ApplicationController
    def index
        if params[:username]
            user = User.find_by(username: params[:username])
            if params[:month]
                transactions = user.transactions.find_all {|i| i.date_of_transaction.month == params[:month].to_i}
                render json: transactions
            else 
                transactions = user.transactions
                render json: transactions
            end
        else
            transactions = Transaction.all 
            render json: transactions
        end
    end

    def limit 
        user = User.find_by(username: params[:username])
        transactions = user.transactions.paginate(page: params[:page], per_page: 20)
        render json: transactions
    end
end
