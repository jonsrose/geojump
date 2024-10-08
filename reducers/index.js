import * as ActionTypes from '../actions/ActionTypes'
import merge from 'lodash/merge'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

function entities(state = { }, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}


function coordinates(state = null, action) {
  const { type } = action
  if (type === ActionTypes.NEW_COORDINATES) {
    return action.coordinates
  }

  return state
}

function mapCenter(state = null, action) {
  const { type } = action
  if (type === ActionTypes.NEW_COORDINATES || type === ActionTypes.MAP_CENTER_CHANGED) {
    return action.coordinates
  }
  return state
}

function mapTypeId(state = 'hybrid', action) {
  const { type } = action
  if (type === ActionTypes.MAP_TYPE_ID_CHANGED) {
    return action.mapTypeId
  }
  return state
}

function coordinatesString(state = null, action) {
  const { type } = action
  if (type === ActionTypes.NEW_COORDINATES) {
    return action.response.entities.coordinates[action.response.result].coordinatesString
  }

  return state
}

function navToCoordinatesString(state = null, action) {
  const { type, coordinatesString } = action
  if (type === ActionTypes.NAV_TO_COORDINATES) {
    return coordinatesString
  }

  return state
}

function navTolocality(state = null, action) {
  const { type, locality, index } = action

  if (type === ActionTypes.NAV_TO_LOCALITY) {
    return {locality, index}
  } else if (type === ActionTypes.LOCALITY_SUCCESS || type === '@@router/LOCATION_CHANGE') {
    return null
  }

  return state
}

function navToFlickrPhoto(state = {}, action) {
  const { type, id, index } = action

  if (type === ActionTypes.NAV_TO_FLICKR_PHOTO) {
    return {id, index}
  } else if (type === '@@router/LOCATION_CHANGE') {
    return null
  }

  return state
}

function navToPanoramioPhoto(state = {}, action) {
  const { type, id, index } = action

  if (type === ActionTypes.NAV_TO_PANORAMIO_PHOTO) {
    return {id, index}
  } else if (type === '@@router/LOCATION_CHANGE') {
    return null
  }

  return state
}

function locationForCoordinates(state = {}, action) {
  const { type } = action

  if (type === ActionTypes.LOCATION_SUCCESS) {
    return merge({}, state, {[action.response.coordinatesString]: action.response.result})
  }

  return state
}

function wikiLocationsForCoordinates(state = {}, action) {
  const { type } = action

  if (type === ActionTypes.WIKI_LOCATION_SUCCESS) {
    return merge({}, state, {[action.response.coordinatesString]: action.response.result})
  }

  return state
}

function locality(state = {}, action) {
  const { type } = action

  if (type === ActionTypes.LOCALITY_SUCCESS) {

    const id = action.response.result
    const localityObject = action.response.entities.localities[id]
    const { index } = localityObject

    return {id, index}
  } else if (type === ActionTypes.LOCALITY_REQUEST) {
    return null
  }

  return state
}

function flickrPhoto(state = {}, action) {
  const { type, id, index } = action

  if (type === ActionTypes.LOAD_FLICKR_PHOTO) {
    return {id, index}
  }

  return state
}

function panoramioPhoto(state = {}, action) {
  const { type, id, index } = action

  if (type === ActionTypes.LOAD_PANORAMIO_PHOTO) {
    return {id, index}
  }

  return state
}

function sideNav(state = true, action) {
  const { type } = action
  if (type === ActionTypes.SET_SIDE_NAV_VISIBILITY) {
    return action.open
  } else if (type == ActionTypes.WIKI_LOCATION_SUCCESS || type == ActionTypes.FLICKR_PHOTO_SUCCESS || type == ActionTypes.LOAD_FLICKR_PHOTO || type == ActionTypes.LOCALITY_SUCCESS  || type == ActionTypes.LOAD_PANORAMIO_PHOTO) {
    return true
  }

  return state
}


function persistentSideNav(state = true, action) {
  const { type } = action
  if (type === ActionTypes.SET_SIDE_NAV_VISIBILITY) {
    return action.open
  } else if (type == ActionTypes.WIKI_LOCATION_SUCCESS || type == ActionTypes.FLICKR_PHOTO_SUCCESS || type == ActionTypes.LOAD_FLICKR_PHOTO || type == ActionTypes.LOAD_PANORAMIO_PHOTO || type == ActionTypes.LOCALITY_SUCCESS || type == ActionTypes.WIKI_LOCATION_FAILURE || type == ActionTypes.FLICKR_PHOTO_FAILURE ) {
    return true
  }

  return state
}


function infoWindow(state = true, action) {
  const { type } = action
  if (type === ActionTypes.HIDE_INFO_WINDOW ) {
    return false
  } else if (type === ActionTypes.SHOW_INFO_WINDOW || type === ActionTypes.NEW_COORDINATES) {
    return true
  }
  return state
}

