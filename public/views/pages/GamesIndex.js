import Utils from '../../services/Utils.js';
import API   from '../../services/API.js';

const renderForm = () => {
  return `
    <div class="new-game-buttons">
      <div class="btn-container">
        <button type="button" value="Easy" class="btn">Easy</button>
      </div>
      <div class="btn-container">
        <button type="button" value="Medium" class="btn">Medium</button>
      </div>
      <div class="btn-container">
        <button type="button" value="Hard" class="btn">Hard </button>
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
          - ${ game.height } by ${ game.height }
        </button>
      </div>
    </li>
  `;
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
    document.querySelectorAll('.game-list button').forEach((button) => {
      button.addEventListener(
        'click',
        () => Utils.redirect(`/user/games/${ button.dataset.id }`)
      );
    });
  }
}

export default GamesIndex;
