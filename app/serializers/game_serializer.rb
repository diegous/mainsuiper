class GameSerializer < ActiveModel::Serializer
  attributes :id, :width, :height, :board, :state, :bomb_amount, :flag_count

  def board
    if object.created?
      object.width.times.to_a.map do |x|
        object.height.times.to_a.map do |y|
          { x: x, y: y, value: '?' }
        end
      end.flatten
    else
      value_of = "value_of_#{object.state}"

      object.cells.each_with_index.map do |row, x|
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
    elsif cell['flagged']
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
end
