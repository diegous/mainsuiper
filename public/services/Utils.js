import Router from '../services/Router.js';
import Header from '../views/shared/Header.js';
import Footer from '../views/shared/Footer.js';

const Utils = {
  postData: (url, data = {}) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }

    return fetch(url, options);
  },

  findCellSize: () => {
    const board = document.getElementById('board');
    const size = window.getComputedStyle(board).getPropertyValue('--cell-total-size');
    return Number(size.slice(1, -2));
  },

  renderer: async function() {
    // Header
    const header = document.getElementById('header_container');
    header.innerHTML = await Header.render();

    // Body
    const content = document.getElementById('page_container');
    const request = window.location.pathname;
    const {page, params} = Router.getPage();

    content.innerHTML = await page.render(params);
    await page.afterRender();

    // Footer
    const footer = document.getElementById('footer_container');
    footer.innerHTML = await Footer.render();
  },

  redirect: function(url) {
    window.history.pushState(null, '', url);
    Utils.renderer();
  }
}

export default Utils;
