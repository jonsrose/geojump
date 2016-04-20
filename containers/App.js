import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { newCoordinatesString, randomCoordinates, toggleSideNav, loadCountry, loadLocation, loadWikiLocation, loadAreaLevel1 } from '../actions'
import {getCurrentLocation, getCurrentLocationObject, getCountryObject, getAreaLevel1Object} from '../reducers'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menu/menu-item'
import AppBar from 'material-ui/lib/app-bar'
import RaisedButton from 'material-ui/lib/raised-button'
import Paper from 'material-ui/lib/paper'

import {deepOrange500} from 'material-ui/lib/styles/colors'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider'

// todo: on page load it needs to handle case where coords already present, e.g. put load location in right place
// todo: fix mobile, maybe use appleftnav? download source of material ui
// todo: link up panoramio

const SideNavLabel = props =>
<div style={{color:'rgba(0, 0, 0,0.54)',fontSize:'14px',fontWeight:500,lineHeight:'48px',paddingLeft:'16px'}}
>
  {props.children}
</div>

const MainSection = props =>
<div style={{
    position: 'absolute',
    top: 0,
    left: props.sideNavWidth + 'px',
    right: 0,
    bottom: 0,
    backgroundColor:'rgb(0, 188, 212)'
  }}

>
  {props.children}
</div>

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDismissClick = this.handleDismissClick.bind(this)
  }

  handleDismissClick(e) {
    e.preventDefault()
  }

  handleChange(nextValue) {
    browserHistory.push(`/${nextValue}`)
  }

  //loadLocation(currentLocation) {
    //browserHistory.push(`/locations/${currentLocation}`)
  //}

  navigateToMap(coordinatesString) {
    console.log('navigateToMap')
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  navigateToCountry(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/countryInfo`)
  }

  navigateToAreaLevel1(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}/areaLevel1Info`)
  }

  mapInfo() {
    this.navigateToMap(this.props.coordinatesString)
  }

  countryInfo() {
    this.navigateToCountry(this.props.coordinatesString)
  }

  areaLevel1Info() {
    this.navigateToAreaLevel1(this.props.coordinatesString)
  }

  componentWillReceiveProps(nextProps) {

    // sole.log('componentWillReceiveProps')

    if (nextProps.navToCoordinatesString !== this.props.navToCoordinatesString) {
      // sole.log('navigateToMap')
      this.navigateToMap(nextProps.navToCoordinatesString)
    }

    this.loadData(nextProps)

    if (nextProps.coordinatesString !== this.props.coordinatesString) {
      //// sole.log('loadCoord')
      //this.navigateToMap(nextProps.coordinatesString)
      // sole.log('loadLoc')
      this.props.loadLocation(nextProps.coordinatesString)
      this.props.loadWikiLocation(nextProps.coordinates.lat, nextProps.coordinates.lng)
    }
/*
    if (nextProps.country !== this.props.country) {
      this.props.loadCountry(nextProps.country)
    }
*/

    if (nextProps.currentLocationObject && nextProps.currentLocationObject.country) {
      if (!this.props.currentLocationObject || !this.props.currentLocationObject.country
        || this.props.currentLocationObject.country != nextProps.currentLocationObject.country) {
        this.props.loadCountry(nextProps.currentLocationObject.countryName)
        // sole.log('loadCountry')
      }
    }

    if (nextProps.currentLocationObject && nextProps.currentLocationObject.areaLevel1) {
      if (!this.props.currentLocationObject || !this.props.currentLocationObject.areaLevel1
        || this.props.currentLocationObject.areaLevel1 != nextProps.currentLocationObject.areaLevel1) {
        this.props.loadAreaLevel1(nextProps.currentLocationObject.areaLevel1)
        // sole.log('loadCountry')
      }
    }
  }

  loadData(props) {
    if (props.coordinatesStringParam && !props.coordinatesString || props.coordinatesStringParam != props.coordinatesString) {
      // sole.log('newCoordinatesString')
      this.props.newCoordinatesString(props.coordinatesStringParam)
    } else {
      // sole.log('no need for newCoordinatesString')
    }

    //this.props.loadLocation(props.lat, props.lng)
  }

  componentWillMount() {
    // sole.log('componentWillMount')
    // sole.log('containers/MapPage componentWillMount')
    // loadData(this.props)
    // sole.log(this.props)
//    this.loadData(this.props) /* TODO what here */
    this.loadData(this.props)
  }


  randomCoordinates() {
    //this.setState(this.getLatLngFromRandom());
    this.props.randomCoordinates()
    // sole.log('randomCoordinates')
  }

  getTitle() {
    let title

    if (this.props.coordinates) {
      if (this.props.currentLocationObject) {
          title = `${this.props.currentLocationObject.formattedAddress} - Coords: `
      } else {
        title = 'Coords: '
      }
      title += `${this.props.coordinates.lat}, ${this.props.coordinates.lng}`
    } else {
      title = 'Get Random Location'
    }

    return title
  }

  renderCoordinates() {
      // sole.log('renderCoordinates')
      const { coordinates } = this.props

      if (!coordinates) {
        return null
      }

      const { lat, lng } = coordinates
      if (!lat || !lng) {
        return null
      }

      return (
        <SideNavLabel>
          latitude, longitude: {lat}, {lng}
        </SideNavLabel>
      )
  }

  renderCurrentLocation() {
    // sole.log('renderCurrentLocation this.props')
    // sole.log(this.props)
    const { currentLocationObject } = this.props
    // sole.log(currentLocationObject)

    if (!currentLocationObject) {
      return null
    }

    return (
      <SideNavLabel>
        {currentLocationObject.formattedAddress}
      </SideNavLabel>
    )

  }



  renderCountryMenuItem() {
    console.log('renderCountryMenuItem')
    const { countryObject, page } = this.props
    // sole.log(`countryObject ${countryObject}`)

    if (page == 'country' || page == 'home') {
      // sole.log('if (page == \'country\') ')
      return null
    }

    if (!countryObject || ! countryObject.title) {
      //console.log('nocountry')
      return null
    }

    console.log(`country ${countryObject.title}`)

    return (
      <MenuItem onTouchTap={this.countryInfo.bind(this)}>More about {countryObject.title}</MenuItem>
    )
  }

  renderAreaLevel1MenuItem() {
    console.log('renderAreaLevel1MenuItem')
    const { areaLevel1Object, page } = this.props
    // sole.log(`areaLevel1Object ${areaLevel1Object}`)

    if (page == 'areaLevel1' || page == 'home') {
      // sole.log('if (page == \'areaLevel1\') ')
      return null
    }

    if (!areaLevel1Object || ! areaLevel1Object.title) {
      //console.log('noareaLevel1')
      return null
    }

    console.log(`areaLevel1 ${areaLevel1Object.title}`)

    return (
      <MenuItem onTouchTap={this.areaLevel1Info.bind(this)}>More about {areaLevel1Object.title}</MenuItem>
    )
  }

  renderMapMenuItem() {
    const { page } = this.props
    if (page == 'map' || page == 'home') {
      return null /* TODO could return read only menu item with treatment */
    }

    // sole.log('we do have a map dude')

    return (
      <MenuItem onTouchTap={this.mapInfo.bind(this)}>Map</MenuItem>
    )
  }

  handleToggle() {
    this.props.toggleSideNav()
  }

  renderPaper() {
    return (
      <Paper zDepth={1} style={{position:'fixed', top: 64, left:0, right:0, height:44, zIndex: 1101, width:'inherit', fontSize:18, lineHeight:'44px', textAlign: 'center' }}>
        {this.getTitle()}
      </Paper>
    )
  }



  render() {
    console.log('render start ---------------------------------------------------------------------------------------------------')
    const { children } = this.props
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div>
      <LeftNav width={400} open={this.props.sideNav} zDepth={1} containerStyle={{zIndex: 1100}}>
        <AppBar title="GEOJUMP" showMenuIconButton={false} iconElementRight={<RaisedButton label="Jump" onTouchTap={this.randomCoordinates.bind(this)} primary={true} style={{marginTop:6, marginRight:6}} />}>
        </AppBar>
        {this.renderMapMenuItem()}
        {this.renderAreaLevel1MenuItem()}
        {this.renderCountryMenuItem()}
        </LeftNav>
        <MainSection sideNavWidth={400}>
          {children}
        </MainSection>
        </div>
      </MuiThemeProvider>

    )
  }
}

