class GameSerializer < ActiveModel::Serializer
  attributes :id, :width, :height, :board, :state, :bomb_amount
end
