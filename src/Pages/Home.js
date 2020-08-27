import React, { Component } from 'react';
import MainLayout from '../Layouts/MainLayout.jsx'
import InputContainer from '../Containers/InputContainer.jsx';
import TodoListContainer from '../Containers/TodoListContainer.jsx';

class Home extends Component {
    render() {
        return (
            <MainLayout>
                <InputContainer />
                <TodoListContainer />
            </MainLayout>
        );
    }
}

export default Home;