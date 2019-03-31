import Utils from '../../services/Utils.js';
import API   from '../../services/API.js';

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
    Utils.redirect('/user/games');
  } else {
    alert('Incorrect username or password');
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

          <div class="btn-container">
            <button type="button" class="btn">Login</button>
          </div>
        </form>
      `
  },
  afterRender: () => {
    document.querySelector('button').addEventListener('click', loginUser);
  }
}

export default Login;
