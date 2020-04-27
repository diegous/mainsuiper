export default {
  login: '/users/sign_in',
  logout: '/users/sign_out',

  signup: '/users',

  gamesList: '/api/games',
  gameCreate: '/api/games',
  game: id => `/api/games/${id}`,
  play: id => `/api/games/${id}/play`,
  flag: id => `/api/games/${id}/flag`,
  reveal: id => `/api/games/${id}/reveal`,
};
