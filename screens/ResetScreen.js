import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";

import { Header } from 'react-native-elements';
import db from "../config";
import firebase from "firebase";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class ResetScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
      
    };
  }

  

  userResetPassword = (emailId, oldpassword, newpassword, confirmnewPassword) => {
    firebase.auth().signInWithEmailAndPassword(emailId, oldpassword)
    .then(() => {
        if (newpassword !== confirmnewPassword) {
            return Alert.alert("new password and confirm password doesn't match\nCheck your password.");
          } else {
            var user = firebase.auth().currentUser;
            console.log(user)
            user.updatePassword(newpassword)
              .then(() => {
                
                return Alert.alert("Password Changed Successfully", "", [
                  {
                    text: "OK",
                    onPress: () => {
                        this.props.navigation.navigate("HomeScreen",{firstTime:false});
                        
                      }
                  }
                ]);
              })
              .catch(error => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                return Alert.alert(errorMessage);
              });
          }
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return Alert.alert(errorMessage);
    });
    
  };

  
  render() {
      
    return (
      <View style={styles.container}>
          <View style={{flex:1}}>
            <Header
              backgroundColor={'teal'}
              centerComponent={{
                  text: 'USER DETAILS APP',
                  style: { color: 'white', fontSize: 20 },
              }}
              />
        <ScrollView style={styles.scrollview}>
          <View style={styles.signupView}>
            <Text style={styles.signupText}> RESET PASSWORD </Text>
          </View>
          <View style={{ flex: 0.95 }}>
            
            <Text style={styles.label}>Email </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Email"}
              keyboardType={"email-address"}
              onChangeText={text => {
                this.setState({
                  emailId: text
                });
              }}
            />
            <Text style={styles.label}> Current Password </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Current Password"}
              secureTextEntry={true}
              onChangeText={text => {
                this.setState({
                    oldPassword: text
                });
              }}
            />
            <Text style={styles.label}> New Password </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"New Password"}
              secureTextEntry={true}
              onChangeText={text => {
                this.setState({
                  password: text
                });
              }}
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Confrim New Password"}
              secureTextEntry={true}
              onChangeText={text => {
                this.setState({
                  confirmPassword: text
                });
              }}
            />
          </View>

          <View style={{ flex: 0.2, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                this.userResetPassword(
                  this.state.emailId,
                  this.state.oldPassword,
                  this.state.password,
                  this.state.confirmPassword
                )
              }
            >
              <Text style={styles.registerButtonText}>Change Password</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isResetPasswordModalVisible: false });
              }}
            >
              Cancel
            </Text>
          </View>
        </ScrollView>
        </View>
      </View>
    );
   
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6fc0b8"
  },
  loginBox: {
    width: "80%",
    height: RFValue(50),
    borderWidth: 1.5,
    borderColor: "#ffffff",
    fontSize: RFValue(20),
    paddingLeft: RFValue(10)
  },
  button: {
    width: "80%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
    backgroundColor: "#ffff",
    shadowColor: "#000",
    marginBottom: RFValue(10),
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16
  },
  buttonText: {
    color: "#32867d",
    fontWeight: "200",
    fontSize: RFValue(20)
  },
  label: {
    fontSize: RFValue(13),
    color: "#717D7E",
    fontWeight: "bold",
    paddingLeft: RFValue(10),
    marginLeft: RFValue(20)
  },
  formInput: {
    width: "90%",
    height: RFValue(45),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "grey",
    paddingBottom: RFValue(10),
    marginLeft: RFValue(20),
    marginBottom: RFValue(14)
  },
  registerButton: {
    width: "75%",
    height: RFValue(50),
    marginTop: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(3),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(10)
  },
  registerButtonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff"
  },
  cancelButtonText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#32867d",
    marginTop: RFValue(10)
  },
  scrollview: {
    flex: 1,
    backgroundColor: "#fff"
  },
  signupView: {
    flex: 0.05,
    justifyContent: "center",
    alignItems: "center"
  },
  signupText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#32867d"
  },
  imageView: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  styleImage: {
    width: "70%",
    height: "100%",
    resizeMode: "stretch"
  },
  TextInput: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },
  bookImage: {
    width: "100%",
    height: RFValue(220)
  },
  goButton: {
    width: '50%',
    height: 55,
    alignSelf: 'center',
    padding: 10,
    margin: 10,
  },
});
