document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) { // Update email
            document.getElementById('updateEmailForm').addEventListener('submit', function(event) {
                event.preventDefault();
                
                var newEmail = document.getElementById('newEmail').value;
                
                user.updateEmail(newEmail).then(function() {
                    alert('Email successfully updated!');
                }).catch(function(error) {
                    console.error('Error updating email: ', error);
                    alert('Error updating email: ' + error.message);
                });
            });
        
            // Update password
            document.getElementById('updatePasswordForm').addEventListener('submit', function(event) {
                event.preventDefault();
                
                var newPassword = document.getElementById('newPassword').value;
                
                user.updatePassword(newPassword).then(function() {
                    alert('Password successfully updated!');
                }).catch(function(error) {
                    console.error('Error updating password: ', error);
                    alert('Error updating password: ' + error.message);
                });
            });
        
            document.getElementById('logout').addEventListener('click', function() {
                firebase.auth().signOut().then(() => {
                    // Sign-out successful
                    window.location.href = 'index.html';
                }).catch((error) => {
                    // An error happened
                    console.log('Error signing out:', error);
                });
            });
        } else {
            // No user is signed in, redirect to login page
            window.location.href = 'login.html';
        }
      });
});
