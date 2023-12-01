"use strict";

const firebaseConfig = {
    apiKey: "AIzaSyDQplDuiwgoOLJV8LEqHc9ZYi5KbfMmc9g",
    authDomain: "fedpoffacs.firebaseapp.com",
    projectId: "fedpoffacs",
    storageBucket: "fedpoffacs.appspot.com",
    messagingSenderId: "572139824346",
    appId: "1:572139824346:web:eb24dd16ac0cea086db1e3",
    measurementId: "G-XEM4TRP48W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Sample SHA-256 hashing function (you may want to use a proper library)
function sha256(input) {
    const buffer = new TextEncoder('utf-8').encode(input);
    const hashArray = crypto.subtle.digest('SHA-256', buffer).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    });

    return hashArray; // Return the Promise directly
}

function DeleteRecord() {
    Swal.fire({
        text: "Are you sure you would like to delete \'" + _vuser.name + "\' record?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, return",
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-active-light"
        }
    }).then(async function (result) {
        if (result.value) {
            //delete, timer 2 s
            document.body.style.cursor = 'wait';
            try {
                const db = firebase.firestore(); let keyToDelete = _vuser.signatureId;
                const bioDataCollectionRef = db.collection('projectHND23/cshndf213125/bioDataRecords').doc(keyToDelete);
                const batch = db.batch();
                batch.delete(bioDataCollectionRef);
                await batch.commit();
                sessionStorage.removeItem("viewDetails");
                Swal.fire({
                    text: "Your record has deleted successfully!.",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary",
                    }
                }).then(function (result) {
                    location.href = "list.html";
                });
            } catch (error) {
                console.error("Error deleting key:", error);
            }
            document.body.style.cursor = 'auto';
        }
    });
}

// Class definition
var KTModalUpdateCustomer = function () {
    var element;
    var submitButton;
    var cancelButton;
    var closeButton;
    var form;
    var modal;

    // Init form inputs
    var initForm = function () {
        // Example data  

        function generateSignatureId(signatureData) {
            return btoa(signatureData);
        }

        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            let bioForm = document.getElementById("kt_modal_update_customer_form");
            let inputs = bioForm.querySelectorAll('input');
            const inputValues = {};
            inputs.forEach((input) => {
                const name = input.name;
                const value = input.value;
                inputValues[name] = value;
            });
            inputValues.userId = _vuser.userId;
            inputValues.regDate = _vuser.regDate;
            inputValues.gender = bioForm.querySelector('[name="gender"]').value;
            inputValues.marital_status = bioForm.querySelector('[name="marital_status"]').value;
            inputValues.programme = bioForm.querySelector('[name="programme"]').value;
            inputValues.programme_type = bioForm.querySelector('[name="programme_type"]').value;

            var avatarFile = document.getElementById("avatar");
            const avatar = avatarFile.files[0];
            if (avatar) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    inputValues.avatarId = e.target.result;
                    ContinueSaving();
                };
                reader.readAsDataURL(avatar);
            } else {
                inputValues.avatarId = _vuser.avatarId;
                ContinueSaving();
            }

            async function ContinueSaving() {
                //console.log(JSON.stringify(inputValues)); return;
                var signatureInput = document.getElementById("signature");
                const signature = signatureInput.files[0];
                if (signature) {
                    const reader = new FileReader();
                    reader.onload = async function (e) {
                        const signatureData = e.target.result;
                        const signatureId = await sha256(signatureData); //generateSignatureId(signatureData);
                        inputValues.signatureId = signatureId; 
                        // Check if the object with the old signatureId exists
                        if (_vuser.signatureId === signatureId) {  
                            submitButton.setAttribute('data-kt-indicator', 'on');
                            submitButton.disabled = true; 
                            firestoreUpdateBioData(inputValues);  
                        }
                        else {
                            Swal.fire({
                                text: "sorry, Signature do not match.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }); 
                        }
                    };
                    reader.readAsDataURL(signature);
                } else {
                    Swal.fire({
                        text: "Please select a signature file.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    }); 
                } 
            } 
        });
 
		function firestoreUpdateBioData(postData) {
			const db = firebase.firestore();
			const regCollectionRef = db.collection('projectHND23/cshndf213125/bioDataRecords').doc(postData.signatureId);
			// Use a batch to write the data to both the 'posts' collection and the user's post list
			const batch = db.batch();
			batch.set(regCollectionRef, postData);
			// Commit the batch
			batch.commit().then(() => {
                sessionStorage.setItem("viewDetails", JSON.stringify(postData));
				// Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
				submitButton.removeAttribute('data-kt-indicator');
                Swal.fire({
                    text: "Form has been successfully updated!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }).then(function (result) {
                    if (result.isConfirmed) {
                        // Hide modal
                        modal.hide();
                        // Redirect to customers list page
                        location.reload();
                    }
                });
				// Enable submit button after loading
				submitButton.disabled = false;
			}).catch((error) => {
				// The write failed...
				console.error(error);
				// Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
				Swal.fire({
					text: "Sorry, There are errors saving the record, please try again.",
					icon: "error",
					buttonsStyling: false,
					confirmButtonText: "Ok, got it!",
					customClass: {
						confirmButton: "btn btn-primary"
					}
				});
				// Hide loading indication
				submitButton.removeAttribute('data-kt-indicator');
				submitButton.disabled = false;
			});
		}


        cancelButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal				
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        closeButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal				
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });
    }

    return {
        // Public functions
        init: function () {
            // Elements
            element = document.querySelector('#kt_modal_update_customer');
            modal = new bootstrap.Modal(element);

            form = element.querySelector('#kt_modal_update_customer_form');
            submitButton = form.querySelector('#kt_modal_update_customer_submit');
            cancelButton = form.querySelector('#kt_modal_update_customer_cancel');
            closeButton = element.querySelector('#kt_modal_update_customer_close');

            initForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTModalUpdateCustomer.init();
});

