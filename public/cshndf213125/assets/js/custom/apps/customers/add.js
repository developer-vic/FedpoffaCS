"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let drawing = false;

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Touch events
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startDrawing(e.touches[0]);
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  draw(e.touches[0]);
});

canvas.addEventListener("touchend", stopDrawing);

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function draw(e) {
  if (!drawing) return;

  let x, y;

  if (e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  } else {
    x = e.clientX - canvas.getBoundingClientRect().left;
    y = e.clientY - canvas.getBoundingClientRect().top;
  }

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}
// Sample SHA-256 hashing function (you may want to use a proper library)
function sha256(input) {
  const buffer = new TextEncoder("utf-8").encode(input);
  const hashArray = crypto.subtle
    .digest("SHA-256", buffer)
    .then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    });

  return hashArray; // Return the Promise directly
}

async function saveSignature(dataUrl, filename) {
  // const dataUrl = canvas.toDataURL();
  // const hash = await sha256(dataUrl); // Wait for the Promise to resolve
  //localStorage.setItem('signatureHash', hash);
  //download
  const signatureImage = document.createElement("a");
  signatureImage.href = dataUrl;
  signatureImage.download = filename + ".png"; // You can change the filename as needed
  signatureImage.click();
  //return hash;
}

// Class definition
var KTModalCustomersAdd = (function () {
  var submitButton;
  var cancelButton;
  var closeButton;
  var validator;
  var form;
  var modal;

  // Init form inputs
  var handleForm = function () {
    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validator = FormValidation.formValidation(form, {
      fields: {
        name: {
          validators: {
            notEmpty: {
              message: "Full Name is required",
            },
          },
        },
        email: {
          validators: {
            notEmpty: {
              message: "Email is required",
            },
          },
        },
        description: {
          validators: {
            notEmpty: {
              message: "Matric Number is required",
            },
          },
        },
        phone: {
          validators: {
            notEmpty: {
              message: "Phone Number is required",
            },
          },
        },
        dob: {
          validators: {
            notEmpty: {
              message: "Date of Birth is required",
            },
          },
        },
        address1: {
          validators: {
            notEmpty: {
              message: "Address is required",
            },
          },
        },
        city: {
          validators: {
            notEmpty: {
              message: "Home Town is required",
            },
          },
        },
        state: {
          validators: {
            notEmpty: {
              message: "State is required",
            },
          },
        },
        postcode: {
          validators: {
            notEmpty: {
              message: "L.G.A is required",
            },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: ".fv-row",
          eleInvalidClass: "",
          eleValidClass: "",
        }),
      },
    });

    // Revalidate country field. For more info, plase visit the official plugin site: https://select2.org/
    // $(form.querySelector('[name="country"]')).on('change', function () {
    // 	// Revalidate the field when an option is chosen
    // 	validator.revalidateField('country');
    // });

    function generateSignatureId(signatureData) {
      return btoa(signatureData);
    }

    // Action buttons
    submitButton.addEventListener("click", function (e) {
      e.preventDefault();
      // Validate form before submit
      if (validator) {
        validator.validate().then(function (status) {
          console.log("validated!");

          if (status == "Valid") {
            //TODO
            function generateCurrentDate() {
              const currentDate = new Date();
              const options = {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              };
              const formattedDate = currentDate.toLocaleString(
                "en-US",
                options
              );

              return formattedDate;
            }

            let bioForm = document.getElementById("kt_modal_add_customer_form");
            let inputs = bioForm.querySelectorAll("input");
            const inputValues = {};
            inputs.forEach((input) => {
              const name = input.name;
              const value = input.value;
              inputValues[name] = value;
            });
            inputValues.userId = Date.now();
            const regDate = generateCurrentDate();
            inputValues.regDate = regDate;
            inputValues.gender = bioForm.querySelector('[name="gender"]').value;
            inputValues.marital_status = bioForm.querySelector(
              '[name="marital_status"]'
            ).value;
            inputValues.programme =
              bioForm.querySelector('[name="programme"]').value;
            inputValues.programme_type = bioForm.querySelector(
              '[name="programme_type"]'
            ).value;

            var avatarFile = document.getElementById("avatar");
            const avatar = avatarFile.files[0];
            if (avatar) {
              const reader = new FileReader();
              reader.onload = function (e) {
                inputValues.avatarId = e.target.result;
                ContinueSaving();
              };
              reader.readAsDataURL(avatar);
            } else ContinueSaving();

            async function ContinueSaving() {
              Swal.fire({
                text: "Run the Fingerprint Application then click CONNECT",
                icon: "info",
                buttonsStyling: false,
                confirmButtonText: "CONNECT!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              }).then(function (result) {
                if (result.isConfirmed) {
                  sendDataToWinForms();
                }
              });
              // const dataUrl = canvas.toDataURL();
              // const hash = await sha256(dataUrl);
              // const signatureId = hash; //generateSignatureId(signatureData);
              // saveSignature(dataUrl, bioForm.querySelector('[name="description"]').value);
              // inputValues.signatureId = signatureId;
              // submitButton.setAttribute('data-kt-indicator', 'on');
              // submitButton.disabled = true;
              // firestorePostBioData(inputValues);
            }
            async function sendDataToWinForms() {
              const requestData = inputValues.userId;
              const targetUrl = "http://localhost:5000/";
              let headers = new Headers();
              headers.append("Content-Type", "text/plain");
              headers.append("Accept", "text/plain");
              headers.append("Origin", "https://fedpoffacs.web.app");
              let error_text;
              const response = await fetch(targetUrl, {
                mode: "cors",
                credentials: "include",
                method: "POST",
                headers: headers,
                body: requestData,
              }).catch((error) => {
                error_text =
                  "Sorry, Errror occurred with fingerprint, please try again.";
                console.log(error);
              });
              // Handle the response from the WinForms app
              if (response) {
                if (response.ok) {
                  const responseText = await response.text();
                  if (responseText === "true") {
                    submitButton.setAttribute("data-kt-indicator", "on");
                    submitButton.disabled = true;
					inputValues.signatureId = requestData.toString();
                    firestorePostBioData(inputValues); 
                  } else {
                    error_text =
                      "Sorry, Errror occurred with fingerprint, please try again.";
                  }
                } else {
                  error_text =
                    "Sorry, Unable to connect with fingerprint, please try again.";
                  console.log(
                    "Request failed (status " + response.status + ")"
                  );
                }
              }

              if (error_text)
                Swal.fire({
                  text: error_text,
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                });
            }
          } else {
            Swal.fire({
              text: "Sorry, looks like there are some errors detected, please try again.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          }
        });
      }
    });

    function firestorePostBioData(postData) {
      const db = firebase.firestore();
      const regCollectionRef = db
        .collection("projectHND23/cshndf213125/bioDataRecords")
        .doc(postData.signatureId);
      // Use a batch to write the data to both the 'posts' collection and the user's post list
      const batch = db.batch();
      batch.set(regCollectionRef, postData);
      // Commit the batch
      batch
        .commit()
        .then(() => {
          // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
          submitButton.removeAttribute("data-kt-indicator");
          Swal.fire({
            text: "Form has been successfully submitted with the fingerprint!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(function (result) {
            if (result.isConfirmed) {
              // Hide modal
              modal.hide();
              // Redirect to customers list page
              window.location = form.getAttribute("data-kt-redirect");
            }
          });
          // Enable submit button after loading
          submitButton.disabled = false;
        })
        .catch((error) => {
          // The write failed...
          console.log(error);
          // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
          Swal.fire({
            text: "Sorry, There are errors saving the record, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          // Hide loading indication
          submitButton.removeAttribute("data-kt-indicator");
          submitButton.disabled = false;
        });
    }

    cancelButton.addEventListener("click", function (e) {
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
          cancelButton: "btn btn-active-light",
        },
      }).then(function (result) {
        if (result.value) {
          form.reset(); // Reset form
          modal.hide(); // Hide modal
        } else if (result.dismiss === "cancel") {
          Swal.fire({
            text: "Your form has not been cancelled!.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    });

    closeButton.addEventListener("click", function (e) {
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
          cancelButton: "btn btn-active-light",
        },
      }).then(function (result) {
        if (result.value) {
          form.reset(); // Reset form
          modal.hide(); // Hide modal
        } else if (result.dismiss === "cancel") {
          Swal.fire({
            text: "Your form has not been cancelled!.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    });
  };

  return {
    // Public functions
    init: function () {
      // Elements
      modal = new bootstrap.Modal(
        document.querySelector("#kt_modal_add_customer")
      );

      form = document.querySelector("#kt_modal_add_customer_form");
      submitButton = form.querySelector("#kt_modal_add_customer_submit");
      cancelButton = form.querySelector("#kt_modal_add_customer_cancel");
      closeButton = form.querySelector("#kt_modal_add_customer_close");

      handleForm();
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  KTModalCustomersAdd.init();
});
