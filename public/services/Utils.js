import Router from '../services/Router.js';

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
    const content = document.getElementById('page_container');
    const request = window.location.pathname;
    const {page, params} = Router.getPage();

    content.innerHTML = await page.render(params);
    await page.afterRender();
  },

  redirect: function(url) {
    window.history.pushState(null, '', url);
    Utils.renderer();
  }
}

export default Utils;
