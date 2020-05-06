import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk' // 用来处理异步
import { composeWithDevTools } from 'redux-devtools-extension'

import axios from 'axios'

const userInitialState = {}

const LOGINOUT = 'LOGINOUT'

const userReducer = (state = userInitialState, action) => {
	switch (action.type) {
		case LOGINOUT:
			return {}
		default:
			return state
	}
}

export const loginout = () => {
	return (dispatch) => {
		axios
			.post('/loginout')
			.then((resp) => {
				if (resp.status === 200) {
					dispatch({
						type: LOGINOUT,
					})
				} else {
					console.log('TCL: loginout fail', resp)
				}
			})
			.catch((err) => {
				console.log('TCL: loginout fail', err)
			})
	}
}

const allReducers = combineReducers({
	user: userReducer,
})

export default function initializeStore(state) {
	const store = createStore(
		allReducers,
		Object.assign(
			{},
			{
				user: userInitialState,
			},
			state
		),
		composeWithDevTools(applyMiddleware(ReduxThunk))
	)

	return store
}
