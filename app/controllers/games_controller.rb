class GamesController < ApplicationController
  def show
    render json: Game.find(params[:id])
  end

  def create
    game = Game.create user_id: User.first.id,
                       width: params[:width],
                       height: params[:height],
                       bomb_amount: params[:bomb_amount]

    render json: game
  end

  def play
    x = params[:x].to_i
    y = params[:y].to_i
    game = Game.find params[:game_id]
    game_continues = game.press(x, y)
    game.save

    render json: game
  end

  def flag
    x = params[:x].to_i
    y = params[:y].to_i
    game = Game.find params[:game_id]
    game.flag(x, y)
    game.save

    render json: game
  end
end
