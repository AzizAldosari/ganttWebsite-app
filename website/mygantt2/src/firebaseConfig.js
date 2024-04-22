import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB1p63UH_2XVyo712TZuGi3tvAegWZHc4c',
  authDomain: 'mygannt1.firebaseapp.com',
  databaseURL: 'https://mygannt1-default-rtdb.firebaseio.com',
  projectId: 'mygannt1',
  storageBucket: 'mygannt1.appspot.com',
  messagingSenderId: '327454353851',
  appId: '1:327454353851:web:c0b3cec76332c5236cfc9e',
  measurementId: 'G-PTZPDSLN6F',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export {app, auth, firestore, analytics};
