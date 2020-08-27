import React, { Component } from 'react';
import MainLayout from '../Layouts/MainLayout.jsx'
import axios from 'axios'
class About extends Component {
    constructor(props) {
        super();
        this.state = {
            about: null
        }
    }
    componentDidMount() {
        axios.get('http://localhost:3000/about')
            .then(res => {
               this.setState({ about: res.data.text });
            })
    }
    render() {
        return (
            <MainLayout>
                <p>測試 About</p>
                <p>{this.state.about}</p>
            </MainLayout>
        );
    }
}

export default About;