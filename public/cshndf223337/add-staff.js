document.addEventListener('DOMContentLoaded', function () {
    var user = null;
    const userMraw = sessionStorage.getItem("current_user_cshndf223337");
    if (userMraw) user = JSON.parse(userMraw);
    if (user) {
        // User is signed in, get user details from Firestore
        firebase.firestore().collection('users').doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                var userData = doc.data();
                // Display user-specific information if needed
            } else {
                console.log('No such document!');
            }
        }).catch(function (error) {
            console.log('Error getting document:', error);
        });
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }

    document.getElementById('addStaffForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var firstName = document.getElementById('firstName').value;
        var middleName = document.getElementById('middleName').value;
        var lastName = document.getElementById('lastName').value;
        var staffCategory = document.getElementById('staffCategory').value;
        var staffRank = document.getElementById('staffRank').value;
        var staffEmail = document.getElementById('staffEmail').value;
        var staffPassword = document.getElementById('staffPassword').value;

        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        firebase.auth().createUserWithEmailAndPassword(staffEmail, staffPassword)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                // Add user info to Firestore 
                firebase.firestore().collection('staff').doc(user.uid)
                .set({
                    firstName: firstName,
                    middleName: middleName,
                    lastName: lastName,
                    staffCategory: staffCategory,
                    staffRank: staffRank,
                    staffEmail: staffEmail, 
                }).then(function () {
                    Swal.fire('Staff successfully added!');
                    location.href = 'staff-list.html';
                }).catch(function (error) {
                    Swal.fire('Error adding staff: ', error);
                }); 
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                Swal.fire('Error: ' + errorMessage);
            }); 
    });

    document.getElementById('logout').addEventListener('click', function () {
        firebase.auth().signOut().then(() => {
            // Sign-out successful
            window.location.href = 'index.html';
        }).catch((error) => {
            // An error happened
            console.log('Error signing out:', error);
        });
    });

    const ranks = {
        academic: [
            "Graduate Assistant",
            "Assistant Lecturer",
            "Lecturer II",
            "Lecturer I",
            "Senior Lecturer",
            "Principal Lecturer",
            "Chief Lecturer",
            "Head of Department (HOD)",
            "Dean"
        ],
        nonacademic: [
            "Library Assistant",
            "Library Officer",
            "Senior Library Officer",
            "Principal Library Officer",
            "Deputy Librarian",
            "Chief Librarian",
            "Technician",
            "Senior Technician",
            "Principal Technician",
            "Chief Technician",
            "Laboratory/Workshop Technologist",
            "Chief Technologist",
            "Administrative Assistant",
            "Assistant Registrar",
            "Senior Assistant Registrar",
            "Principal Assistant Registrar",
            "Deputy Registrar",
            "Registrar"
        ]
    };

    document.getElementById('staffCategory').addEventListener('change', function () {
        const category = this.value;
        const rankSelect = document.getElementById('staffRank');

        // Clear previous ranks
        rankSelect.innerHTML = '<option value="">--Select Rank--</option>';

        if (category && ranks[category]) {
            ranks[category].forEach(function (rank) {
                const option = document.createElement('option');
                option.value = rank;
                option.textContent = rank;
                rankSelect.appendChild(option);
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a valid staff category!',
            });
        }
    });

});
