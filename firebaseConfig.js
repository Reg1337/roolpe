const firebase = require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyCFTfVmkygMrQ_WN9t-xp9jBtBy_l2--FA",
    authDomain: "roolpe.firebaseapp.com",
    projectId: "roolpe",
    storageBucket: "roolpe.appspot.com",
    messagingSenderId: "92480964877",
    appId: "1:92480964877:web:a4864666b26c0e68ae4844"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = {
    db: firebase.firestore(),
};