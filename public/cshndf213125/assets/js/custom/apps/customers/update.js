"use strict";

let _userId = "";

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
    }).then(function (result) {
        if (result.value) {
            //delete, timer 2 s
            document.body.style.cursor = 'wait';

            // Retrieve existing bioList array from localStorage
            let bioListMraw = localStorage.getItem("bioListMraw");
            let bioList = bioListMraw ? JSON.parse(bioListMraw) : [];
            // Efind the actual values index
            let indexToUpdate = bioList.findIndex(item => item.userId === _userId);
            // Check if the object with the old signatureId exists
            if (indexToUpdate !== -1) {
                // remove the object from index
                bioList.splice(indexToUpdate, 1);
                // Save the updated bioList array back to localStorage
                localStorage.setItem("bioListMraw", JSON.stringify(bioList));
                localStorage.removeItem("viewDetails");
            }

            setTimeout(() => {
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
                document.body.style.cursor = 'auto';
            }, 2000);
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
            } else{
                inputValues.avatarId = _vuser.avatarId; 
                ContinueSaving();
            } 

            async function ContinueSaving(){
                //console.log(JSON.stringify(inputValues)); return;
            var signatureInput = document.getElementById("signature");
            const signature = signatureInput.files[0];
            if (signature) {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    const signatureData = e.target.result;
                    const signatureId = await sha256(signatureData); //generateSignatureId(signatureData);
                    inputValues.signatureId = signatureId;
                    // Assuming inputValues is defined and contains the data you want to store
                    let userMraw = JSON.stringify(inputValues);
                    //console.log(userMraw);
                    // Retrieve existing bioList array from localStorage
                    let bioListMraw = localStorage.getItem("bioListMraw");
                    let bioList = bioListMraw ? JSON.parse(bioListMraw) : [];
                    // Example: Replace 'oldSignatureId' and 'newSignatureId' with actual values
                    let oldSignatureId = _vuser.signatureId; let newSignatureId = signatureId;
                    let indexToUpdate = bioList.findIndex(item => item.signatureId === oldSignatureId);
                    // Check if the object with the old signatureId exists
                    if (indexToUpdate !== -1) {
                        // Update the object with the new signatureId
                        bioList[indexToUpdate].signatureId = newSignatureId;
                        bioList[indexToUpdate].data = userMraw;
                        // Save the updated bioList array back to localStorage
                        localStorage.setItem("bioListMraw", JSON.stringify(bioList));
                        localStorage.setItem("viewDetails", userMraw);
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
                        return;
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
                return;
            }

            submitButton.setAttribute('data-kt-indicator', 'on');
            // Disable submit button whilst loading
            submitButton.disabled = true;
            setTimeout(function () {
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
            }, 2000);
            }

        });

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

