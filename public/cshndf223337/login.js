document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var userObj = userCredential.user;
            sessionStorage.setItem("current_user_cshndf223337", JSON.stringify(userObj));
            firebase.firestore().collection('users').doc(userObj.uid).get().then(function (doc) {
                if (doc.exists) {
                    var userData = doc.data();
                    Swal.fire('Login successful!');
                    // Redirect to dashboard
                    if (userData.staffCategory)
                        window.location.href = `staff-info.html?id=${userObj.uid}`;
                    else window.location.href = 'dashboard.html';
                } else {
                    console.log(userObj.uid);
                    firebase.firestore().collection('staff').doc(userObj.uid).get().then(function (doc2) {
                        if (doc2.exists) {
                            var staffData = doc2.data();
                            Swal.fire('Login successful!');
                            // Redirect to dashboard
                            if (staffData.staffCategory)
                                window.location.href = `staff-info.html?id=${userObj.uid}`;
                            else window.location.href = 'dashboard.html';
                        } else {
                            Swal.fire('Error trying to login');
                        }
                    }).catch(function (error) {
                        Swal.fire('Error getting document:', error);
                    });
                }
            }).catch(function (error) {
                Swal.fire('Error getting document:', error);
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Swal.fire('Error: ' + errorMessage);
        });
});
sessionStorage.removeItem("current_user_cshndf223337");