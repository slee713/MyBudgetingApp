# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.destroy_all
Transaction.destroy_all

steven = User.create(username: "slee713")
categories = ["Food & Drink", "Shopping", "Travel", "Transportation", "Bills", "Health", "Entertainment", "Groceries"]

150.times do 
    Transaction.create(user: steven, category: categories.sample, price: rand(0.00...100.00).round(2), date_of_transaction: Date.parse("2020/#{rand(01..12)}/#{rand(1..20)}"))
end


michael = User.create(username: "mike")

150.times do 
    Transaction.create(user: michael, category: categories.sample, price: rand(0.00...100.00).round(2), date_of_transaction: Date.parse("2020/#{rand(01..12)}/#{rand(1..20)}"))
end
