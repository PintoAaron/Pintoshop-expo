import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyBLwB4ZAVhLAuVLb9g4Z_6-qNNAa190RCE",
  authDomain: "errandgo-7d463.firebaseapp.com",
  projectId: "errandgo-7d463",
  storageBucket: "errandgo-7d463.appspot.com",
  messagingSenderId: "581912090372",
  appId: "1:581912090372:web:9b0a4586d55613b5c0a251"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage};