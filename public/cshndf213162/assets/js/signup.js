const firebaseConfig = {
    apiKey: "AIzaSyDQplDuiwgoOLJV8LEqHc9ZYi5KbfMmc9g",
    authDomain: "fedpoffacs.firebaseapp.com",
    projectId: "fedpoffacs",
    storageBucket: "fedpoffacs.appspot.com",
    messagingSenderId: "572139824346",
    appId: "1:572139824346:web:eb24dd16ac0cea086db1e3",
    measurementId: "G-XEM4TRP48W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function showLoading() { 
    Swal.fire({
        title: '', text: 'Processing....',
        imageUrl: 'assets/img/loading.gif', 
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false, 
        onOpen: () => {
            Swal.showLoading();
        }
    })
}
 
let signup_btn = document.getElementById("signup_btn");
signup_btn.addEventListener('click', function (e) {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    if(!name || !email || !password || !password2)
        alert("Pls fill in all the form fields");
    else if(password != password2)
        alert("Password do not match");
    else{  
        let user = {name: name, email: email, password: password };
        CheckForEmail(user); 
    }
});

async function CheckForEmail(postData) {
    showLoading(); 
    const db = firebase.firestore();
    const regCollectionRef = db.collection('projectHND23/cshndf213162/registration').doc(postData.email);
    try {
        const docSnapshot = await regCollectionRef.get(); 
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            if (data) {
                Swal.close();
                Swal.fire({
                    text: "Sorry, this email address has already been registered, please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }); 
                return;
            }
        }
    } catch (error) {
        console.error("Error checking key existence:", error);
        Swal.close();
        Swal.fire({
            text: "Sorry, There are error while validating the record, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        }); 
        return;
    } 
    firestorePost(postData);
}

function firestorePost(postData) {
    const db = firebase.firestore();
    const regCollectionRef = db.collection('projectHND23/cshndf213162/registration').doc(postData.email);
    // Use a batch to write the data to both the 'posts' collection and the user's post list
    const batch = db.batch();
    batch.set(regCollectionRef, postData);
    // Commit the batch
    batch.commit().then(() => {
        Swal.close();
        // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
        Swal.fire({
            text: "Congrats! Your registration is done successfully",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        }).then(function (result) {
            location.href = "login.html";
        });
    }).catch((error) => {
        // The write failed...
        console.error(error);
        Swal.close();
        // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
        Swal.fire({
            text: "Sorry, There are errors saving the record, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        }); 
    });
}

