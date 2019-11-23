import logMessage from './src/js/logger'


//require('../server/index.js.js');
require('./src/js/dashboard.js');

//require('./js/db.js');
require('./sass/main.scss');
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
//import '../sass/main.scss';

// Log message to console
logMessage('This is Budgety!')

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
    module.hot.accept() // eslint-disable-line no-undef  
}