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
    var networkDataReceived = false;
    const url = `${URL}todolist`;
    return function(dispatch) {
        axios.get(url)
            .then(res => {
                networkDataReceived = true;
                dispatch(receiveTodoList(res.data));
            })
        
        if ('caches' in window) {
            // fetch cached data
            caches.match(url)
                .then(res => {
                    if (res) {
                        return res.json();
                    }
                })
                .then(data => {
                    // don't overwrite newer network data
                    if (!networkDataReceived && data) {
                        dispatch(receiveTodoList(data));
                    }
                })
        }
    }
}

export function receiveAddTodoList (payload) {
    return {
        type: ADD_TODO,
        payload: payload
    };
}

export function addTodoList (value) {
    return function(dispatch) {
        return axios({
            method: 'post',
            url: `${URL}todolist`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                isComplete: false,
                desc: value
            }
        })
        .then(res => {
            dispatch(receiveAddTodoList(res.data));
        })
        .catch(error => { console.log(error) })
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