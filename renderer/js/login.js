const signupButton = document.getElementById("sign-up");
const main = document.getElementById("main");
const loginErrorMsg = document.getElementById("login-error-msg");
const returnBtn = document.getElementById("return-btn");
const createacct = document.getElementById("create-acct");

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCHXMsl2E5RxsjCd0MVbrB6y1sm6Pbq1kM",
authDomain: "login-signup-form-dd8bc.firebaseapp.com",
databaseURL: "https://login-signup-form-dd8bc-default-rtdb.firebaseio.com",
projectId: "login-signup-form-dd8bc",
storageBucket: "login-signup-form-dd8bc.appspot.com",
messagingSenderId: "64764875506",
appId: "1:64764875506:web:3eb18caf394a093139b66b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()

// Set up our register function
function register () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  full_name = document.getElementById('full_name').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    Toastify.toast({text: 'Input this field.'});
    return
    // Don't continue running the code
  }
  if (validate_field(full_name) == false) {
    Toastify.toast({text: 'One or More Extra Fields.'});
    return
  }
 
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser
    window.location="login.html"
    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email,
      full_name : full_name
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // DOne
    Toastify.toast({text: 'User Created!!.'});
    return

  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var text = text
    Toastify.toast({text: 'Email has already exist.'});
    return
  })
}

// Set up our login function
function login() {
  // Get all our input fields
  email = document.getElementById('email1').value;
  password = document.getElementById('password1').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    Toastify.toast({text: 'Input this field.'});
    return;
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser
    window.location="index.html"

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

    // DOne
    Toastify.toast({text: 'Successfully login.'});
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var text = text

    Toastify.toast({text: 'Wrong email or password.'});
    return
  })
}




// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}

signupButton.addEventListener("click", function() {
  main.style.display = "none";
  createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
  main.style.display = "block";
  createacct.style.display = "none";
});
