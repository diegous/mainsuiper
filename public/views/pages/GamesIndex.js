import Utils from '../../services/Utils.js';
import API   from '../../services/API.js';

const renderForm = () {
  return `
      <form id="new-game-form">
        <label for="email">Email</label>
        <input type="text" name="email" id="email"></input>
        <br/>

        <label for="password">Password</label>
        <input type="text" name="password" id="password"></input>
        <br/>

        <button type="button" value="Login" class="btn"></input>
      </form>
    `
}

const renderGame = (game) => {
  return `
    <li>
      <button type="button" data-id="${ game.id }" class="btn">
        <span class="game-${ game.state }">
          ${ game.state }
        </span>
        - ${ game.height } by ${ game.height }
      </button>
    </li>
  `;
}

const GamesIndex = {
  render: async () => {
    const response = await fetch(API.gamesList);
    const games = await response.json();

    return `
      <h1>Games</h1>

      <h2>New Game</h2>
      <form>
      </form>

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
