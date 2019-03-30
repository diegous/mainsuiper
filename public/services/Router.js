import Login      from '../views/pages/Login.js';
import GameShow   from '../views/pages/GameShow.js';
import GamesIndex from '../views/pages/GamesIndex.js';

import NotFound   from '../views/pages/NotFound.js';

const routes = {
  '/': Login,
  '/user/games': GamesIndex,
  '/user/games/:gameId:': GameShow,
}

const routeToRx = (route) => {
  return RegExp(`^${route}\/?$`                    // regex delimiters & optional last '/'
               .replace(/:(\w+):/g, '(?<$1>\\d+)') // find params
               .replace(/\//g, '\\/'));            // slash escaping
}

const findController = (path) => {
  let result = Object.entries(routes)
                     .map( ([route, page]) => [routeToRx(route), page] )
                     .find( ([regx, page]) => regx.test(path) );

  result = result || [/(?:)/, NotFound];

  return result;
}

const Router = {
  getPage: () => {
    const currentPath = window.location.pathname;
    const [regexp, controller] = findController(currentPath);
    const params = regexp.exec(currentPath).groups;

    return { page: controller, params: params };
  }
}

export default Router;
