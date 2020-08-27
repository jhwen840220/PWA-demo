const axios = require('axios');
const initialState = [];
const RECEIVE_TODO = 'RECEIVE_TODO';
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DEL_TODO = 'DEL_TODO';
const URL = 'http://localhost:3000/';

export function receiveTodoList (data) {
    return {
        type: RECEIVE_TODO,
        data: data
    };
}

export function getTodoList() {
    // 此 flag 的用意是，若 fetch API 比 cache 執行速度快，就直接使用 fetch 回來的 response
    var networkDataReceived = false;
    const url = `${URL}todolist`;
    return function(dispatch) {
        axios.get(url)
            .then(res => {
                // 在 fetch 回傳之後，直接設置為 true
                networkDataReceived = true;
                dispatch(receiveTodoList(res.data));
            })
        
        if ('indexedDB' in window) {
            // fetch indexedDB data
            readAllData('todoItem')
                .then(data => {
                    // 在 indexed 這一段，若 networkDataReceived 已經為 true (fetch 回傳成功)，則不再切回舊的 db 資料
                    if (!networkDataReceived && data) {
                        dispatch(receiveTodoList(data));
                    }
                })
        }

        // if ('caches' in window) {
        //     caches.match(url)
        //         .then(res => {
        //             if (res) {
        //                 return res.json();
        //             }
        //         })
        //         .then(data => {
        //             // 在 cache 這一段，若 networkDataReceived 已經為 true (fetch 回傳成功)，則不再切回舊的 cache 資料
        //             if (!networkDataReceived && data) {
        //                 dispatch(receiveTodoList(data));
        //             }
        //         })
        // }
    }
}

export function receiveAddTodoList (payload) {
    return {
        type: ADD_TODO,
        payload: payload
    };
}

export function addTodoList (postData) {
    return function(dispatch) {
        return axios({
            method: 'post',
            url: `${URL}todolist`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: postData
        })
        .then(res => {
            dispatch(receiveAddTodoList(res.data));
        })
        .catch(error => { 
            // 背景同步
            if('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(function(sw) {
                    writeData('sync-posts', postData)
                        .then(function() {
                            sw.sync.register('sync-new-post')
                                .then(()=>{
                                    readAllData('sync-posts')
                                })
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                })
            }
        })
    }
}

// { id: 1, name: 'anna', isComplete: true }
export function toggleTodoList (payload) {
    return function(dispatch) {
        return axios({
            method: 'put',
            url: `${URL}todolist/${payload.id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: payload
        })
        .then(res => {
            dispatch({type: TOGGLE_TODO, payload: payload});
        })
    }
}

export function delTodoList (id) {
    return function(dispatch) {
        return axios({
            method: 'delete',
            url: `${URL}todolist/${id}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            dispatch({type: DEL_TODO, id: id});
        })
    }
}

export default function todolist (state = initialState, action) {
    switch (action.type) {
    case RECEIVE_TODO:
        return action.data;
    case ADD_TODO:
        state.push(action.payload);
        return [...state];
    case TOGGLE_TODO:
        state.forEach((item, index) => {
            if (item.id === action.payload.id) {
                state[index] = action.payload;
            }
        })
        return [...state];
    case DEL_TODO:
        return state.filter(item => item.id !== action.id)
    default:
        return state;
    }
}