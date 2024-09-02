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
        // Get promotion ID from URL
        var urlParams = new URLSearchParams(window.location.search);
        var promotionId = urlParams.get('id');

        // Fetch promotion details from Firestore
        firebase.firestore().collection('promotions').doc(promotionId).get().then(function (doc) {
            if (doc.exists) {
                var promotion = doc.data(); Swal.close(); 
                document.getElementById('staffSearch').value = promotion.staffName;
                document.getElementById('staffCategory').value = promotion.staffCategory;
                document.getElementById('staffRank').value = promotion.staffRank;
                document.getElementById('staffCategoryNew').value = promotion.staffCategoryNew;
                const event = new Event('change'); document.getElementById('staffCategoryNew').dispatchEvent(event);
                document.getElementById('staffRankNew').value = promotion.staffRankNew;
                document.getElementById('promotionDate').value = promotion.promotionDate.toDate().toISOString().split('T')[0]; 
            } else {
                Swal.fire('No such document!');
            }
        }).catch(function (error) {
            console.log(error);
            Swal.fire('Error getting document:', error);
        });

        // Update promotion details
        document.getElementById('editPromotionForm').addEventListener('submit', function (event) {
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

            firebase.firestore().collection('promotions')
                .doc(promotionId).update({
                    staffName: staffName,
                    staffCategory: staffCategory,
                    staffRank: staffRank,
                    staffCategoryNew: staffCategoryNew,
                    staffRankNew: staffRankNew,
                    promotionDate: firebase.firestore.Timestamp.fromDate(new Date(promotionDate))
                }).then(function () {
                    Swal.fire('Promotion successfully updated!');
                    window.location.href = 'promotions.html';
                }).catch(function (error) {
                    Swal.fire('Error updating promotion: ', error);
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
