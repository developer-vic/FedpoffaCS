document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var fullName = document.getElementById('fullName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // Add user info to Firestore
            firebase.firestore().collection('users').doc(user.uid).set({
                fullName: fullName,
                email: email
            })
            .then(() => {
                sessionStorage.setItem("current_user_cshndf223337", JSON.stringify(user));
                alert('Registration successful!');
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                alert('Error: ' + error.message);
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert('Error: ' + errorMessage);
        });
});
sessionStorage.removeItem("current_user_cshndf223337");