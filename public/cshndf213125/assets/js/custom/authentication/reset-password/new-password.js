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

// Class Definition
var KTAuthNewPassword = function () {
    // Elements
    var form;
    var submitButton;
    var validator;
    var passwordMeter;

    var handleForm = function (e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
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

        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            validator.revalidateField('password');
            validator.validate().then(async function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');
                    submitButton.disabled = true;
                    let email = sessionStorage.getItem("reset_email_cshndf213125");
                    if (!email) location.href = "sign-in.html";
                    //updating
                    const db = firebase.firestore();
                    const regCollectionRef = db.collection('projectHND23/cshndf213125/registration').doc(email);
                    try {
                        const docSnapshot = await regCollectionRef.get();
                        if (docSnapshot.exists) {
                            const data = docSnapshot.data();
                            if (data) {
                                data.password = form.querySelector('[name="password"]').value;
                                const batch = db.batch();
                                batch.set(regCollectionRef, data);
                                // Commit the batch
                                batch.commit().then(() => {
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
                                            form.querySelector('[name="password"]').value = "";
                                            form.querySelector('[name="confirm-password"]').value = "";
                                            passwordMeter.reset();
                                            var redirectUrl = form.getAttribute('data-kt-redirect-url');
                                            if (redirectUrl) {
                                                location.href = redirectUrl;
                                            }
                                        }
                                    });
                                    sessionStorage.removeItem("reset_email_cshndf213125");
                                    sessionStorage.removeItem("current_user_cshndf213125");
                                }).catch((error) => {
                                    // The write failed...
                                    console.error(error);
                                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                                    Swal.fire({
                                        text: "Sorry, There are errors resetting the password, please try again.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });
                                });
                            }
                        }
                    } catch (error) {
                        console.error("Error checking key existence:", error);
                        //location.href = "reset-password.html";
                    }
                    // Hide loading indication
                    submitButton.removeAttribute('data-kt-indicator');
                    submitButton.disabled = false;
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

        form.querySelector('input[name="password"]').addEventListener('input', function () {
            if (this.value.length > 0) {
                validator.updateFieldStatus('password', 'NotValidated');
            }
        });
    }

    var validatePassword = function () {
        return (passwordMeter.getScore() === 100);
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            form = document.querySelector('#kt_new_password_form');
            submitButton = document.querySelector('#kt_new_password_submit');
            passwordMeter = KTPasswordMeter.getInstance(form.querySelector('[data-kt-password-meter="true"]'));

            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAuthNewPassword.init();
});
