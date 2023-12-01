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

let login_btn = document.getElementById("login_btn");
login_btn.addEventListener('click', function (e) {
    e.preventDefault(); 
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value; 
    if(!email || !password)
        alert("Pls fill in all the form fields"); 
    else
        CheckForLogin(email, password);  
});
 
async function CheckForLogin(email, password) { 
    showLoading(); 
    const db = firebase.firestore();
    const regCollectionRef = db.collection('projectHND23/cshndf213108/registration').doc(email);
    try {
        const docSnapshot = await regCollectionRef.get();
        if (!docSnapshot.exists || !docSnapshot.data()) {
            Swal.close();
            Swal.fire({
                text: "Sorry, this email address has not been registered, please try again.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            }); 
        } else {
            var userObj = docSnapshot.data();  
            if (userObj.password != password) {
                Swal.close();
                Swal.fire({
                    text: "Incorrect Password, please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            } else { 
                Swal.close();
                Swal.fire({
                    text: "You have successfully logged in!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }).then(function (result) { 
                    sessionStorage.setItem("current_user_cshndf213108", JSON.stringify(userObj));
                    location.href = "index.html";
                });
            } 
        }
    } catch (error) {
        console.error("Error checking key existence:", error);
        Swal.close();
        Swal.fire({
            text: "Sorry, There are error while validating the login, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });  
    }  
}
