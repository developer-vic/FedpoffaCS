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
        
        // Fetch promotions list
        firebase.firestore().collection('promotions').get().then(function(querySnapshot) {
            var promotionList = document.getElementById('promotionList');
            querySnapshot.forEach(function(doc) {
                var promotion = doc.data();
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${promotion.staffName}</td>
                    <td>${promotion.currentPosition}</td>
                    <td>${promotion.newPosition}</td>
                    <td>${promotion.promotionDate.toDate().toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editPromotion('${doc.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deletePromotion('${doc.id}')">Delete</button>
                    </td>
                `;
                promotionList.appendChild(row);
            });
        }).catch(function(error) {
            console.log('Error getting documents:', error);
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

function editPromotion(promotionId) {
    // Redirect to edit promotion page with promotionId
    window.location.href = `edit-promotion.html?id=${promotionId}`;
}

function deletePromotion(promotionId) {
    // Delete promotion from Firestore
    if (confirm('Are you sure you want to delete this promotion?')) {
        firebase.firestore().collection('promotions').doc(promotionId).delete().then(() => {
            alert('Promotion successfully deleted!');
            location.reload(); // Refresh the page to update the promotions list
        }).catch((error) => {
            console.error('Error removing document: ', error);
        });
    }
}
