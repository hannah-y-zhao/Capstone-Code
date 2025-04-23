const firebaseConfig = {
    apiKey: "AIzaSyBxnbFt7f9OmHpJEJfAiySpq4HxPjH6V4Y",
    authDomain: "capstone-39f9c.firebaseapp.com",
    databaseURL: "https://capstone-39f9c-default-rtdb.firebaseio.com",
    projectId: "capstone-39f9c",
    storageBucket: "capstone-39f9c.appspot.com", // fixed typo here
    messagingSenderId: "341335661070",
    appId: "1:341335661070:web:1f06538094e9bfec117a5f",
    measurementId: "G-N6LC5FQGLC"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // Example function to write to Firebase
  function toFirebase(index,url,masterURL) {
    // console.log(url)
    if (masterURL){
        database.ref('database/database/'+index+'/masterURL').set(masterURL)
        .then(() => {
          console.log("Data saved!");
        })
        .catch((error) => {
          console.error("Error saving data: ", error);
        });
    }
    if(url){
        database.ref('database/database/'+index+'/urls').push(url)
        .then(() => {
          console.log("Data saved!");
        })
        .catch((error) => {
          console.error("Error saving data: ", error);
        });
    }
  }
//   toFirebase(0, "url", "masterURL")

 function getFirebase(callback){
    let current = firebase.database().ref('database');
    current.on('value', (snapshot) => {
    const data = snapshot.val();
    callback(data)
    });
  }