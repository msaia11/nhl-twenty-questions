// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6qQcZcz8J-F4hqWGvJRf7nV3AwEFIvxw",
  authDomain: "chel-guesser.firebaseapp.com",
  projectId: "chel-guesser",
  storageBucket: "chel-guesser.appspot.com",
  messagingSenderId: "280997115403",
  appId: "1:280997115403:web:ac01b758c800689aa4b90e",
  measurementId: "G-4YFSV02TE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

export default db;