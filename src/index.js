import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import createStore from './Store/configureStore.js'
import createRoutes from './Router/route.js';
import "../assets/main.css"

const store = createStore();
const routes = createRoutes(store);

ReactDOM.render(
<Provider store={ store }>
    <HashRouter>
        { routes }
    </HashRouter>
</Provider>, document.getElementById('root'));
