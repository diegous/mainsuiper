import Login     from '../views/pages/Login.js';
import GameShow  from '../views/pages/GameShow.js';
import ListGames from '../views/pages/GameShow.js';

const routes = {
  '/': Login,
  '/user/games/:gameId:': GameShow,
}

const routeToRx = (route) => {
  return RegExp(`^${route}$`                           // regex delimiters
                  .replace(/:(\w+):/g, '(?<$1>\\d+)')  // find params
                  .replace(/\//g, '\\/'));             // slash escaping
}

const findController = (path) => {
  return Object.entries(routes)
               .map( ([route, controller]) => [routeToRx(route), controller])
               .find( ([regx, controller]) => regx.test(path));
}

const Router = {
  getPage: () => {
    const currentPath = window.location.pathname;
    const [regexp, controller] = findController(currentPath);
    const params = regexp.exec(currentPath).groups;

    return {page: controller, params: params};
  }
}

export default Router;
