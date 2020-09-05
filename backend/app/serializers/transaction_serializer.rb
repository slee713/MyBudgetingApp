class TransactionSerializer < ActiveModel::Serializer
  attributes :category, :price, :date_of_transaction
end
