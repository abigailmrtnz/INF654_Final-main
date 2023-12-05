// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { 
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnCt6lyaFvXFt_Cy0x7bn7uqJgC3DPhpY",
  authDomain: "mealplanner-84727.firebaseapp.com",
  projectId: "mealplanner-84727",
  storageBucket: "mealplanner-84727.appspot.com",
  messagingSenderId: "658872106757",
  appId: "1:658872106757:web:386b2caa65d37e086b016c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getMeals(db) {
  const mealsCol = collection(db, "meals");
  const mealSnapshot = await getDocs(mealsCol);
  const mealList = mealSnapshot.docs.map((doc) => doc);
  return mealList;
}

//lets you see data offline from cache, 
//can still navigate through the application
enableIndexedDbPersistence(db)
  .catch ((err) => {
    if (err.code == 'failed-precondition') {
      console.log("Persistence failed");
    } else if (err.code == 'unimplemented') {
      console.log("Persistence is not valid");
    }
  });

const unsub = onSnapshot(collection(db, "meals"), (doc) => {
  doc.docChanges().forEach((change) => {
    if(change.type === "added"){
      // call render function in UI
      renderMeal(change.doc.data(), change.doc.id);

      // show notification for added meal
      showNotification("New Meal Added", "A new meal has been added!", "/path/to/icon.png");
    }
    if(change.type === "removed"){
      // do something
      removeMeal(change.doc.id);

      // show notification for removed meal
      showNotification("Meal Removed", "A meal has been removed.", "/path/to/icon.png");
    }
  });
});

// add new meal
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  addDoc(collection(db, "meals"), {
    title: form.title.value,
    description: form.description.value
  }).catch((error) => console.log(error));
  form.title.value = "";
  form.description.value = "";
});

// delete a meal
const mealContainer = document.querySelector(".meals");
mealContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "I") {
    const id = event.target.getAttribute("data-id");
    deleteDoc(doc(db, "meals", id));
  }
});

// listen for auth status changes
onAuthStateChanged(auth, (user) => {
  if(user) {
    console.log("Logged in: ", user.email);
    getMeals(db).then((snapshot) => {
      setupMeals(snapshot);
    });
    setupUI(user);
    const form = document.querySelector("form");
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      addDoc(collection(db, "meals"), {
        title: form.title.value,
        description: form.description.value,
      }).catch((error) => console.log(error));
      form.title.value = "";
      form.description.value = "";
    });
  } else {
    console.log("Logged out");
    setupUI();
    setupMeals([]);
  }
});
