import Utils from '../../services/Utils.js';
import API   from '../../services/API.js';

const drawCell = (cell) => {
  let content, classes;

  switch(cell.value) {
    case '?':
      classes = 'unpressed';
      content = '';
      break;
    case 'flag':
      classes = 'unpressed flag';
      content = '<i class="fas fa-flag"></i>';
      break;
    case 'bomb':
      classes = 'pressed';
      content = '<i class="fas fa-bomb"></i>';
      break;
    case 'BOOM':
      classes = 'pressed boom';
      content = '<i class="fas fa-bomb"></i>';
      break;
    default:
      classes = `pressed pressed-${cell.value}`;
      content = cell.value > 0 ? cell.value : '';
  }

  const datas = `data-x=${cell.x}
                 data-y=${cell.y}`;

  return `<span class="item ${classes}" ${datas}>${content}</span>`;
}


const clickCell = function() {
  refreshBoard(API.play(1), this.dataset.x, this.dataset.y);
}

const flagCell = function() {
  refreshBoard(API.flag(1), this.dataset.x, this.dataset.y);
}

const refreshBoard = async function(url, x, y) {
  const response = await Utils.postData(url, {x: x, y: y});
  const game = await response.json();
  const content = document.getElementById('page_container');

  content.innerHTML = drawBoard(game);
  finalAdjustments();
}

const drawBoard = (game) => {
  return `
      <div id="board"
           onContextMenu="return false"
           data-state=${ game.state }
           data-width=${ game.width }
           data-height=${ game.height } >
        ${ game.board.map(drawCell).join('') }
      </div>
    `
}

const finalAdjustments = () => {
  const board = document.getElementById('board');
  const size = Utils.findCellSize();

  // Set board widh & height
  board.style.setProperty('width',  `${ size * board.dataset.width  }px`);
  board.style.setProperty('height', `${ size * board.dataset.height }px`);

  // Add event listeners for clicks
  if (board.dataset.state == "started") {
    document.querySelectorAll('.unpressed:not(.flag)').forEach((cell) => {
      cell.addEventListener('click', clickCell);
    });
    document.querySelectorAll('.unpressed').forEach((cell) => {
      cell.addEventListener('contextmenu', flagCell);
    });
  }
}

const GameShow = {
  render: async ({gameId}) => {
    const response = await fetch(API.game(gameId));
    const game = await response.json();

    return drawBoard(game);
  },
  afterRender: async () => {
    finalAdjustments();
  }
}

export default GameShow;
