import React, { useState } from 'react';
import { render } from 'react-dom';


const Input = ({ addTodoList }) => {
    
    const [value, setValue] = useState("");

    return (
        <div id="todoInput" className="input-content">
            <img
                className="add"
                src="./assets/images/ic_add.png"
                alt=""
            />
            <input
                className="input"
                placeholder="What need to be done?"
                value={ value }
                type="text"
                onChange={(event) => { setValue(event.target.value) }}
                onKeyDown={
                    (event) => {
                        if (event.keyCode === 13) {
                            addTodoList(value);
                            setValue('')
                        }
                    }
                }
            />
        </div>
    )
}
export default Input;