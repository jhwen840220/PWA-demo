"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.receiveTodoList = receiveTodoList;
exports.getTodoList = getTodoList;
exports.receiveAddTodoList = receiveAddTodoList;
exports.addTodoList = addTodoList;
exports.toggleTodoList = toggleTodoList;
exports.delTodoList = delTodoList;
exports["default"] = todolist;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var axios = require('axios');

var initialState = [];
var RECEIVE_TODO = 'RECEIVE_TODO';
var ADD_TODO = 'ADD_TODO';
var TOGGLE_TODO = 'TOGGLE_TODO';
var DEL_TODO = 'DEL_TODO';
var URL = 'http://localhost:3000/';

function receiveTodoList(data) {
  return {
    type: RECEIVE_TODO,
    data: data
  };
}

function getTodoList() {
  // 此 flag 的用意是，若 fetch API 比 cache 執行速度快，就直接使用 fetch 回來的 response
  var networkDataReceived = false;
  var url = "".concat(URL, "todolist");
  return function (dispatch) {
    axios.get(url).then(function (res) {
      // 在 fetch 回傳之後，直接設置為 true
      networkDataReceived = true;
      dispatch(receiveTodoList(res.data));
    });

    if ('indexedDB' in window) {
      // fetch indexedDB data
      readAllData('todoItem').then(function (data) {
        // 在 indexed 這一段，若 networkDataReceived 已經為 true (fetch 回傳成功)，則不再切回舊的 db 資料
        if (!networkDataReceived && data) {
          dispatch(receiveTodoList(data));
        }
      });
    } // if ('caches' in window) {
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

  };
}

function receiveAddTodoList(payload) {
  return {
    type: ADD_TODO,
    payload: payload
  };
}

function addTodoList(postData) {
  return function (dispatch) {
    return axios({
      method: 'post',
      url: "".concat(URL, "todolist"),
      headers: {
        'Content-Type': 'application/json'
      },
      data: postData
    }).then(function (res) {
      dispatch(receiveAddTodoList(res.data));
    })["catch"](function (error) {
      // 背景同步
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(function (sw) {
          writeData('sync-posts', postData).then(function () {
            sw.sync.register('sync-new-post').then(function () {
              readAllData('sync-posts');
            });
          })["catch"](function (err) {
            console.log(err);
          });
        });
      }
    });
  };
} // { id: 1, name: 'anna', isComplete: true }


function toggleTodoList(payload) {
  return function (dispatch) {
    return axios({
      method: 'put',
      url: "".concat(URL, "todolist/").concat(payload.id),
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    }).then(function (res) {
      dispatch({
        type: TOGGLE_TODO,
        payload: payload
      });
    });
  };
}

function delTodoList(id) {
  return function (dispatch) {
    return axios({
      method: 'delete',
      url: "".concat(URL, "todolist/").concat(id),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      dispatch({
        type: DEL_TODO,
        id: id
      });
    });
  };
}

function todolist() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case RECEIVE_TODO:
      return action.data;

    case ADD_TODO:
      state.push(action.payload);
      return _toConsumableArray(state);

    case TOGGLE_TODO:
      state.forEach(function (item, index) {
        if (item.id === action.payload.id) {
          state[index] = action.payload;
        }
      });
      return _toConsumableArray(state);

    case DEL_TODO:
      return state.filter(function (item) {
        return item.id !== action.id;
      });

    default:
      return state;
  }
}