class TransactionSerializer < ActiveModel::Serializer
  attributes :id, :category, :price, :date_of_transaction, :description
end
