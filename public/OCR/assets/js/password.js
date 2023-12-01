let fpassword = document.getElementById("fpassword");
if (fpassword)
    fpassword.addEventListener('click', function (e) {
        e.preventDefault();
        let email = document.getElementById("email").value;

        if (!email)
            alert("Pls fill in your email address");
        else if (!localStorage.getItem(email))
            alert("Email Address is not registered");
        else {
            let userMraw = localStorage.getItem(email);
            localStorage.setItem("current_user", userMraw);
            location.href = "reset-password.html";
        }
    });

let rpassword = document.getElementById("rpassword");
if (rpassword) {
    let userMraw = localStorage.getItem("current_user");
    if (!userMraw) location.href = "forgot-password.html";
    rpassword.addEventListener('click', function (e) {
        e.preventDefault();

        let password = document.getElementById("password-field").value;
        let password2 = document.getElementById("confirm-password").value;

        if (!password || !password2)
            alert("Pls fill in all the password");
        else if (password != password2)
            alert("Password do not match");
        else { 
            let user = JSON.parse(userMraw);
            user.password = password;
            localStorage.removeItem("current_user");
            localStorage.setItem(user.email, JSON.stringify(user));
            location.href = "login.html";
        }
    });
}