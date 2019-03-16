class GamesController < ApplicationController
  def show
    game = Game.find params[:id]
    render json: game
  end

  def play
    game = Game.find params[:game_id]
    game_continues = game.pressed params[:x].to_i.next, params[:y].to_i.next

    game.reload

    render json: game
  end

  def create
    game = Game.create user_id: User.first.id,
                       state: :created,
                       x_size: params[:x_size],
                       y_size: params[:y_size]

    render json: game
  end
end
