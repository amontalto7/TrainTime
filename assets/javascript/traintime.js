// Initialize Firebase
var config = {
  apiKey: "AIzaSyAI43oKw7QcPXCiqmKnKRIeceWaqD94qsY",
  authDomain: "traintime-cda5b.firebaseapp.com",
  databaseURL: "https://traintime-cda5b.firebaseio.com",
  projectId: "traintime-cda5b",
  storageBucket: "traintime-cda5b.appspot.com",
  messagingSenderId: "827108550992"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
const database = firebase.database();

// google client id: 827108550992-ubcto1rqv5hjigafktd7pccr078ev6bk.apps.googleusercontent.com
// google client secret: S0QlDBvhyr2jlCRU9YkFqF2S
// function onSignIn(googleUser) {
//   // Useful data for your client-side scripts:
//   var profile = googleUser.getBasicProfile();
//   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
//   console.log('Full Name: ' + profile.getName());
//   console.log('Given Name: ' + profile.getGivenName());
//   console.log('Family Name: ' + profile.getFamilyName());
//   console.log("Image URL: " + profile.getImageUrl());
//   console.log("Email: " + profile.getEmail());

//   // The ID token you need to pass to your backend:
//   var id_token = googleUser.getAuthResponse().id_token;
//   console.log("ID Token: " + id_token);
// };

$(document).ready(function() {
  // // google Authentication
  // var provider = new firebase.auth.GoogleAuthProvider();

  // firebase.auth().signInWithPopup(provider).then(function(result) {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   var token = result.credential.accessToken;
  //   console.log(token);
  //   // The signed-in user info.
  //   var user = result.user;
  //   console.log(user);
  //   // ...
  // }).catch(function(error) {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   // The email of the user's account used.
  //   var email = error.email;
  //   // The firebase.auth.AuthCredential type that was used.
  //   var credential = error.credential;
  //   // ...
  // });

  // click event for submit button
  $("#submit").on("click", function() {
    event.preventDefault();

    var form = document.getElementById("addTrainForm");
    var tName = $("#trainName")
      .val()
      .trim();
    var dest = $("#destination")
      .val()
      .trim();
    var firstTrain = $("#firstTrainTime")
      .val()
      .trim();
    var freq = $("#frequency")
      .val()
      .trim();

    if (tName) {
      database.ref("/trainData").push({
        trainName: tName,
        destination: dest,
        firstTrain: firstTrain,
        frequency: freq
      });
    }
    // reset form
    form.reset();
  });

  database
    .ref("/trainData")
    .orderByChild("trainName")
    .on("child_added", function(snapshot) {
      var cs = snapshot.val();
      // console.log(cs);

      var firstTime = cs.firstTrain;
      var frequency = cs.frequency;

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

      var currentTime = moment();
      // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      // console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % frequency;
      // console.log(tRemainder);

      // Minutes Until next train
      var tMinutesTillTrain = frequency - tRemainder;
      // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      var deleteIcon = $("<img>").attr("src", "assets/images/del.png");
      deleteIcon.addClass("del");
      deleteIcon.attr("data-trainName", cs.trainName);

      var newRow = $("<tr>").append(
        $("<td>").text(cs.trainName),
        $("<td>").text(cs.destination),
        $("<td>").text(cs.frequency),
        $("<td>").text(nextTrain.format("LT")),
        $("<td>").text(tMinutesTillTrain),
        $("<td>").append(deleteIcon)
      );

      // apend new row to the table
      $("#trainTable > tbody").append(newRow);
    });

  $(document).on("click", ".del", function() {
    //1) get reference to data in current row.
    var trainName = $(this).attr("data-trainName");
    console.log(trainName);
    var rowRef = firebase
      .database()
      .ref("/trainData")
      .child("trainName")
      .equalTo(trainName);
    console.log(rowRef);
    // database.child(rowRef).remove();
    database.remove(rowRef);
  });
});

//attempting to get google sign-in to work
function login() {
  function newLoginHappened(user) {
    if (user) {
      // User is signed in
      app(user);
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  }

  firebase.auth().onAuthStateChanged(newLoginHappened);
}

function app(user) {
  // console.log(user);
  // user.displayName
  // user.email
  // user.photoURL
  // user.uid
  $("#clientName").html(user.displayName + "!");
  // $("#clientName").text("there!");
}

function signOut() {
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
}

window.onload = login;
