import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import wikipediaApi from '../middleware/wikipediaApi'
import rootReducer from '../reducers'
import flickrApi from '../middleware/flickrApi'
import panoramioApi from '../middleware/panoramioApi'

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, wikipediaApi, flickrApi, panoramioApi)
  )
}
