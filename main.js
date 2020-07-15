(function (window, document) {
    const todoListDOM = document.getElementById('todoList');
    const todoInputDOM = document.getElementById('todoInput');

    todoInputDOM.addEventListener('keydown', event => {
        if (event.keyCode === 13 && event.target.value) {
            addItem({ desc: event.target.value, isComplete: false });
            event.target.value = '';
        }
    })

    const addItem = item => {
        fetch('http://localhost:3000/todolist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(res => res.json())
        .then(json => {
            todoList.push(json);
            renderTodoList(todoList);
        })
    }
    
    todoListDOM.addEventListener('click', event => {
        const currentTarget = event.target;
    
        if (currentTarget && (currentTarget.matches('a.unfinish') || currentTarget.matches('a.finish') || currentTarget.matches('.desc'))) {
            // 點擊待辦事項內的項目icon及項目文字，執行修改待辦事項的方法
            toggleItem(parseInt(currentTarget.dataset.id, 10))
        }
        if (currentTarget && currentTarget.matches('a.del')) {
            // 點擊待辦事項內的刪除 icon，觸發刪除待辦事項的行為
            removeItem(parseInt(currentTarget.dataset.id, 10))
        }
    });

    const toggleItem = id => {
        const currentSelectItem = todoList.find(item => item.id === id);
        // 切換『已完成』和『未完成』狀態
        currentSelectItem.isComplete = !currentSelectItem.isComplete;
        fetch(`http://localhost:3000/todolist/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentSelectItem)
        })
        .then(res => res.json())
        .then(json => {
            renderTodoList(todoList);
        })
    }  

    const removeItem = id => {
        fetch(`http://localhost:3000/todolist/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {
            todoList = todoList.filter(item => item.id !== id);
            renderTodoList(todoList);
        })
    }


    const renderTodoList = todoList => {
        const html = todoList.map((item, index) => `<li class="list">
                <a class="${item.isComplete ? 'finish' : 'unfinish'}" data-id=${item.id}></a>
                <p class="desc" data-id=${item.id}>
                    ${item.desc}
                </p>
                <a class="del" data-id=${item.id}>刪除</a>
            </li>`).join('')
        todoListDOM.innerHTML = html;
    }

    let todoList = [];

    // 取得待辦事項清單（GET）
    fetch('http://localhost:3000/todolist')
    .then(res => res.json())
    .then(json => {
        todoList = todoList.concat(json);
        renderTodoList(todoList); // render todoList
    })
    .catch(err => {
        console.log(err);
    })  
    
}(window, document))