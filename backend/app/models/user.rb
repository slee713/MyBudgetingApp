class User < ApplicationRecord
    has_many :transactions, dependent: :destroy 
end
