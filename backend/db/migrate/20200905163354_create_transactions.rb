class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions do |t|
      t.integer :user_id
      t.string :description
      t.string :category
      t.float :price
      t.date :date_of_transaction

      t.timestamps
    end
  end
end
