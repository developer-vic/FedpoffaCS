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

let fpassword = document.getElementById("fpassword");
if (fpassword)
    fpassword.addEventListener('click', function (e) {
        e.preventDefault();
        let email = document.getElementById("email").value;
        if (!email)
            alert("Pls fill in your email address");
        else {
            CheckForEmail(email);
        }
    });

async function CheckForEmail(email) {
    showLoading();
    const db = firebase.firestore();
    const regCollectionRef = db.collection('projectHND23/cshndf213108/registration').doc(email);
    try {
        const docSnapshot = await regCollectionRef.get();
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            if (data) {
                Swal.close();
                sessionStorage.setItem("reset_email_cshndf213108", email);
                location.href = "reset-password.html";
                // Hide loading indication
                return;
            }
        }
    } catch (error) {
        console.error("Error checking key existence:", error);
        Swal.fire({
            text: "Sorry, There are error while validating the record, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
        // Hide loading indication
        Swal.close();
        return;
    }
    Swal.fire({
        text: "Email is not registered, please try again.",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        customClass: {
            confirmButton: "btn btn-primary"
        }
    });
}


let rpassword = document.getElementById("rpassword");
if (rpassword) {
    let userEmail = sessionStorage.getItem("reset_email_cshndf213108");
    if (!userEmail) location.href = "forgot-password.html";
    rpassword.addEventListener('click', async function (e) {
        e.preventDefault();
        let password = document.getElementById("password-field").value;
        let password2 = document.getElementById("confirm-password").value;
        if (!password || !password2)
            alert("Pls fill in all the password");
        else if (password != password2)
            alert("Password do not match");
        else { 
            showLoading();
            const db = firebase.firestore();
            const regCollectionRef = db.collection('projectHND23/cshndf213108/registration').doc(userEmail);
            try {
                const docSnapshot = await regCollectionRef.get();
                if (docSnapshot.exists) {
                    const data = docSnapshot.data();
                    if (data) {
                        data.password = password;
                        const batch = db.batch();
                        batch.set(regCollectionRef, data);
                        // Commit the batch
                        batch.commit().then(() => {
                            Swal.close();
                            Swal.fire({
                                text: "You have successfully reset your password!",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                location.href = "login.html";
                            });
                            sessionStorage.removeItem("reset_email_cshndf213108");  
                            sessionStorage.removeItem("current_user_cshndf213108");
                        }).catch((error) => {
                            // The write failed...
                            console.error(error); Swal.close();
                            // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                            Swal.fire({
                                text: "Sorry, There are errors resetting the password, please try again.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        });
                    }
                }
            } catch (error) {
                console.error("Error checking key existence:", error);
                //location.href = "reset-password.html";
            }
        }
    });
}
