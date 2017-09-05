// Initialize Firebase
var config = {
  apiKey: "AIzaSyCqBmBb_wf5kqabmHatj844pI4D3S_6O9s",
  authDomain: "fir-auth-755f9.firebaseapp.com",
  databaseURL: "https://fir-auth-755f9.firebaseio.com",
  projectId: "fir-auth-755f9",
  storageBucket: "fir-auth-755f9.appspot.com",
  messagingSenderId: "688777003307"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// FirebaseUI config.
var uiConfig = {
  signInSuccessUrl: 'https://deevine.github.io/firebase-auth-test/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

//writes new user data to database
function writeUserData(userId, name, email, imageUrl, phoneNumber) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl,
    phoneNumber: phoneNumber
  });
}

//add click event to push data to user's data node
function setupClickEvent(userId) {

	$("#form-submission").on("click", function(event) {
		// Prevent default behavior
		event.preventDefault();

		input1 = $("#input-1").val().trim();
		input2 = $("#input-2").val().trim();
		input3 = $("#input-3").val().trim();
		input4 = $("#input-4").val().trim();

		database.ref('users/' + userId + '/userData').push({
	    input1: input1,
	    input2: input2,
	    input3: input3,
	    input4: input4  
	  });
	});
}

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;

      database.ref('users/' + uid + '/userData').on("value", function(snapshot){
				console.log(snapshot.val());
			});

      //check if user exists, otherwise write in new user data
      database.ref('users/' + uid).once("value", function(snapshot){
				console.log(snapshot.val());
				if (snapshot.val()){
					console.log("data for user exists, do not write over user data")
				}
				else {
					//write user data to database if new user
      		writeUserData(uid, displayName, email, photoURL, phoneNumber);
      		console.log("no user data, adding new user");
				}
			});
      
      //add click event to button when person is logged in
      setupClickEvent(uid);

      user.getIdToken().then(function(accessToken) {
        document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        document.getElementById('account-details').textContent = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  ');
      });
      //add sign out function

      $('#sign-in').on("click", function(){
        event.preventDefault();
        console.log("testing sign out button");
        
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
        });
      });
    } else {
      // User is signed out.
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('account-details').textContent = 'null';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});