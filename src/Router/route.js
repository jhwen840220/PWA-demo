import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from '../Pages/Home.js';
import About from '../Pages/About.js';

export default function(store) {
    return (
        <Router>
            <Route exact path="/" component={ Home }></Route>
            <Route path="/about" component={ About }></Route>
        </Router>
    )
}
