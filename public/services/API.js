export default {
  login: '/users/sign_in',
  logout: '/users/sign_out',

  gamesList: '/api/games',
  game: id => `/api/games/${id}`,
  play: id => `/api/games/${id}/play`,
  flag: id => `/api/games/${id}/flag`,
};
