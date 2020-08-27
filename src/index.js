import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './Store/configureStore.js'
import createRoutes from './Router/route.js';
import "../assets/main.css"

const store = createStore();
const routes = createRoutes(store);

ReactDOM.render(
<Provider store={ store }>
    { routes }
</Provider>, document.getElementById('root'));
