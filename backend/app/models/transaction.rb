class Transaction < ApplicationRecord
    belongs_to :user
    validates :date_of_transaction, :category, :price, :user_id, presence: true
end
