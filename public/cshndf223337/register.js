document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var firstName = document.getElementById('firstName').value;
    var middleName = document.getElementById('middleName').value;
    var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
 
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
     
    Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // Add user info to Firestore
            firebase.firestore().collection('users').doc(user.uid).set({
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                email: email
            })
            .then(() => {
                sessionStorage.setItem("current_user_cshndf223337", JSON.stringify(user));
                Swal.fire('Registration successful!');
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                Swal.fire('Error: ' + error.message);
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Swal.fire('Error: ' + errorMessage);
        });  
});
sessionStorage.removeItem("current_user_cshndf223337");