document.addEventListener('DOMContentLoaded', function() {
    var user = null;
    const userMraw = sessionStorage.getItem("current_user_cshndf223337");
    if(userMraw) user = JSON.parse(userMraw);
    if (user) {
        // User is signed in, get user details from Firestore
        firebase.firestore().collection('users').doc(user.uid).get().then(function(doc) {
            if (doc.exists) {
                var userData = doc.data();
                // Display user-specific information if needed
            } else {
                console.log('No such document!');
            }
        }).catch(function(error) {
            console.log('Error getting document:', error);
        });
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }

    document.getElementById('addPromotionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        var staffName = document.getElementById('staffName').value;
        var currentPosition = document.getElementById('currentPosition').value;
        var newPosition = document.getElementById('newPosition').value;
        var promotionDate = document.getElementById('promotionDate').value;
        
        firebase.firestore().collection('promotions').add({
            staffName: staffName,
            currentPosition: currentPosition,
            newPosition: newPosition,
            promotionDate: firebase.firestore.Timestamp.fromDate(new Date(promotionDate))
        }).then(function() {
            alert('Promotion successfully added!');
            window.location.href = 'promotions.html';
        }).catch(function(error) {
            console.error('Error adding promotion: ', error);
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
});
