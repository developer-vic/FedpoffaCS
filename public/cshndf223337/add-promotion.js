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

    document.getElementById('staffCategoryNew').addEventListener('change', function () {
        const category = this.value;
        const rankSelect = document.getElementById('staffRankNew');

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

    var _staffList = [];
    // Fetch staff list
    firebase.firestore().collection('staff').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var staff = doc.data();
            _staffList.push(staff);
        });
        Swal.close();
    }).catch(function (error) {
        console.log('Error getting documents:', error);
        Swal.close();
    });


    document.getElementById('staffSearch').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const filteredStaff = _staffList.filter(staff => 
            staff.firstName.toLowerCase().includes(query) ||
            staff.middleName.toLowerCase().includes(query) ||
            staff.lastName.toLowerCase().includes(query) 
        );
        const staffList = document.getElementById('staffList');

        // Clear the previous list
        staffList.innerHTML = '';

        // Show up to 5 results
        filteredStaff.slice(0, 5).forEach(staff => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = staff.firstName + " " + staff.middleName + " " + staff.lastName;
            listItem.addEventListener('click', function () {
                // Set the selected staff info to the input boxes
                document.getElementById('staffSearch').value = staff.firstName + " " + staff.middleName + " " + staff.lastName;
                document.getElementById('staffCategory').value = staff.staffCategory;
                document.getElementById('staffRank').value = staff.staffRank;
                if (staff.passportUrl) loadPassport(staff.passportUrl);
                // Clear the search results
                staffList.innerHTML = ''; 
            });
            staffList.appendChild(listItem);
        });
    });

    document.getElementById('addPromotionForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        }); 
        var staffName = document.getElementById('staffSearch').value;
        var staffCategory = document.getElementById('staffCategory').value;
        var staffRank = document.getElementById('staffRank').value;
        var staffCategoryNew = document.getElementById('staffCategoryNew').value;
        var staffRankNew = document.getElementById('staffRankNew').value;
        var promotionDate = document.getElementById('promotionDate').value;

        firebase.firestore().collection('promotions').add({
            staffName: staffName,
            staffCategory: staffCategory,
            staffRank: staffRank,
            staffCategoryNew: staffCategoryNew,
            staffRankNew: staffRankNew,
            promotionDate: firebase.firestore.Timestamp.fromDate(new Date(promotionDate))
        }).then(function () {
            Swal.fire('Promotion successfully added!');
            window.location.href = 'promotions.html';
        }).catch(function (error) {
            Swal.fire('Error adding promotion: ', error);
        });
    });

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
