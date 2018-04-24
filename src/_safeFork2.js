import { takeEvery, put, take, call, all, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { toast } from 'react-toastify'

function* children() {
  toast.info('children: START')

  yield delay(1000)

  throw 'children error'
}

const safeFork = saga =>
  fork(function*() {
    try {
      yield call(saga)
    } catch (err) {
      yield put({ type: 'ERROR', error: `safeFork(${err})` })
    }
  })

export default function* saga() {
  try {
    toast.info('main: START')
    yield safeFork(children)

    while (true) {
      const { error } = yield take(action => action.error)
      toast.error(error)
    }
  } catch (err) {
    toast.error(`main: CATCH, ${err}`)
  } finally {
    toast.warn('main: FINALLY')
  }
}
