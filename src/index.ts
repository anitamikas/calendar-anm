import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWNR63gGDESKqv0fznj_EuLHDnIY0lTvw",
  authDomain: "calendar-anm.firebaseapp.com",
  projectId: "calendar-anm",
  storageBucket: "calendar-anm.appspot.com",
  messagingSenderId: "874504987900",
  appId: "1:874504987900:web:d7b00d90ae0f4a65eca379",
  measurementId: "G-9Z8NFW58R9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

async function getEvents(db) {
  const eventsCol = collection(db, "eventsCalendar");
  const eventsSnapshot = await getDocs(eventsCol);
  const eventsList = eventsSnapshot.docs.map((doc) => doc.data());
  return eventsList;
}

export { getEvents };
