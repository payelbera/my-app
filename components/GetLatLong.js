import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { TextInput } from 'react-native-gesture-handler';

export default class GetLatLong extends React.Component {
  state= {
    location:null,
    geocode:null,
    errorMessage:""
  }
  componentDidMount(){
    this.getLocationAsync()
  }
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation});
    const { latitude , longitude } = location.coords
    this.getGeocodeAsync({latitude, longitude})
    this.setState({ location: {latitude, longitude}});

  };
  getGeocodeAsync= async (location) => {
    //let geocode = await Location.reverseGeocodeAsync(location)
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + location.latitude + ',' + location.longitude + '&key=' + 'AIzaSyBBE6i-urkZ3Rnv19UaKdjlICleQzc0fnM')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({geocode:responseJson.results[0].formatted_address})
            console.log('ADDRESS GEOCODE is BACK!! => ' + responseJson.results[0].formatted_address);
})
 
  }
  render(){
    const {location,geocode, errorMessage } = this.state
    return (
         <TextInput style={styles.heading1} value ={geocode  ? `${geocode}` :""}/>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
 
  heading1:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:30,
    margin:20
  },
  heading2:{
    color:"#fff",
    margin:5,
    fontWeight:"bold",
    fontSize:15
  },
  heading3:{
    color:"#fff",
    margin:5
  }
});
