import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

var app = firebase.initializeApp({
  apiKey: "AIzaSyDmtgh-N7EIS0ggW-Aq36Tp_FkLkFXMTfQ",
  authDomain: "catch-of-the-day-393cd.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-393cd.firebaseio.com",
  projectId: "catch-of-the-day-393cd",
  storageBucket: "catch-of-the-day-393cd.appspot.com",
  messagingSenderId: "320186571359"
});

var db = firebase.database(app);
var base = Rebase.createClass(db);

export {app, base};