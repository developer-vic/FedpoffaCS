var urlParams = new URLSearchParams(window.location.search);
var staffId = urlParams.get('id');
Swal.fire({
    title: 'Loading...',
    allowOutsideClick: false,
    didOpen: () => {
        Swal.showLoading();
    }
});
// Function to load existing passport URL if available
function loadPassport(passportUrl) {
    const preview = document.getElementById('passportPreview');
    preview.src = passportUrl; preview.style.display = 'block';
}
firebase.firestore().collection('staff').doc(staffId).get().then(function (doc) {
    if (doc.exists) {
        var staff = doc.data(); Swal.close(); //console.log(staff);
        document.getElementById('staffName').value = staff.firstName + " " + staff.middleName + " " + staff.lastName;
        document.getElementById('staffCategory').value = staff.staffCategory;
        document.getElementById('staffRank').value = staff.staffRank;
        document.getElementById('staffEmail').value = staff.staffEmail;
        if (staff.passportUrl) loadPassport(staff.passportUrl);
        // Fetch promotions list
        firebase.firestore().collection('promotions').get().then(function (querySnapshot) {
            var allPromotionList = [];
            querySnapshot.forEach(function (doc) {
                var promotion = doc.data();
                allPromotionList.push(promotion);
            });
            const staffpromotions = allPromotionList.filter(promo =>
                promo.staffName === staff.firstName + " " + staff.middleName + " " + staff.lastName
            );
            // Populate promotion history
            const promotionList = document.getElementById('promotionList');
            if (staffpromotions.length > 0) {
                staffpromotions.forEach(promotion => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    const promotionDate = promotion.promotionDate.toDate();
                    const options = { year: 'numeric', month: 'short', day: '2-digit' };
                    const formattedDate = promotionDate.toLocaleDateString('en-US', options);
                    listItem.textContent = `${formattedDate}: Promoted to ${promotion.staffRankNew}`;
                    promotionList.appendChild(listItem);
                });
            } else {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.textContent = 'No promotion history available.';
                promotionList.appendChild(listItem);
            }
        }).catch(function (error) {
            console.log('Error getting documents:', error);
        });
        Swal.close();
    } else {
        Swal.fire('No such staff!');
    }
}).catch(function (error) {
    Swal.fire('Error getting staff:', error);
});


// Upload passport to Firebase Storage and update Firestore 
function uploadPassport() {
    const file = document.getElementById('passportInput').files[0];
    const preview = document.getElementById('passportPreview');

    if (file) {
        // Preview the uploaded image
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);

        // Upload to Firebase Storage
        const storageRef = firebase.storage().ref('staff_passports/' + staffId + '/' + file.name);
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            function (snapshot) {
                Swal.fire({
                    title: 'Loading...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
            },
            function (error) {
                Swal.fire('Upload failed:', error);
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    firebase.firestore().collection('staff').doc(staffId).update({
                        passportUrl: downloadURL
                    }).then(function () {
                        Swal.fire('Passport uploaded successfully!');
                    }).catch(function (error) {
                        Swal.fire('Error updating Firestore:', error);
                    });
                });
            }
        );
    }
}

