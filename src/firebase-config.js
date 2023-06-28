// Your web app's Firebase configuration

import { initializeApp } from "firebase/app";


import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBUA892z5dlboJT3NZTMQlryfxVJam0Vwk",
  authDomain: "signature-pad-2150d.firebaseapp.com",
  projectId: "signature-pad-2150d",
  storageBucket: "signature-pad-2150d.appspot.com",
  messagingSenderId: "345627099680",
  appId: "1:345627099680:web:032f4eeb237facfc7f7245",
  measurementId: "G-TM29ZXC536"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
