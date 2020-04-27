import Utils from '../../services/Utils.js';
import API   from '../../services/API.js';

const signup = async () => {
  event.preventDefault();

  const data = {
    user: {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      passwordConfirm: document.getElementById('passwordConfirm').value
    }
  }

  const response = await Utils.postData(API.signup, data);
  const responseData = await response.json();

  if (response.status == 201) {
    document.querySelector('.success').classList.remove('hide');
    document.querySelector('.error').classList.add('hide');
  } else {
    document.querySelector('.success').classList.add('hide');
    document.querySelector('.error').classList.remove('hide');
    document.querySelector('.error').textContent = responseData.errors;
  }
}

const Signup = {
  render: () => {
    return `
        <form id="signup-form">
          <label for="email">Email</label>
          <input type="text" name="email" id="email" class="retro-gaming"></input>
          <br/>

          <label for="password">Password</label>
          <input type="password" name="password" id="password" class="retro-gaming"></input>
          <br/>

          <label for="passwordConfirm">Password confirmation</label>
          <input type="password" name="passwordConfirm" id="passwordConfirm" class="retro-gaming"></input>
          <br/>

          <div class="alert error"></div>
          <div class="alert success hide">User created successfully! Login to continue</div>

          <div class="btn-container">
            <button id="signup" type="button" class="btn">Signup</button>
          </div>

          <div class="btn-container">
            <button id="login" type="button" class="btn">Login</button>
          </div>
        </form>
      `
  },
  afterRender: () => {
    document.getElementById('signup').addEventListener('click', signup);
    document.getElementById('login').addEventListener(
      'click',
      () => Utils.redirect('/')
    );
  }
}

export default Signup;
