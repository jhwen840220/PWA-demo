import { connect } from 'react-redux';
import Input from '../Components/Input.jsx';
import { addTodoList, getTodoList } from '../Reducers/todolist.js';

export default connect(null, {
    addTodoList,
    getTodoList
})(Input);