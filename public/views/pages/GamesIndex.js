import Utils from '../../services/Utils.js';
import API   from '../../services/API.js';

const renderForm = () => {
  return `
    <div class="new-game-buttons">
      <div class="btn-container">
        <button type="button" data-height="9" data-width="9" data-bombs="10" class="btn">
          Easy
        </button>
      </div>
      <div class="btn-container">
        <button type="button" data-height="16" data-width="16" data-bombs="40" class="btn">
          Medium
        </button>
      </div>
      <div class="btn-container">
        <button type="button" data-height="16"  data-width="20" data-bombs="99" class="btn">Hard </button>
      </div>
    </div>

    <br/>

    <div class="new-game-form-container">
      <fieldset>
        <legend>Custom</legend>
        <form id="new-game-form">
          <label for="width">Width</label>
          <input type="number" min="2" max="999" name="width" id="width" value="9"></input>
          <br/>

          <label for="height">Height</label>
          <input type="number" min="2" max="999" name="height" id="height" value="9"></input>
          <br/>

          <label for="bombs">Bombs</label>
          <input type="number" name="bombs" id="bombs" value="10"></input>
          <br/>

          <div class="btn-container">
            <button type="button" class="btn">Start</button>
          </div>
        </form>
      </fieldset>
    </div>
  `
}

const renderGame = (game) => {
  return `
    <li>
      <div class="btn-container">
        <button type="button" data-id="${ game.id }" class="btn">
          <span class="game-${ game.state }">
            ${ game.state }
          </span>
          - ${ game.width } by ${ game.height }
        </button>
      </div>
    </li>
  `;
}

const newCustomGame = () => {
  const params = {
    width: document.getElementById('width').value,
    height: document.getElementById('height').value,
    bombs: document.getElementById('bombs').value
  }

  startNewGame(params);
}

const startNewGame = async ({width, height, bombs}) => {
  const params = {
    width: width,
    height: height,
    bomb_amount: bombs
  };

  const response = await Utils.postData(API.gameCreate, params);

  if (response.status == 200) {
    const data = await response.json();
    Utils.redirect(`/user/games/${ data.game_id }`);
  } else {
    // something went wrong with request
  }
}

const GamesIndex = {
  render: async () => {
    const response = await fetch(API.gamesList);
    const games = await response.json();

    return `
      <h2>New Game</h2>
      ${ renderForm() }

      <h2>Finished Games</h2>
      <ul class="game-list">
        ${ games.map(renderGame).join('') }
      </ul>
    `;
  },
  afterRender: async () => {
    // Listeners for New Game buttons
    document.querySelectorAll('.new-game-buttons button').forEach( button => {
      button.addEventListener(
        'click',
        () => startNewGame(button.dataset)
      );
    })

    // Listeners for Finished Games buttons
    document.querySelectorAll('.game-list button').forEach( button => {
      button.addEventListener(
        'click',
        () => Utils.redirect(`/user/games/${ button.dataset.id }`)
      );
    });

    // Listeners for Custom Game button
    document.querySelector('#new-game-form button')
            .addEventListener('click', newCustomGame);
  }
}

export default GamesIndex;
