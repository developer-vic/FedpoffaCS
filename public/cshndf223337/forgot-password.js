document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        var email = document.getElementById('email').value;
        
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            alert('Password reset email sent! Check your inbox.');
            window.location.href = 'login.html';
        }).catch(function(error) {
            console.error('Error sending password reset email: ', error);
            alert('Error sending password reset email: ' + error.message);
        });
    });
});