/*
<AppBar
  title="GEOJUMP"
  zDepth={1}
  style={{position:'fixed', top: 0, left:0, right:0, zIndex: 1102, width:'inherit'}}
  onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
  iconElementRight={<RaisedButton secondary={true} label="Random Coordinates" onTouchTap={this.randomCoordinates.bind(this)} style={{marginTop: 6, marginRight: 6}} />}
/>

<LeftNav width={408} containerStyle={{zIndex: 1100, marginTop:64}}>
  <MenuItem onTouchTap={this.randomCoordinates.bind(this)}>Get Random Coordinates</MenuItem>
</LeftNav>
*/

App.propTypes = {
  // Injected by React Redux
  randomCoordinates: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  currentLocation: PropTypes.string,
  currentLocationObject: PropTypes.object,
  countryObject: PropTypes.object,
  coordinates: PropTypes.object,
  // Injected by React Router
  children: PropTypes.node,
  appBarTitle: PropTypes.string,
  toggleSideNav: PropTypes.func.isRequired,
  appBarLeft: PropTypes.number,
  coordinatesString: PropTypes.string,
  coordinatesStringParam: PropTypes.string
}

function getPageFromPath(path){
  if (path.indexOf('countryInfo') > -1) {
    return 'country'
  }

  if (path.indexOf('coordinates') > -1) {
    return 'map'
  }

  return 'home'
}

function mapStateToProps(state, ownProps) {
  //const page = getPageFromPath(ownProps.location.pathname)

  return {
    coordinates: state.coordinates,
    inputValue: ownProps.location.pathname.substring(1),
    currentLocation: getCurrentLocation(state),
    currentLocationObject: getCurrentLocationObject(state),
    countryObject: getCountryObject(state),
    areaLevel1Object: getAreaLevel1Object(state),
    appBarTitle: state.appBarTitle,
    sideNav: state.sideNav,
    appBarLeft: state.sideNav? 256 : 0,
    coordinatesString: state.coordinatesString,
    page: getPageFromPath(ownProps.location.pathname),
    coordinatesStringParam: ownProps.params.coordinatesString,
    navToCoordinatesString: state.navToCoordinatesString
  }
}

export default connect(mapStateToProps, {
  randomCoordinates, toggleSideNav, loadCountry, loadAreaLevel1, loadLocation, loadWikiLocation, newCoordinatesString
})(App)
