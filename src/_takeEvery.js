import {
  put,
  take,
  call,
  all,
  fork,
  getContext,
  setContext
} from 'redux-saga/effects'
import { delay, channel as sagaChannel } from 'redux-saga'
import { toast } from 'react-toastify'

// 0. picture
// 1. call
// 2. fork
// 3. safe fork
// 4. safe fork 2
// 5. moar children
// 6. HOS
// 7. channel
// 8. takeEvery

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
    } catch (error) {
      const channel = yield getContext('channel')
      yield put(channel, { error })
    }
  })

const takeEvery = (pattern, saga) =>
  safeFork(
    withErrorBoundary(
      function*() {
        while (true) {
          yield take(pattern)
          yield safeFork(saga)
        }
      },
      null,
      pattern
    )
  )

function* main() {
  yield takeEvery('MAKE_CHILD', makeChild('main'))

  yield put({ type: 'MAKE_CHILD' })
  yield put({ type: 'MAKE_CHILD' })
}

function* second() {
  yield safeFork(makeChild(3))
}

const withErrorBoundary = (saga, cb, key) =>
  function*() {
    const parentChannel = yield getContext('channel')
    const channel = yield sagaChannel()
    yield setContext({ channel })

    // Need to fork here as call would wait until all children sagas
    // are finished
    yield safeFork(saga)

    while (true) {
      const { error } = yield take(channel)

      if (cb) {
        cb(error)
      }

      if (parentChannel) {
        yield put(parentChannel, { error: `${key}(${error})` })
      }
    }
  }

export default function*() {
  yield fork(withErrorBoundary(main, toast.error, 'Main'))
  yield fork(withErrorBoundary(second, toast.error, 'Second'))
}
