class TransactionsController < ApplicationController
    def index
        user = User.find_by(username: params[:username])
        transactions = user.transactions.all.find_all {|i| i.date_of_transaction.month == params[:month].to_i}
        render json: transactions
    end
end
