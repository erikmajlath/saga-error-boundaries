import { takeEvery, put, take, call, all, fork } from 'redux-saga/effects'
import { delay, channel } from 'redux-saga'
import { toast } from 'react-toastify'

// 0. picture
// 1. call
// 2. fork
// 3. safe fork
// 4. safe fork 2
// 5. moar children
// 6. HOS

const makeChild = id =>
  function* children() {
    toast.info(`children${id}: START`)

    yield delay(1000)
    toast.info(`children${id}: THROW`)
    throw `children${id} error`
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
  yield safeFork(makeChild(1))
  yield safeFork(makeChild(2))
}

function* second() {
  yield safeFork(makeChild(3))
}

const withErrorBoundary = saga =>
  function*() {
    // Need to fork here as call would wait until all children sagas
    // are finished
    yield safeFork(saga)

    while (true) {
      const { error } = yield take(action => action.error)
      toast.error(error)
    }
  }

export default function*() {
  yield fork(withErrorBoundary(main))
  yield fork(withErrorBoundary(second))
}
