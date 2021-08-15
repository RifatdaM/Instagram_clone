import { combineReducers } from "redux";
import {user} from './user'
import {users} from './users'

const Reducers =combineReducers({
    userState: user,
    suersState: users
})

export default Reducers