function hoverWikiLocationTitle(state = null, action) {
  const { type } = action
  if (type === ActionTypes.LEFT_NAV_WIKI_LOCATION_HOVER) {
    return action.title
  } else if (type === ActionTypes.LOCALITY_SUCCESS) {
    return action.response.result
  } else if (type === ActionTypes.LEFT_NAV_WIKI_LOCATION_UNHOVER || type === ActionTypes.NAV_TO_LOCALITY || type === '@@router/LOCATION_CHANGE') {
    return null
  }

  return state
}

function hoverFlickrPhotoId(state = null, action) {
  const { type } = action
  if (type === ActionTypes.LEFT_NAV_FLICKR_PHOTO_HOVER || type === ActionTypes.LOAD_FLICKR_PHOTO) {
    return action.id
  } else if (type === ActionTypes.LEFT_NAV_FLICKR_PHOTO_UNHOVER || type === ActionTypes.NAV_TO_FLICKR_PHOTO || type === '@@router/LOCATION_CHANGE') {
    return null
  }

  return state
}

function hoverPanoramioPhotoId(state = null, action) {
  //console.log(`hoverPanoramioPhotoId action = ${JSON.stringify(action)}`)
  const { type } = action
  if (type === ActionTypes.LEFT_NAV_PANORAMIO_PHOTO_HOVER || type === ActionTypes.LOAD_PANORAMIO_PHOTO) {
    return action.id
  } else if (type === ActionTypes.LEFT_NAV_PANORAMIO_PHOTO_UNHOVER || type === ActionTypes.NAV_TO_PANORAMIO_PHOTO || type === '@@router/LOCATION_CHANGE') {
    return null
  }

  return state
}

function zoom(state = false, action) {
  const { type, payload } = action
    if (type === ActionTypes.ZOOM) {
      return true
    } else if (type === ActionTypes.UNZOOM) {
      return false
    } else if (type === '@@router/LOCATION_CHANGE' && payload.pathname.indexOf('localityInfo') === -1 && payload.pathname.indexOf('panoramioPhoto') === -1 &&  payload.pathname.indexOf('flickrPhoto') === -1) {
      return false
    }
    return state
}

function hideEmpty(state = false, action) {
  const { type } = action

  if (type === ActionTypes.TOGGLE_HIDE_EMPTY) {
    return !state
  }

  return state
}

function showLinearProgress(state = false, action) {
  const { type } = action

  if (type == ActionTypes.REQUEST_SERVER_RANDOM_COORDINATES) return true

  if (type == ActionTypes.NAV_TO_COORDINATES) return false

  return state
}

export function getCurrentLocation(state) {
  var coordinatesString = state.coordinatesString

  var location = state.locationForCoordinates[coordinatesString]
  return (location)
}

export function getCurrentLocationObject(state) {
  var location = getCurrentLocation(state)

  if (!location) {
    return null
  }

  var locationObject = state.entities.locations[location]
  return (locationObject)
}

export function getCountry(state) {
  var locationObject = getCurrentLocationObject(state)

  if (!locationObject) {
    return null
  }

  return locationObject.country
}

export function getCountryObject(state) {
  var country = getCountry(state)

  if (!country || !state.entities.countries) {
    return null
  }

  return state.entities.countries[country]
}

export function getCountryText(state) {
  var countryObject = getCountryObject(state)

  if (!countryObject) {
    return null
  }

  return countryObject.extract
}

export function getAreaLevel1(state) {
  var locationObject = getCurrentLocationObject(state)

  if (!locationObject) {
    return null
  }

  return locationObject.areaLevel1
}

export function getAreaLevel1Object(state) {
  var areaLevel1 = getAreaLevel1(state)

  if (!areaLevel1 || !state.entities.areaLevel1s) {
    return null
  }

  return state.entities.areaLevel1s[areaLevel1]
}

export function getAreaLevel1Text(state) {
  var areaLevel1Object = getAreaLevel1Object(state)

  if (!areaLevel1Object) {
    return null
  }

  return areaLevel1Object.extract
}

export function getLocality(state) {
  var locationObject = getCurrentLocationObject(state)

  if (!locationObject) {
    return null
  }

  return locationObject.locality
}



export function getLocalityText(state) {
  var localityObject = getLocalityObject(state)

  if (!localityObject) {
    return null
  }

  return localityObject.extract
}

export function getWikiLocationKeys(state) {
  var coordinatesString = state.coordinatesString

  if (!state.entities.wikiLocationCoordinates || ! state.entities.wikiLocationCoordinates[coordinatesString]) {
    return null
  }

  return state.entities.wikiLocationCoordinates[coordinatesString].wikiLocations
}

export function getWikiLocations(state) {
  const wikiLocationKeys = getWikiLocationKeys(state)

  if (!wikiLocationKeys || wikiLocationKeys.length === 0) {
    return null
  }

  return wikiLocationKeys.map( wikiLocationKey => state.entities.wikiLocations[wikiLocationKey])

}

export function getFlickrPhotoKeys(state) {
  var coordinatesString = state.coordinatesString

  if (!state.entities.flickrPhotoCoordinates || ! state.entities.flickrPhotoCoordinates[coordinatesString]) {
    return null
  }

  return state.entities.flickrPhotoCoordinates[coordinatesString].flickrPhotos
}


