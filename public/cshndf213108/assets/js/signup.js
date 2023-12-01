let signup_btn = document.getElementById("signup_btn");
signup_btn.addEventListener('click', function (e) {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;

    if(!name || !email || !password || !password2)
        alert("Pls fill in all the form fields");
    else if(password != password2)
        alert("Password do not match");
    else{  
        let user = {name: name, email: email, password: password };
        localStorage.setItem(email, JSON.stringify(user));
        alert("Congrats! Your registration is done successfully");
        location.href = "login.html";
    }
});