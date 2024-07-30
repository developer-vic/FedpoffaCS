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
        
        // Fetch staff list
        firebase.firestore().collection('staff').get().then(function(querySnapshot) {
            var staffList = document.getElementById('staffList');
            querySnapshot.forEach(function(doc) {
                var staff = doc.data();
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${staff.name}</td>
                    <td>${staff.position}</td>
                    <td>${staff.promotionStatus}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editStaff('${doc.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteStaff('${doc.id}')">Delete</button>
                    </td>
                `;
                staffList.appendChild(row);
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

function editStaff(staffId) {
    // Redirect to edit staff page with staffId
    window.location.href = `edit-staff.html?id=${staffId}`;
}

function deleteStaff(staffId) {
    // Delete staff from Firestore
    if (confirm('Are you sure you want to delete this staff?')) {
        firebase.firestore().collection('staff').doc(staffId).delete().then(() => {
            alert('Staff successfully deleted!');
            location.reload(); // Refresh the page to update the staff list
        }).catch((error) => {
            console.error('Error removing document: ', error);
        });
    }
}
