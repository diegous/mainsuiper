"use strict";

import GameShow from './views/pages/GameShow.js';

const ROOT = '/app'
const routes = {
  '/': GameShow
}

const router = async () => {
  const content = document.getElementById('page_container');
  const request = window.location.pathname;
  const page = routes[request];
  console.log("about to load home");

  content.innerHTML = await page.render();
  await page.afterRender();
}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);
