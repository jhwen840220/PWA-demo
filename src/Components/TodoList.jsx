import React, { useState, useEffect } from 'react';
import TodoListItem from './TodoListItem.jsx';

const TodoList = ({ todos, getTodoList, toggleTodoList, delTodoList }) => {

    const [networkDataReceived, SetNetworkDataReceived] = useState(false)
    useEffect(() => {
        getTodoList();
    }, [])

    return (
        <ul id="todoList">
        {
            todos.map((item, index) => {
                return (
                    <TodoListItem
                        key={`todolist_${index}`}
                        id={ item.id }
                        desc={ item.desc }
                        isComplete={ item.isComplete }
                        toggleTodoList={ toggleTodoList }
                        delTodoList={ delTodoList }
                    />
                )
            })
        }
        </ul>
    );
}

export default TodoList;