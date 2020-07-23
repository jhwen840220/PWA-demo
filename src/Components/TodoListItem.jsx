import React from 'react';

const TodoListItem = ({ isComplete, id, desc, delTodoList, toggleTodoList }) => {

    const modifyList = () => {
        toggleTodoList({
            id,
            desc,
            isComplete: !isComplete
        });
    }
    return (
        <li className="list">
            <a
                className={ isComplete ? 'finish' : 'unfinished' }
                onClick={modifyList}
            >
            </a>
            <p
                className="desc"
                onClick={modifyList}
            >
                { desc }
            </p>
            <a
                className="del"
                onClick={() => { delTodoList(id) }}
            >
            </a>
        </li>
    );
}


export default TodoListItem;