import React from 'react';
import {Text,View,TouchableOpacity,StyleSheet,TextInput,Picker, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import { Header , Avatar, Icon } from 'react-native-elements';
import db from '../config.js';
import firebase from 'firebase';
import * as ImagePicker from "expo-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { ScrollView } from 'react-native-gesture-handler';
//import {Picker} from 'react-native-community/picker'
export default class HomeScreen extends React.Component{

constructor(props){
    super(props);
    this.state = {
        firstTime:this.props.navigation.getParam('firstTime'),
        name:'',
        age:'',
        location:'',
        userId: firebase.auth().currentUser.email,
        image: "#",
        docId: "",
        textDisabled:true,
        isEditing:false,
        isDataDeleted:false,
        location:null,
        geocode:null,
        errorMessage:"",
        hobby:""
    }
}
handleHobbyChange = (hobby) => {
    this.setState({hobby:hobby});
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

deleteData = async()=>{
    //add a txn
    console.log("deleteData called "+this.state.isDataDeleted)
   
        db.collection("user_details").doc(this.state.docId).update({
            name : '',
            age : '',
            location: '',
            image:'#',
            hobby:'' 
        })
        this.setState({
            name : '',
            age : '',
            location: '',
            image:'#',
            hobby:'',geocode:''
        })
        Alert.alert("USER Deleted!!")
   
 
}
saveData = async()=>{
    //add a txn
    console.log("saveData called "+this.state.isEditing)
    console.log("saveData called "+this.state.docId)
    if(this.state.isEditing){
        db.collection("user_details").doc(this.state.docId).update({
            email:this.state.userId,
            name : this.state.name,
            age : this.state.age,
            location: this.state.geocode,
            image:this.state.image,
            hobby:this.state.hobby
        })
        
        Alert.alert("USER Updated!!")
    }
    else{
    db.collection("user_details").add({
        email:this.state.userId,
        name : this.state.name,
        age : this.state.age,
        location: this.state.geocode,
        image:this.state.image,
        hobby:this.state.hobby
    })
    
    Alert.alert("USER Added!!")
     
}
this.setState({
    textDisabled:false, isEditing:false
}) 
}
selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
      console.log(imageName)
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
        console.log(this.state.image)
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
     this.setState({
        textDisabled:false
    }) 
    db.collection("user_details")
      .where("email", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().name ,
            docId: doc.id,
            image: doc.data().image,
            age:doc.data().age,
            location:doc.data().location,
            hobby:doc.data().hobby
          });
        });
      });
  }

  componentDidMount() {
      if(!this.state.firstTime && !this.state.isDataDeleted){
    
        this.fetchImage(this.state.userId);
        this.getUserProfile();
        
      }
      else if(this.state.isEditing||this.state.firstTime){
        this.getLocationAsync()
      }
    
  }
render(){
    const {geocode } = this.state
    return(
        <View style={{flex:1}}>
            <Header
                    leftComponent={<Icon name='bars' type='font-awesome' color='#ffffff'  onPress={() => this.props.navigation.toggleDrawer()}/>}
                    backgroundColor={'teal'}
                    centerComponent={{
                        text: 'USER DETAILS APP',
                        style: { color: 'white', fontSize: 20 },
                    }}
                    />
         <ScrollView style={{flex:0.8}}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
           
            <View>
            <Text style={{textAlign:'center',fontSize:20,marginBottom:20}}>Enter User Details</Text>
            <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={"xlarge"}
            onPress={() => {
                if(this.state.isEditing||this.state.firstTime)
                this.selectPicture()
            }}
            showEditButton={this.state.textDisabled}
          />
                
                
            </View>
            
            <View style ={[styles.inputView,{marginTop:10}]}>
            <TextInput style={styles.inputBox}
                editable={this.state.textDisabled}
                placeholder = "Enter Name"
                onChangeText={text=>this.setState({name:text})}
                value={this.state.name}
            />
            
            </View>
            <View style ={styles.inputView}>
            <TextInput style={styles.inputBox}
                editable={this.state.textDisabled}
                placeholder = "Enter age"
                keyboardType={'number-pad'}
                onChangeText={text=>this.setState({age:text})}
                value={this.state.age}
            />
            </View>
            <View style ={styles.inputView}>
            {/* <TextInput style={styles.inputBox}
                editable={this.state.textDisabled}
                placeholder = "Enter Location"
                onChangeText={text=>this.setState({location:text})}
                value={this.state.location}
            /> */}
             <TextInput style={styles.inputBox1} multiline={true}
                        value ={geocode?geocode:" Location"}
                        editable = {false}
                        onChangeText={text=>this.setState({location:geocode})}
                        />
            </View>
            <Text style={styles.label}> Hobbies </Text>
            <Picker style={{height :50, width:150,marginBottom:16}}
                    itemStyle={styles.pickerStyle}
                    selectedValue={this.state.hobby}
                    onValueChange={this.handleHobbyChange}>
                    <Picker.Item label="Dance" value="dance" />
                    <Picker.Item label="Singing" value="singing" />
                    <Picker.Item label="Coding" value="coding" />
                    <Picker.Item label="Painting" value="painting" />
            </Picker>
            <View style = {styles.inputView}>
            <TouchableOpacity 
            style ={styles.submitButton}
            onPress = {()=>{
                this.setState({
                textDisabled:true, isEditing:true
            }),
            this.getLocationAsync()
        }}
            >
            <Text style ={styles.submitButtonText}>EDIT</Text>
                
            </TouchableOpacity>
            <TouchableOpacity 
            style ={styles.submitButton}
            onPress = {()=>{this.saveData()}}
            >
            <Text style ={styles.submitButtonText}>SAVE</Text>
                
            </TouchableOpacity>
            <TouchableOpacity 
            style ={styles.submitButton}
            onPress = {()=>{
                this.setState({
                    isDataDeleted:true
                })
                this.deleteData()}}
            >
            <Text style ={styles.submitButtonText}>DELETE</Text>
                
            </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        </ScrollView>
        </View>
    );
    }
}



const styles = StyleSheet.create({
    container: {
      flex: 0.7,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    },
    
    inputBox:{
        width: 300,
        height: 40,
        borderWidth: 1.5,
        fontSize: 20
      },
      inputBox1:{
        width: 300,
        height: 100,
        borderWidth: 1.5,
        fontSize: 20
      },
      scanButton:{
        backgroundColor: '#66BB6A',
        width: 50,
        borderWidth: 1.5,
        borderLeftWidth: 0
      },
      submitButton:{
        backgroundColor: '#FbC02D',
        width: 100,
        height: 50,
        marginTop:20
      },
      submitButtonText:{
        padding: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight:"bold",
        color:"white"
      },
      pickerStyle: {
        ...Platform.select({
          ios:{
            height: 120
          }
        })
      },
      label: {
        fontSize: RFValue(18),
        color: "#717D7E",
        fontWeight: "bold",
        margin: RFValue(10),
        marginLeft: RFValue(50),
        alignSelf:"flex-start"
      },
      heading1:{
        color:"#fff",
        fontWeight:"bold",
        fontSize:30,
        margin:20
      },
      inputView:{
        flexDirection:'row',
        marginTop:40
    },
  });