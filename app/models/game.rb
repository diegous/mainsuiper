class Game < ApplicationRecord
  belongs_to :user

  has_many :tiles

  enum state: [:created, :started, :ended]

  def start(bomb_amount)
    # create tiles
    (1..x_size).each do |x|
      (1..y_size).each do |y|
        tiles.new x:x ,y: y, near_bombs: 0
      end
    end

    # create bombs at random spots
    bombs = []
    bomb_amount.times do
      begin
        x = rand(x_size) + 1
        y = rand(y_size) + 1
      end while bombs.include? [x, y]

      bombs << [x, y]
    end

    tiles.each &:save!

    bombs.each do |x, y|
      tiles.find_by(x: x, y: y).bomb!
    end

    tiles.where(state: :bomb).each &:update_neighbours
  end

  def pressed(x, y)
    game_continues = tiles.find_by(x: x, y: y).press

    ended! unless game_continues

    game_continues
  end

  def to_s
    result = []

    (1..y_size).each do |y|
      result << '|'

      (1..x_size).each do |x|
        tiles.find_by(x: x, y: y).tap do |tile|
          if tile.bomb?
            result << '*'
          elsif tile.pressed?
            result << tile.near_bombs
          else
            result << '_'
          end
        end

        result << '|'
      end

      result << "\n"
    end

    result.join
  end
end
