import firebase from 'firebase';
require('@firebase/firestore')

 var firebaseConfig = {
    apiKey: "AIzaSyAJtie-odQfkFSPXQmloubJp2OlK1mWfIM",
    authDomain: "mentorapp-b2720.firebaseapp.com",
    databaseURL: "https://mentorapp-b2720.firebaseio.com",
    projectId: "mentorapp-b2720",
    storageBucket: "mentorapp-b2720.appspot.com",
    messagingSenderId: "599650068710",
    appId: "1:599650068710:web:b1914bc4abab1ea0d0f327"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
