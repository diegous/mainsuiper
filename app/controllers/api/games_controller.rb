class Api::GamesController < ApplicationController
  before_action :authenticate_user!

  def index
    games = current_user.games
                        .select(:id, :state, :width, :height)
                        .as_json

    render json: games
  end

  def show
    render json: Game.find(params[:id])
  end

  def create
    game = Game.create user: current_user,
                       width: params[:width],
                       height: params[:height],
                       bomb_amount: params[:bomb_amount]

    render json: { game_id: game.id }
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
    @game ||= current_user.games.find params[:id]
  end

  def x
    @x ||= params[:x].to_i
  end

  def y
    @y ||= params[:y].to_i
  end
end
