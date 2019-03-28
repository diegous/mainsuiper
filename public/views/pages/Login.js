import Utils from '../../services/Utils.js';
import API   from '../../services/Api.js';

const loginUser = async () => {
  event.preventDefault();

  const data = {
    user: {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    }
  }

  const response = await Utils.postData(API.login, data);
  const jwt = response.headers.get('Authorization');

  if (response.status == 200) {
    window.history.pushState(null, '', '/user/games/1');
    Utils.renderer();
  } else {
    // incorrect credentials
  }
}

const Login = {
  render: () => {
    return `
        <form id="login-form">
          <label for="email">Email</label>
          <input type="text" name="email" id="email"></input>
          <br/>

          <label for="password">Password</label>
          <input type="text" name="password" id="password"></input>
          <br/>

          <input type="submit" value="Login"></input>
        </form>
      `
  },
  afterRender: () => {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', () => loginUser(form), false);
  }
}

export default Login;
