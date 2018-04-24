import { takeEvery, put, take, call, all, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { toast } from 'react-toastify'

function* children() {
  toast.info('children: START')

  yield delay(2000)

  throw 'children error'
}

export default function* saga() {
  try {
    toast.info('main: START')
    yield fork(children)

    // WAIT UNTIL MAGIC
    yield take('WAIT')
  } catch (err) {
    toast.error(`main: CATCH, ${err}`)
  } finally {
    toast.warn('main: FINALLY')
  }
}
