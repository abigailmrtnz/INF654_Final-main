// Set up materialize components
document.addEventListener("DOMContentLoaded", function(){
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

const meals = document.querySelector(".meals");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

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
  }
}

const setupUI = (user) => {
  if(user) {
    //toggle UI elements
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
    loggedInLinks.forEach((item) => (item.style.display = "block"));
  } else {
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
    loggedInLinks.forEach((item) => (item.style.display = "none"));
  }
};

document.addEventListener("DOMContentLoaded", function () {
  //Nav Menu
  const menus = document.querySelectorAll(".side-menu");
  M.Sidenav.init(menus, { edge: "right" });
  // Add Meals
  const forms = document.querySelectorAll(".side-form");
  M.Sidenav.init(forms, { edge: "left" });
});

//populate data when the user is signed in
const setupMeals = (data) => {
  let html = "";
  data.forEach((doc) => {
    const meal = doc.data();
    const li = `
    <div class="card-panel meal white row" data-id ="${meal.id}">
    <img src="/img/task.png" class="responsive-img materialboxed" alt="">
    <div class="meal-detail">
      <div class="meal-title">${meal.title}</div>
      <div class="meal-description">${meal.description}</div>
    </div>
    <div class="meal-delete">
      <i class="material-icons" data-id="${meal.id}">delete_outline</i>
    </div>
    </div>
    `;
    html += li;
  });

  // Show a notification upon successful data retrieval
  showNotification("Meals Loaded", "Your meal data has been loaded successfully.");

  meals.innerHTML = html;
};

const renderMeal =(data, id) => {
  const html = `
  <div class="card-panel meal white row" data-id ="${id}">
    <img src="/img/task.png" class="responsive-img materialboxed" alt="">
    <div class="meal-detail">
      <div class="meal-title">${data.title}</div>
      <div class="meal-description">${data.description}</div>
    </div>
    <div class="meal-delete">
      <i class="material-icons" data-id ="${id}">delete_outline</i>
    </div>
    </div>
  `;
  meals.innerHTML += html;
};

//remove meals from DOM
const removeMeal = (id) => {
  const meal = document.querySelector(`.meal[data-id = '${id}']`);
  meal.remove();
};
