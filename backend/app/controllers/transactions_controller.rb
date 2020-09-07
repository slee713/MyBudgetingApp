class TransactionsController < ApplicationController
    def index
        if params[:username]
            user = User.find_by(username: params[:username])
            if params[:month]
                transactions = user.transactions.where("cast(strftime('%m', date_of_transaction)as int) = #{params[:month]}")
                sort_transactions = transactions.order("date_of_transaction ASC")
                render json: sort_transactions
            else 
                transactions = user.transactions.order("date_of_transaction ASC")
                render json: transactions
            end
        else
            transactions = Transaction.all 
            render json: transactions
        end
    end

    # def limit 
    #     user = User.find_by(username: params[:username])
    #     sort_transactions = user.transactions.order('date_of_transaction DESC')
    #     # transactions = sort_transactions.paginate(page: params[:page], per_page: 20)
        
    #     render json: transactions
    # end

    def create
        user = User.find_by(username: params[:username])
        transaction = Transaction.create(
            user: user,
            category: params[:transaction][:category],
            price: params[:transaction][:price],
            date_of_transaction: params[:transaction][:date_of_transaction],
            description: params[:transaction][:description]
        )
        transactions = user.transactions
        render json: transactions
    end


    private

    # def transaction_params
    #     params.require(:transaction).permit(:category, :price, :description, :date_of_transaction)
    # end

end
