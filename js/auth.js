import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, 
    createUserWithEmailAndPassword, 
    signOut, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnCt6lyaFvXFt_Cy0x7bn7uqJgC3DPhpY",
  authDomain: "mealplanner-84727.firebaseapp.com",
  projectId: "mealplanner-84727",
  storageBucket: "mealplanner-84727.appspot.com",
  messagingSenderId: "658872106757",
  appId: "1:658872106757:web:386b2caa65d37e086b016c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to show a notification
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body: body,
    });

    notification.onclick = () => {
      // Handle click event
      console.log("Notification clicked");
    };
    console.log('Notification shown: ${title}');
  }
}

// Sign up
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log(user);

      // Show a notification upon successful sign-up
      showNotification("Sign Up Successful", `Welcome, ${user.email}!`);

      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

// Logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth).then(() => {
    // Show a notification upon successful logout
    showNotification("Logged Out", "You have been successfully logged out.");

    console.log("Signed out");
  })
  .catch((error) => {
    // Error handler
  });
});

// Login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);

      // Show a notification upon successful login
      showNotification("Login Successful", `Welcome back, ${user.email}!`);

      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //...
    });
});
