class Games::PlayService
  attr_reader :game

  def initialize(game)
    @game = game
  end

  def press(x,y)
    check_boundries(x,y)

    if game.created?
      game.start(x,y)
    elsif game.started?
      game.press(x,y)
    end
  end

  def flag(x,y)
    check_boundries(x,y)
    game.flag(x,y) if game.started?
  end

  def reveal(x,y)
    check_boundries(x,y)
    game.reveal(x,y) if game.started?
  end

  def save
    game.save
  end

  private

  def check_boundries(x,y)
    if x < 0 || x >= game.width || y < 0 || y >= game.height
      raise Games::OutOfBoundriesError
    end
  end
end
