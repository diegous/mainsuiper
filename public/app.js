"use strict";

import Utils  from './services/Utils.js';

// Listen on hash change:
window.addEventListener('hashchange', Utils.renderer);

// Listen on page load:
window.addEventListener('load', Utils.renderer);
