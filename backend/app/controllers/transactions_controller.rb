class TransactionsController < ApplicationController
    def index
        user = User.find_by(username: params[:username])
        if params[:year]
            transactions = user.transactions.where("cast(strftime('%Y', date_of_transaction) as int) = #{params[:year]}")
            if params[:month]
                month_transactions = transactions.where("cast(strftime('%m', date_of_transaction)as int) = #{params[:month]}")
                if params[:category] && params[:category]!= "All"
                    category_transactions = month_transactions.where(category: params[:category])
                    sorted_transactions = category_transactions.order("date_of_transaction ASC")
                    render json: sorted_transactions
                else
                    sorted_transactions = month_transactions.order("date_of_transaction ASC")
                    render json: sorted_transactions
                end
            else 
                sorted_transactions = transactions.order("date_of_transaction ASC")
                render json: sorted_transactions
            end
        else
            transactions = user.transactions.order("date_of_transaction ASC")
            render json: transactions
        end
    end

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

    def update
        user = User.find_by(username: params[:username])
    end


    private

    # def transaction_params
    #     params.require(:transaction).permit(:category, :price, :description, :date_of_transaction)
    # end

end
