class GameSerializer < ActiveModel::Serializer
  attributes :id, :width, :height, :board, :state
end
