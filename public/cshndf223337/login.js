document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var userObj = userCredential.user;
            sessionStorage.setItem("current_user_cshndf223337", JSON.stringify(userObj));
            alert('Login successful!');
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert('Error: ' + errorMessage);
        });
});
sessionStorage.removeItem("current_user_cshndf223337");