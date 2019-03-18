class Game < ApplicationRecord
  belongs_to :user

  enum state: [:created, :started, :won, :lost]

  validate :too_many_bombs

  before_create :set_created

  def start(x, y)
    self.cells   = Array.new(width) { Array.new height, 0 }
    self.bombs   = Array.new(width) { Array.new height, false }
    self.flags   = Array.new(width) { Array.new height, false }
    self.pressed = Array.new(width) { Array.new height, false }

    generate_bombs(x,y)
    calculate_numbers

    press x, y
  end

  def press(x,y)
    self.pressed[x][y] = true
    flood_neighbors(x,y) if self.cells[x][y].zero?

    bombs[x][y]
  end

  def flag(x,y)
    self.flags[x][y] = !self.flags[x][y]
  end

  def board
    value_of = "value_of_#{state}"

    self.cells.each_with_index.map do |row, x|
      row.each_with_index.map do |cell, y|
        {
          x: x,
          y: y,
          value: send(value_of, cell, x, y)
        }
      end
    end.flatten
  end

  private

  def value_of_won(value, x, y)
    bombs[x][y] ? 'flag' : value
  end

  def value_of_lost(value, x, y)
    if pressed[x][y]
      bombs[x][y] ? 'BOOM' : value
    elsif flags[x][y]
      bombs[x][y] ? 'flag' : 'wrong flag'
    else
      bombs[x][y] ? 'bomb' : value
    end
  end

  def value_of_started(value, x, y)
    if pressed[x][y]
      value
    elsif flags[x][y]
      'flag'
    else
      '?'
    end
  end

  def generate_bombs(clicked_x, clicked_y)
    # create bombs at random spots, but not on cliked cell
    self.bombs[clicked_x][clicked_y] = true

    bomb_amount.times do
      begin
        x = rand width
        y = rand height
      end while self.bombs[x][y]

      self.bombs[x][y] = true
    end

    self.bombs[clicked_x][clicked_y] = false
  end

  def calculate_numbers
    self.bombs.each_with_index do |row, x|
      row.each_with_index do |bomb, y|
        increment_neighbours_of(x,y) if bomb
      end
    end
  end

  def increment_neighbours_of(x,y)
    neighbors = neighbors_of(x,y)

    neighbors.each do |x,y|
      self.cells[x][y] += 1
    end
  end

  def flood_neighbors(x,y)
    neighbors = neighbors_of(x,y)

    neighbors.reject { |x,y| self.pressed[x][y]        }
             .each   { |x,y| self.pressed[x][y] = true }
             .select { |x,y| self.cells[x][y].zero?    }
             .each   { |x,y| flood_neighbors(x,y)      }
  end

  def neighbors_of(x,y)
    neighbors = []

    max_y = self.height - 1
    max_x = self.width - 1

    if x > 0
      neighbors << [x-1,y-1]if y > 0
      neighbors << [x-1,y]
      neighbors << [x-1,y+1]if y < max_y
    end

    neighbors << [x,y-1] if y > 0
    neighbors << [x,y+1] if y < max_y

    if x < max_x
      neighbors << [x+1,y-1] if y > 0
      neighbors << [x+1,y]
      neighbors << [x+1,y+1] if y < max_y
    end

    neighbors
  end

  def set_created
    state = :created
  end

  def too_many_bombs
    if bomb_amount >= (height * width)
      errors.add :bomb_amount, "must be smaller than tiles amount"
    end
  end
end
