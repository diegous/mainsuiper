class Api::GamesController < ApplicationController
  before_action :authenticate_user!
  rescue_from Games::OutOfBoundriesError, with: :out_of_bounds

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
    game_service = Games::PlayService.new(game)
    game_service.press(x,y)
    game_service.save

    render json: game_service.game
  end

  def flag
    game_service = Games::PlayService.new(game)
    game_service.flag(x,y)
    game_service.save

    render json: game_service.game
  end

  def reveal
    game_service = Games::PlayService.new(game)
    game_service.reveal(x,y)
    game_service.save

    render json: game_service.game
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

  def out_of_bounds
    render json: { error: 'coordinates out of bounds' }
  end
end
