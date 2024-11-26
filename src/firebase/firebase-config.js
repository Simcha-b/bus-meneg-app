import { initializeApp } from "firebase/app";
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;


const firebaseConfig = {
  apiKey: `${apiKey}`,
  authDomain: "bus-management-1c3d2.firebaseapp.com",
  projectId: "bus-management-1c3d2",
  storageBucket: "bus-management-1c3d2.appspot.com",
  messagingSenderId: "671035929507",
  appId: "1:671035929507:web:abbd3b3d57c693c912a016",
};

const app = initializeApp(firebaseConfig, {
  popupRedirectResolver: undefined
});
export default app;