export function getFlickrPhotos(state) {
  const flickrPhotoKeys = getFlickrPhotoKeys(state)

  if (!flickrPhotoKeys || flickrPhotoKeys.length === 0) {
    return null
  }

  let flickrPhotos = flickrPhotoKeys.map( flickrPhotoKey => state.entities.flickrPhotos[flickrPhotoKey])
  return flickrPhotos
}

export function getPanoramioPhotoKeys(state) {
  var coordinatesString = state.coordinatesString

  if (!state.entities.panoramioPhotoCoordinates || ! state.entities.panoramioPhotoCoordinates[coordinatesString]) {
    return null
  }

  return state.entities.panoramioPhotoCoordinates[coordinatesString].panoramioPhotos
}


export function getPanoramioPhotos(state) {

  const panoramioPhotoKeys = getPanoramioPhotoKeys(state)

  if (!panoramioPhotoKeys || panoramioPhotoKeys.length === 0) {
    return null
  }

  let panoramioPhotos = panoramioPhotoKeys.map( panoramioPhotoKey => state.entities.panoramioPhotos[panoramioPhotoKey])

  return panoramioPhotos
}


export function getLocalityObject(state) {
  var locality = state.locality

  if (!locality || !state.entities.localities) {
    return null
  }

  const { id, index } = locality

  let localityObject = state.entities.localities[id]

  const localityKeys = getWikiLocationKeys(state)

  if (localityKeys && localityKeys.length !== 0) {
    if (index > 0) {
      localityObject.prev = {id: localityKeys[index-1], index:index-1}
    }

    if (index < localityKeys.length-1) {
      localityObject.next = {id: localityKeys[index+1], index:index+1}
    }
  }

  return localityObject
}

export function getFlickrPhotoObject(state) {
  var flickrPhoto = state.flickrPhoto

  if (!flickrPhoto || !state.entities.flickrPhotos) {
    return null
  }

  const { id, index } = flickrPhoto

  let flickrPhotoObject = state.entities.flickrPhotos[id]

  const flickrPhotoKeys = getFlickrPhotoKeys(state)
  /* TODO check not null / empty? */
  if (index > 0) {
    flickrPhotoObject.prev = {id: flickrPhotoKeys[index-1], index:index-1}
  }

  if (index < flickrPhotoKeys.length-1) {
    flickrPhotoObject.next = {id: flickrPhotoKeys[index+1], index:index+1}
  }

  return flickrPhotoObject
}

export function getPanoramioPhotoObject(state) {
  var panoramioPhoto = state.panoramioPhoto

  if (!panoramioPhoto || !state.entities.panoramioPhotos) {
    return null
  }

  const { id, index } = panoramioPhoto

  let panoramioPhotoObject = state.entities.panoramioPhotos[id]

  const panoramioPhotoKeys = getPanoramioPhotoKeys(state)
  /* TODO check not null / empty? */
  if (index > 0) {
    panoramioPhotoObject.prev = {id: panoramioPhotoKeys[index-1], index:index-1}
  }

  if (index < panoramioPhotoKeys.length-1) {
    panoramioPhotoObject.next = {id: panoramioPhotoKeys[index+1], index:index+1}
  }

  return panoramioPhotoObject
}

export function getHoverWikiLocation(state) {
  if (!state.hoverWikiLocationTitle || !state.entities.wikiLocations || !state.entities.wikiLocations[state.hoverWikiLocationTitle] ) {
    return null
  }

  return state.entities.wikiLocations[state.hoverWikiLocationTitle]
}

export function getHoverFlickrPhoto(state) {
  if (!state.hoverFlickrPhotoId || !state.entities.wikiLocations || !state.entities.flickrPhotos[state.hoverFlickrPhotoId] ) {
    return null
  }

  return state.entities.flickrPhotos[state.hoverFlickrPhotoId]
}

export function getHoverPanoramioPhoto(state) {
  if (!state.hoverPanoramioPhotoId || !state.entities.wikiLocations || !state.entities.panoramioPhotos[state.hoverPanoramioPhotoId] ) {
    return null
  }

  return state.entities.panoramioPhotos[state.hoverPanoramioPhotoId]
}

export function getSideNavVisibility(state) {
  return state.sideNav || (state.persistentSideNav && !state.hideEmpty)
}

const rootReducer = combineReducers({
  entities,
  routing,
  coordinates,
  mapCenter,
  mapTypeId,
  sideNav,
  persistentSideNav,
  infoWindow,
  coordinatesString,
  locationForCoordinates,
  wikiLocationsForCoordinates,
  navToCoordinatesString,
  locality,
  flickrPhoto,
  panoramioPhoto,
  navTolocality,
  navToFlickrPhoto,
  navToPanoramioPhoto,
  hoverWikiLocationTitle,
  hoverFlickrPhotoId,
  hoverPanoramioPhotoId,
  zoom,
  hideEmpty,
  showLinearProgress
})



export default rootReducer
