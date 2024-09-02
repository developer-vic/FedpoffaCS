document.addEventListener('DOMContentLoaded', function () {
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
        administrative: [
            "Administrative Assistant",
            "Assistant Registrar",
            "Senior Assistant Registrar",
            "Principal Assistant Registrar",
            "Deputy Registrar",
            "Registrar"
        ],
        technical: [
            "Technician",
            "Senior Technician",
            "Principal Technician",
            "Chief Technician",
            "Laboratory/Workshop Technologist",
            "Chief Technologist"
        ],
        library: [
            "Library Assistant",
            "Library Officer",
            "Senior Library Officer",
            "Principal Library Officer",
            "Deputy Librarian",
            "Chief Librarian"
        ]
    };

    document.getElementById('staffCategory').addEventListener('change', function () {
        const category = this.value; console.log(category);
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

    function loadPassport(passportUrl) {
        const preview = document.getElementById('passportPreview');
        preview.src = passportUrl; preview.style.display = 'block';
    }
    Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    var user = null;
    const userMraw = sessionStorage.getItem("current_user_cshndf223337");
    if (userMraw) user = JSON.parse(userMraw);
    if (user) {
        // Get staff ID from URL
        var urlParams = new URLSearchParams(window.location.search);
        var staffId = urlParams.get('id');

        // Fetch staff details from Firestore
        firebase.firestore().collection('staff').doc(staffId).get().then(function (doc) {
            if (doc.exists) {
                var staff = doc.data(); Swal.close(); //console.log(staff);
                document.getElementById('firstName').value = staff.firstName;
                document.getElementById('middleName').value = staff.middleName;
                document.getElementById('lastName').value = staff.lastName;
                document.getElementById('staffCategory').value = staff.staffCategory;
                const event = new Event('change'); document.getElementById('staffCategory').dispatchEvent(event);
                document.getElementById('staffRank').value = staff.staffRank;
                document.getElementById('staffEmail').value = staff.staffEmail;
                //document.getElementById('staffPassword').value = staff.staffPassword; 
                if (staff.passportUrl) loadPassport(staff.passportUrl);
            } else {
                Swal.fire('No such document!');
            }
        }).catch(function (error) {
            Swal.fire('Error getting document:', error);
        });

        // Update staff details
        document.getElementById('editStaffForm').addEventListener('submit', function (event) {
            event.preventDefault(); 
            var firstName = document.getElementById('firstName').value;
            var middleName = document.getElementById('middleName').value;
            var lastName = document.getElementById('lastName').value;
            var staffCategory = document.getElementById('staffCategory').value;
            var staffRank = document.getElementById('staffRank').value;
            var staffEmail = document.getElementById('staffEmail').value; 

            Swal.fire({
                title: 'Loading...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            firebase.firestore().collection('staff').doc(staffId)
            .set({
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                staffCategory: staffCategory,
                staffRank: staffRank, 
                staffEmail: staffEmail
            }).then(function () {
                Swal.fire('Staff successfully updated!');
                window.location.href = 'staff-list.html';
            }).catch(function (error) {
                Swal.fire('Error updating staff: ', error);
            });
        });
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }

    document.getElementById('logout').addEventListener('click', function () {
        firebase.auth().signOut().then(() => {
            // Sign-out successful
            window.location.href = 'index.html';
        }).catch((error) => {
            // An error happened
            Swal.fire('Error signing out:', error);
        });
    });

    
});
