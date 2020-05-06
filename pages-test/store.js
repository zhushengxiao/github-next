import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
	count: 0,
}
const userInitialState = {
	username: 'jack',
	age: 10,
}

const ADD = 'ADD'
const UPDATE_USERNAME = 'UPDATE_USERNAME'
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD:
			return { count: state.count + (action.num || 1) }
		default:
			return state
	}
}

const userReducer = (state = userInitialState, action) => {
	switch (action.type) {
		case UPDATE_USERNAME:
			return {
				...state,
				username: action.name,
			}
		default:
			return state
	}
}

const allReducers = combineReducers({
	counter: reducer,
	user: userReducer,
})

export const add = (num) => {
	return {
		type: ADD,
		num,
	}
}

export const update = (name) => {
	return { type: UPDATE_USERNAME, name }
}

const asyncUpdate = (name) => {
	return (dispatch, getState) => {
		setTimeout(() => {
			dispatch(update(name))
		}, 1000)
	}
}

export default function initializeStore(state) {
	const store = createStore(
		allReducers,
		Object.assign(
			{},
			{
				counter: initialState,
				user: userInitialState,
			},
			state
		),
		composeWithDevTools(applyMiddleware(ReduxThunk))
	)

	return store
}
