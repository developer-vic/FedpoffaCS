"use strict";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

setUserDetails();
function setUserDetails() {
	let nameSpan1 = document.getElementById("nameSpan1");
	let nameSpan2 = document.getElementById("nameSpan2");
	let emailSpan1 = document.getElementById("emailSpan1");
	//{ firstname, lastname, phone, email, password };
	let saveUserJson = sessionStorage.getItem("current_user_cshndf213125");
	if (!saveUserJson) LogOut();
	let userObj = JSON.parse(saveUserJson);
	_userId = userObj.userId;
	if (nameSpan1) nameSpan1.innerHTML = userObj.firstname + " " + userObj.lastname;
	if (nameSpan2) nameSpan2.innerHTML = userObj.firstname + " " + userObj.lastname;
	if (emailSpan1) emailSpan1.innerHTML = userObj.email;
}
function LogOut() {
	sessionStorage.removeItem("current_user_cshndf213125");
	location.href = "sign-in.html";
}


// Class definition
var KTAppChat = function () {
	// Private functions
	var handeSend = function (element) {
		if (!element) {
			return;
		}

		// Handle send
		KTUtil.on(element, '[data-kt-element="input"]', 'keydown', function (e) {
			if (e.keyCode == 13) {
				handeMessaging(element);
				e.preventDefault();

				return false;
			}
		});

		KTUtil.on(element, '[data-kt-element="send"]', 'click', function (e) {
			handeMessaging(element);
		});
	}

	var handeMessaging = function (element) {
		var messages = element.querySelector('[data-kt-element="messages"]');
		var input = element.querySelector('[data-kt-element="input"]');

		if (input.value.length === 0) {
			return;
		}

		var messageOutTemplate = messages.querySelector('[data-kt-element="template-out"]');
		var messageInTemplate = messages.querySelector('[data-kt-element="template-in"]');
		var message;

		// Show example outgoing message
		message = messageOutTemplate.cloneNode(true);
		message.classList.remove('d-none');
		message.querySelector('[data-kt-element="message-text"]').innerText = input.value;
		input.value = '';
		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;


		setTimeout(function () {
			// Show example incoming message
			message = messageInTemplate.cloneNode(true);
			message.classList.remove('d-none');
			message.querySelector('[data-kt-element="message-text"]').innerText = 'Thank you for your awesome support!';
			messages.appendChild(message);
			messages.scrollTop = messages.scrollHeight;
		}, 2000);
	}

	// Public methods
	return {
		init: function (element) {
			handeSend(element);
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	// Init inline chat messenger
	KTAppChat.init(document.querySelector('#kt_chat_messenger'));

	// Init drawer chat messenger
	KTAppChat.init(document.querySelector('#kt_drawer_chat_messenger'));
});
