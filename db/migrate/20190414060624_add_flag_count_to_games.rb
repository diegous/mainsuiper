class AddFlagCountToGames < ActiveRecord::Migration[5.2]
  def change
    add_column :games, :flag_count, :integer
  end
end
