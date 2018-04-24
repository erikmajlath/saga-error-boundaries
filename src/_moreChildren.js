import { takeEvery, put, take, call, all, fork } from 'redux-saga/effects'
import { delay, channel } from 'redux-saga'
import { toast } from 'react-toastify'

// 0. picture
// 1. call
// 2. fork
// 3. safe fork
// 4. safe fork 2
// 5. moar children

function* children() {
  toast.info('children: START')

  yield delay(1000)
  throw 'children error'
}

function* children2() {
  toast.info('children2: START')

  yield delay(2000)
  throw 'children2 error'
}

const safeFork = saga =>
  fork(function*() {
    try {
      yield call(saga)
    } catch (err) {
      yield put({ type: 'ERROR', error: `safeFork(${err})` })
    }
  })

function* main() {
  try {
    toast.info('main: START')
    yield safeFork(children)
    yield safeFork(children2)

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

function* children3() {
  toast.info('children3: START')

  yield delay(2000)
  throw 'children3 error'
}

function* second() {
  try {
    toast.info('second: START')
    yield safeFork(children3)

    while (true) {
      const { error } = yield take(action => action.error)
      toast.error(error)
    }
  } catch (err) {
    toast.error(`second: CATCH, ${err}`)
  } finally {
    toast.warn('second: FINALLY')
  }
}

export default function*() {
  yield fork(main)
  yield fork(second)
}
