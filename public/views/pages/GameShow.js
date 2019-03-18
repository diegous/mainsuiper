const drawCell = (cell) => {
  let content = '',
      classes;

  switch(cell.value) {
    case '?':
      classes = 'unpressed';
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

const findSquareSize = function() {
  const board = document.getElementById('board');
  let size = window.getComputedStyle(board).getPropertyValue('--cell-total-size');
  return Number(size.slice(1, -2));
}

const clickCell = function() {
  console.log(`hola desde x: ${this.dataset.x} y: ${this.dataset.y}`);
}

const flagCell = function() {
  console.log(`FLAGGED ${this.dataset.x}-${this.dataset.y}`);
  return false;
}

// const SQURAE_SIZE = findSquareSize();

const Home = {
  render: async () => {
    const response = await fetch("http://localhost:3000/games/1");
    const game = await response.json();

    const view = `
      <div id="board"
           onContextMenu="return false"
           data-width=${game.width}
           data-height=${game.height} >
        ${game.board.map(drawCell).join('')}
      </div>
    `
    return view;
  },
  afterRender: async () => {
    // Set board widh & height
    const board = document.getElementById('board');
    const size = findSquareSize();
    board.style.setProperty('width',  `${ size * board.dataset.width  }px`);
    board.style.setProperty('height', `${ size * board.dataset.height }px`);

    // Add event listeners for clicks
    document.querySelectorAll('.unpressed').forEach((cell) => {
      cell.addEventListener('click', clickCell);
      cell.addEventListener('contextmenu', flagCell);
    });
  }
}

export default Home;
