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
    case 0:
      classes = 'pressed';
      content = '';
      break;
    default:
      classes = `pressed pressed-${cell.value} number`;
      content = cell.value;
  }

  const datas = `data-x=${cell.x}
                 data-y=${cell.y}`;

  return `<span class="item ${classes}" ${datas}>${content}</span>`;
}


const clickCell = function() {
  const id = document.getElementById('board').dataset.id
  refreshBoard(API.play(id), this.dataset.x, this.dataset.y);
}

const flagCell = function() {
  const id = document.getElementById('board').dataset.id
  refreshBoard(API.flag(id), this.dataset.x, this.dataset.y);
}

const clickNumber = function() {
  const id = document.getElementById('board').dataset.id
  refreshBoard(API.reveal(id), this.dataset.x, this.dataset.y);
}

const refreshBoard = async function(url, x, y) {
  const response = await Utils.postData(url, {x: x, y: y});
  const game = await response.json();
  const content = document.getElementById('page_container');

  content.innerHTML = drawPage(game);
  boardFinalAdjustments();
}

const drawPage = (game) => {
  return `
      <h2 class="game-${ game.state }">
        ${ game.state }
      </h2>

      <div id="back-button">
        <div class="btn-container">
          <button type="button" class="btn" id="back-to-games">
            Back to Games
          </button>
        </div>
      </div>

      <span>Flaggs: ${ game.flag_count || 0 } / ${ game.bomb_amount }</span>
      <div id="board"
           onContextMenu="return false"
           data-id=${ game.id }
           data-state=${ game.state }
           data-width=${ game.width }
           data-height=${ game.height } >
        ${ game.board.map(drawCell).join('') }
      </div>
    `
}

const boardFinalAdjustments = () => {
  const board = document.getElementById('board');
  const size = Utils.findCellSize();

  // Set board widh & height
  board.style.setProperty('width',  `${ size * board.dataset.width  }px`);
  board.style.setProperty('height', `${ size * board.dataset.height }px`);

  // Add event listeners for clicks
  const state = board.dataset.state;
  if (state == "started" || state == "created") {
    document.querySelectorAll('.unpressed:not(.flag)').forEach((cell) => {
      cell.addEventListener('click', clickCell);
    });
    document.querySelectorAll('.unpressed').forEach((cell) => {
      cell.addEventListener('contextmenu', flagCell);
    });
    document.querySelectorAll('.number').forEach((cell) => {
      cell.addEventListener('click', clickNumber);
    });
  }

  // Back button listener
  document.getElementById('back-to-games').addEventListener(
    'click',
    () => Utils.redirect('/user/games')
  );
}

const GameShow = {
  render: async ({gameId}) => {
    const response = await fetch(API.game(gameId));
    const game = await response.json();

    return drawPage(game);
  },
  afterRender: async () => {
    boardFinalAdjustments();
  }
}

export default GameShow;
