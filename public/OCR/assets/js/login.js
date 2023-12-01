let login_btn = document.getElementById("login_btn");
login_btn.addEventListener('click', function (e) {
    e.preventDefault(); 
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value; 

    if(!email || !password)
        alert("Pls fill in all the form fields");
    else if(!localStorage.getItem(email))
        alert("Email Address is not registered");
    else{  
        let userMraw = localStorage.getItem(email);
        let user = JSON.parse(userMraw);
        if(user.password != password)
            alert("Incorrect Password");
        else{
            localStorage.setItem("current_user", userMraw); 
            location.href = "ocr.html";
        }
    }
});
