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

// Class definition
var KTSignupGeneral = function () {
    // Elements
    var form;
    var submitButton;
    var validator;
    var passwordMeter;

    // Handle form
    var handleForm = function (e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'first-name': {
                        validators: {
                            notEmpty: {
                                message: 'First Name is required'
                            }
                        }
                    },
                    'last-name': {
                        validators: {
                            notEmpty: {
                                message: 'Last Name is required'
                            }
                        }
                    },
                    'phone': {
                        validators: {
                            notEmpty: {
                                message: 'Phone number is required'
                            }
                        }
                    },
                    'email': {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'The value is not a valid email address',
                            },
                            notEmpty: {
                                message: 'Email address is required'
                            }
                        }
                    },
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'The password is required'
                            },
                            callback: {
                                message: 'Please enter valid password',
                                callback: function (input) {
                                    if (input.value.length > 0) {
                                        return validatePassword();
                                    }
                                }
                            }
                        }
                    },
                    'confirm-password': {
                        validators: {
                            notEmpty: {
                                message: 'The password confirmation is required'
                            },
                            identical: {
                                compare: function () {
                                    return form.querySelector('[name="password"]').value;
                                },
                                message: 'The password and its confirm are not the same'
                            }
                        }
                    },
                    'toc': {
                        validators: {
                            notEmpty: {
                                message: 'You must accept the terms and conditions'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger({
                        event: {
                            password: false
                        }
                    }),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',  // comment to enable invalid state icons
                        eleValidClass: '' // comment to enable valid state icons
                    })
                }
            }
        );

        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            validator.revalidateField('password');
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    let email = form.querySelector('[name="email"]').value;
                    let firstname = form.querySelector('[name="first-name"]').value;
                    let lastname = form.querySelector('[name="last-name"]').value;
                    let phone = form.querySelector('[name="phone"]').value;
                    let password = form.querySelector('[name="password"]').value;
                    var userObj = { firstname: firstname, lastname: lastname, phone: phone, email: email, password: password };
                    submitButton.setAttribute('data-kt-indicator', 'on');
                    submitButton.disabled = true;
                    CheckForEmail(userObj);
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        });

        // Handle password input
        form.querySelector('input[name="password"]').addEventListener('input', function () {
            if (this.value.length > 0) {
                validator.updateFieldStatus('password', 'NotValidated');
            }
        });
    }

    async function CheckForEmail(postData) {
        const db = firebase.firestore();
        const regCollectionRef = db.collection('projectHND23/cshndf213125/registration').doc(postData.email);
        try {
            const docSnapshot = await regCollectionRef.get(); 
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                if (data) {
                    Swal.fire({
                        text: "Sorry, this email address has already been registered, please try again.",
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
                    return;
                }
            }
        } catch (error) {
            console.error("Error checking key existence:", error);
            Swal.fire({
                text: "Sorry, There are error while validating the record, please try again.",
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
            return;
        }

        firestorePost(postData);
    }

    function firestorePost(postData) {
        const db = firebase.firestore();
        const regCollectionRef = db.collection('projectHND23/cshndf213125/registration').doc(postData.email);
        // Use a batch to write the data to both the 'posts' collection and the user's post list
        const batch = db.batch();
        batch.set(regCollectionRef, postData);
        // Commit the batch
        batch.commit().then(() => {
            // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
            Swal.fire({
                text: "You have successfully reset your password!",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            }).then(function (result) {
                if (result.isConfirmed) {
                    form.reset();
                    passwordMeter.reset();
                    var redirectUrl = form.getAttribute('data-kt-redirect-url');
                    if (redirectUrl) {
                        location.href = redirectUrl;
                    }
                }
            });
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

    // Password input validation
    var validatePassword = function () {
        return (passwordMeter.getScore() === 100);
    }

    // Public functions
    return {
        // Initialization
        init: function () {
            // Elements
            form = document.querySelector('#kt_sign_up_form');
            submitButton = document.querySelector('#kt_sign_up_submit');
            passwordMeter = KTPasswordMeter.getInstance(form.querySelector('[data-kt-password-meter="true"]'));

            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTSignupGeneral.init();
});
