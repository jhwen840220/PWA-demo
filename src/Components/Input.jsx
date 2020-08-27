import React, { useState } from 'react';
import { render } from 'react-dom';
import icAdd from '../../assets/images/ic_add.png'

const Input = ({ addTodoList, getTodoList }) => {
    const [value, setValue] = useState("");

    const handleAdd = (event) => {
        if (event.keyCode === 13) {
            const postData = {
                isComplete: false,
                desc: value,
                id: new Date().getTime(),
                timeStamp: new Date().getTime()
            }
            addTodoList(postData);        
            setValue('');
        }
    }
    return (
        <div id="todoInput" className="input-content">
            <img
                className="add"
                src={icAdd}
                alt=""
            />
            <input
                className="input"
                placeholder="What need to be done?"
                value={ value }
                type="text"
                onChange={(event) => { setValue(event.target.value) }}
                onKeyDown={handleAdd}
            />
        </div>
    )
}
export default Input;