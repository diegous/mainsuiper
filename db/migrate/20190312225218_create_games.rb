class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.references :user, foreign_key: true
      t.integer :state
      t.integer :width
      t.integer :height
      t.integer :bomb_amount
      t.jsonb   :cells, array: true

      t.timestamps
    end
  end
end
