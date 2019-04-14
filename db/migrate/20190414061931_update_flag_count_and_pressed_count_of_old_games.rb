class UpdateFlagCountAndPressedCountOfOldGames < ActiveRecord::Migration[5.2]
  def change
    Game.where(state: :started).each do |game|
      flag_count = game.cells.flatten.count { |cell| cell['flagged'] }
      pressed_count = game.cells.flatten.count { |cell| cell['pressed'] }

      game.update flag_count: flag_count, pressed_count: pressed_count
    end
  end
end
