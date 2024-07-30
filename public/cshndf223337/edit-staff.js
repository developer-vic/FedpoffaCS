document.addEventListener('DOMContentLoaded', function() {
    var user = null;
    const userMraw = sessionStorage.getItem("current_user_cshndf223337");
    if(userMraw) user = JSON.parse(userMraw);
    if (user) {
        // Get staff ID from URL
        var urlParams = new URLSearchParams(window.location.search);
        var staffId = urlParams.get('id');
        
        // Fetch staff details from Firestore
        firebase.firestore().collection('staff').doc(staffId).get().then(function(doc) {
            if (doc.exists) {
                var staff = doc.data();
                document.getElementById('fullName').value = staff.name;
                document.getElementById('position').value = staff.position;
                document.getElementById('promotionStatus').value = staff.promotionStatus;
            } else {
                console.log('No such document!');
            }
        }).catch(function(error) {
            console.log('Error getting document:', error);
        });

        // Update staff details
        document.getElementById('editStaffForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            var fullName = document.getElementById('fullName').value;
            var position = document.getElementById('position').value;
            var promotionStatus = document.getElementById('promotionStatus').value;
            
            firebase.firestore().collection('staff').doc(staffId).update({
                name: fullName,
                position: position,
                promotionStatus: promotionStatus
            }).then(function() {
                alert('Staff successfully updated!');
                window.location.href = 'staff-list.html';
            }).catch(function(error) {
                console.error('Error updating staff: ', error);
            });
        });
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }

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
