import { takeEvery, fork, all, call } from "redux-saga/effects"
import { post } from "helpers/api_helper"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"

const newRegister = async (user) => await post('/auth/registration', user)

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }) {
  try {
    const { success } = yield call(newRegister, user);
    if(success){
      window.location.href = '/login'
    }
  } catch (error) {
    console.log('invalid request')
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
