document.addEventListener('DOMContentLoaded', function() {
    var user = null;
    const userMraw = sessionStorage.getItem("current_user_cshndf223337");
    if(userMraw) user = JSON.parse(userMraw);
    if (user) {
        // Get promotion ID from URL
        var urlParams = new URLSearchParams(window.location.search);
        var promotionId = urlParams.get('id');
        
        // Fetch promotion details from Firestore
        firebase.firestore().collection('promotions').doc(promotionId).get().then(function(doc) {
            if (doc.exists) {
                var promotion = doc.data();
                document.getElementById('staffName').value = promotion.staffName;
                document.getElementById('currentPosition').value = promotion.currentPosition;
                document.getElementById('newPosition').value = promotion.newPosition;
                document.getElementById('promotionDate').value = promotion.promotionDate.toDate().toISOString().split('T')[0];
            } else {
                console.log('No such document!');
            }
        }).catch(function(error) {
            console.log('Error getting document:', error);
        });

        // Update promotion details
        document.getElementById('editPromotionForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            var staffName = document.getElementById('staffName').value;
            var currentPosition = document.getElementById('currentPosition').value;
            var newPosition = document.getElementById('newPosition').value;
            var promotionDate = document.getElementById('promotionDate').value;
            
            firebase.firestore().collection('promotions').doc(promotionId).update({
                staffName: staffName,
                currentPosition: currentPosition,
                newPosition: newPosition,
                promotionDate: firebase.firestore.Timestamp.fromDate(new Date(promotionDate))
            }).then(function() {
                alert('Promotion successfully updated!');
                window.location.href = 'promotions.html';
            }).catch(function(error) {
                console.error('Error updating promotion: ', error);
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
