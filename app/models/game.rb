class Game < ApplicationRecord
  belongs_to :user

  enum state: [:created, :started, :won, :lost]

  validate :too_many_bombs

  before_create :set_created

  def start(x, y)
    self.pressed_count = 0
    self.flag_count = 0
    self.state = :started
    self.cells = Array.new(width) { Array.new height, { 'near_bombs' => 0 } }

    generate_bombs(x,y)
    calculate_near_bombs

    press x, y
  end

  def press(x,y)
    cell = cells[x][y]
    return if cell['pressed']
    return if cell['flagged']

    cell['pressed'] = true
    self.pressed_count += 1

    if cell['bomb']
      self.state = :lost
    else
      flood_neighbors(x,y) if cell['near_bombs'].zero?
      check_state
    end
  end

  def flag(x,y)
    cell = self.cells[x][y]
    return if cell['pressed']

    if cell['flagged']
      self.flag_count -= 1
      cell['flagged'] = false
    else
      self.flag_count += 1
      cell['flagged'] = true
    end
  end

  def reveal(x,y)
    cell = self.cells[x][y]
    return unless cell['pressed']
    return if cell['near_bombs'] == 0

    neighbors = neighbors_of(x,y)
    near_flags = neighbors.count { |x, y| cells[x][y]['flagged'] }

    if near_flags == cell['near_bombs']
      neighbors.each { |x,y| press(x,y) }
    end
  end

  private

  def generate_bombs(clicked_x, clicked_y)
    # create bombs at random spots, but not on cliked cell
    self.cells[clicked_x][clicked_y]['bomb'] = true

    # try to avoid putting bomb in surrounding cells
    neighbors = neighbors_of(clicked_x, clicked_y)
    free_cells_amount = width * height - bomb_amount

    if free_cells_amount > neighbors.count
      neighbors.each { |x,y| self.cells[x][y]['bomb'] = true }
    end

    # place bombs
    bomb_amount.times do
      begin
        x = rand width
        y = rand height
      end while self.cells[x][y]['bomb']

      self.cells[x][y]['bomb'] = true
    end

    # remove clicked cell's bomb
    self.cells[clicked_x][clicked_y]['bomb'] = false

    # and remove from neighbors if necessary
    if free_cells_amount >= (neighbors.count + 1)
      neighbors.each { |x,y| self.cells[x][y]['bomb'] = false }
    end
  end

  def calculate_near_bombs
    cells.each_with_index do |row, x|
      row.each_with_index do |cell, y|
        increment_neighbours_of(x,y) if cell['bomb']
      end
    end
  end

  def increment_neighbours_of(x,y)
    neighbors = neighbors_of(x,y)

    neighbors.each do |x,y|
      self.cells[x][y]['near_bombs'] += 1
    end
  end

  def flood_neighbors(x,y)
    neighbors = neighbors_of(x,y)

    pressed = neighbors.map    { |x,y|      [x, y, self.cells[x][y]] }
                       .reject { |x,y,cell| cell['pressed']          }
                       .each   { |x,y,cell| cell['pressed'] = true   }

    self.pressed_count += pressed.count

    pressed.select { |x,y,cell| cell['near_bombs'].zero? }
           .each   { |x,y,cell| flood_neighbors(x,y)     }
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

  def check_state
    non_bomb_cell_amount = width * height - bomb_amount

    if pressed_count == non_bomb_cell_amount
      self.state = :won
    end
  end

  def set_created
    self.state = :created
  end

  def too_many_bombs
    if self.bomb_amount >= (self.height * self.width)
      errors.add :bomb_amount, "must be smaller than tiles amount"
    end
  end
end
