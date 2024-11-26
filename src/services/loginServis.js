import { loginWithEmailAndPassword, registerWithEmailAndPassword, signInWithGoogle } from "../firebase/authentication.js";
import { updateProfile } from "firebase/auth"; 
const API_URL = process.env.REACT_APP_API_URL;

export const getUser = async (email) => {
  const response = await fetch(`${API_URL}/api/users/${email}`);
  const data = await response.json();
  return data;
};

export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await registerWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    
    const token = await user.getIdToken();
    const userInfo = {
      email: user.email,
      name: name,
      uid: user.uid,
      token: token
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    return user;
  } catch (error) {
    console.error("Error registering new user:", error);
    throw error;
  }
};

export const checkLogin = async (email, password) => {
  try {
    const user = await loginWithEmailAndPassword(email, password);
    if (user) {
      console.log("User logged in:", user);
      const token = await user.getIdToken();
      const userInfo = {
        email: user.email,
        name: user.displayName || email.split('@')[0],
        uid: user.uid,
        token: token
      };
      localStorage.setItem("user", JSON.stringify(userInfo));
      return user;
    }
    return null;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const user = await signInWithGoogle();
    if (user) {
      console.log("User logged in with Google:", user);
      const token = await user.getIdToken();
      const userInfo = {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        token: token,
        photoURL: user.photoURL
      };
      localStorage.setItem("user", JSON.stringify(userInfo));
      return user;
    }
    return null;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};


