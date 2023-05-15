import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC8DYbVhy3BmI--2-MgPoBYs1dG5JAuf_Y",
  authDomain: "chatapp-edaf0.firebaseapp.com",
  projectId: "chatapp-edaf0",
  storageBucket: "chatapp-edaf0.appspot.com",
  messagingSenderId: "900713296290",
  appId: "1:900713296290:web:3d332a8a39005a568742fb",
  measurementId: "G-XH21R5KEES"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
