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

$(document).ready(function() {
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
});
