//import logMessage from './src/js/logger'


//require('../server/index.js.js');
require('./src/js/dashboard.js');

//require('./js/db.js');
require('./src/sass/main.scss');

//import '../sass/main.scss';

// Log message to console
logMessage('This is Budgety!')

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
    module.hot.accept() // eslint-disable-line no-undef  
}