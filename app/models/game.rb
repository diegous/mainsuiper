class Game < ApplicationRecord
  belongs_to :user

  enum state: [:created, :started, :won, :lost]

  validate :too_many_bombs

  before_create :set_created

  def start(x, y)
    self.state = :started
    self.cells = Array.new(width) { Array.new height, { 'near_bombs' => 0 } }

    generate_bombs(x,y)
    calculate_numbers

    press x, y
  end

  def press(x,y)
    if created?
      start x, y
    else
      cell = self.cells[x][y]
      return if cell['pressed']
      return if cell['flagged']
      return unless started?

      cell['pressed'] = true
      flood_neighbors(x,y) if cell['near_bombs'].zero?

      if cell['bomb']
        self.state = :lost
      else
        check_state
      end
    end
  end

  def flag(x,y)
    cell = self.cells[x][y]
    return unless started?
    return if cell['pressed']

    cell['flagged'] = !cell['flagged']
  end

  def reveal(x,y)
    cell = self.cells[x][y]
    return unless started?
    return unless cell['pressed']
    return if cell['near_bombs'] == 0

    neighbors = neighbors_of(x,y)
    near_flags = neighbors.count { |x, y| cells[x][y]['flagged'] }

    if near_flags == cell['near_bombs']
      neighbors.each { |x,y| press(x,y) }
    end
  end

  def board
    if created?
      width.times.to_a.map do |x|
        height.times.to_a.map do |y|
          { x: x, y: y, value: '?' }
        end
      end.flatten
    else
      value_of = "value_of_#{state}"

      self.cells.each_with_index.map do |row, x|
        row.each_with_index.map do |cell, y|
          {
            x: x,
            y: y,
            value: send(value_of, cell)
          }
        end
      end.flatten
    end
  end

  private

  def value_of_won(cell)
    cell['bomb'] ? 'flag' : cell['near_bombs']
  end

  def value_of_lost(cell)
    if cell['pressed']
      cell['bomb'] ? 'BOOM' : cell['near_bombs']
    elsif cell['flags']
      cell['bomb'] ? 'flag' : 'wrong flag'
    else
      cell['bomb'] ? 'bomb' : '?'
    end
  end

  def value_of_started(cell)
    if cell['pressed']
      cell['near_bombs']
    elsif cell['flagged']
      'flag'
    else
      '?'
    end
  end

  def generate_bombs(clicked_x, clicked_y)
    # create bombs at random spots, but not on cliked cell
    self.cells[clicked_x][clicked_y]['bomb'] = true

    # try to avoid putting bomb in surrounding cells
    neighbors = neighbors_of(clicked_x, clicked_y)
    free_cells = width * height - bomb_amount

    if free_cells >= (neighbors.count + 1)
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
    if free_cells >= (neighbors.count + 1)
      neighbors.each { |x,y| self.cells[x][y]['bomb'] = false }
    end
  end

  def calculate_numbers
    self.cells.each_with_index do |row, x|
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

    neighbors.map    { |x,y|      [x, y, self.cells[x][y]] }
             .reject { |x,y,cell| cell['pressed']          }
             .each   { |x,y,cell| cell['pressed'] = true   }
             .select { |x,y,cell| cell['near_bombs'].zero? }
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
    # No bombs pressed
    bomb_pressed = cells.flatten
                        .select { |cell| cell['bomb'] }
                        .any? { |cell| cell['pressed'] }

    if bomb_pressed
      self.state = :lost
    else
      # Only bombs remain unpressed
      only_bombs = cells.flatten
                        .reject { |cell| cell['pressed'] }
                        .all? { |cell| cell['bomb'] }

      self.state = :won if only_bombs
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
