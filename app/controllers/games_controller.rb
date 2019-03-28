class GamesController < ApplicationController
  before_action :authenticate_user!

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
    game.press(x, y)
    game.save

    render json: game
  end

  def flag
    game.flag(x, y)
    game.save

    render json: game
  end

  private

  def game
    @game ||= Game.find params[:id]
  end

  def x
    @x ||= params[:x].to_i
  end

  def y
    @y ||= params[:y].to_i
  end
end
