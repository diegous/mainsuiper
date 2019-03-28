export default {
  login: '/users/sign_in',
  logout: '/users/sign_out',
  play: id => `/games/${id}/play`,
  flag: id => `/games/${id}/flag`,
};
