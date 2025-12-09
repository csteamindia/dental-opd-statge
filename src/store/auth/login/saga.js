import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes"
import { apiError, loginSuccess, logoutUserSuccess } from "./actions"
import { post } from 'helpers/api_helper'
import cookieHelper from "helpers/getCookieData"


const userLogin = async (user) => await post('/auth/login', user)

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(userLogin, {
      email: user.email,
      password: user.password,
    })
    
    if(!response.success){
      yield put(apiError('invalid login credentials'))
    } else{
      cookieHelper.setCookie("authUser", JSON.stringify({user: response.body.user}), 1)
      cookieHelper.setCookie('access_token', response.body.access_token, 1)
      cookieHelper.setCookie('refresh_token', response.body.refresh_token, 1, 7)
  
      localStorage.setItem('role', response.body.user?.role)
  
      yield put(loginSuccess(response.body.user))
      
      if(response.body.user?.clinic.length){
        cookieHelper.setCookie('_c', btoa(JSON.stringify(response.body.user?.clinic[0])), 1, 7);
      }
      
      history.push("/clinics")
    }

  } catch (error) {
    yield put(apiError('invalid login credentials'))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    cookieHelper.deleteCookie("authUser")
    cookieHelper.deleteCookie("access_token")
    cookieHelper.deleteCookie("refresh_token")
    cookieHelper.deleteCookie("clinic")
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
