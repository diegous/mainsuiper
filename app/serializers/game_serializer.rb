class GameSerializer < ActiveModel::Serializer
  attributes :id, :x_size, :y_size, :cells, :state

  def cells
    board = Array.new(object.x_size) { Array.new(object.y_size) { '?' } }

    unless object.created?
      object.tiles.each do |tile|
        board[tile.x - 1][tile.y - 1] = tile.to_s
      end
    end

    board
  end
end
