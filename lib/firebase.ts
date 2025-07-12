import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCmXi47c9J-vhj_nWscpEjAgv407RZz-A",
  authDomain: "community-5c9bf.firebaseapp.com",
  projectId: "community-5c9bf",
  storageBucket: "community-5c9bf.appspot.com ",
  messagingSenderId: "881088395221",
  appId: "1:881088395221:web:1b7ecfdf29bab36e4c6f5c"
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const firebaseStorage = getStorage(app);