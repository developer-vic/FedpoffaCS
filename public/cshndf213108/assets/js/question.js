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

function showLoading() {
    Swal.fire({
        title: '', text: 'Processing....',
        imageUrl: 'assets/img/loading.gif',
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
            Swal.showLoading();
        }
    })
}
let quesAnsListData = [];

let btnAsk = document.getElementById("btnAsk");
if (btnAsk)
    btnAsk.addEventListener('click', function (e) {
        e.preventDefault();
        let questID = Date.now().toString(); let askBy = _user.name;
        let date = new Date().toUTCString(); let department = _user.department;
        let title = document.getElementById("title").value;
        let reference = document.getElementById("reference").value;
        let description = document.getElementById("description").value;
        if (!title || !reference || !description)
            alert("Pls fill in all the form fields");
        else {
            let user = { questID: questID, askBy: askBy, date: date, department: department, title: title, reference: reference, description: description };
            firestorePost(user);
        }
    });

function firestorePost(postData) {
    showLoading();
    const db = firebase.firestore();
    const regCollectionRef = db.collection('projectHND23/cshndf213108/questions');
    regCollectionRef.add(postData)
        .then(docRef => {
            postData.questID = docRef.id;
            docRef.set(postData); Swal.close();
            Swal.fire({
                text: "Congrats! Your question is asked successfully. Kindly keep checking for response.",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            }).then(function (result) {
                location.href = "forum-list.html";
            });
        })
        .catch(err => {
            console.log(err); Swal.close();
            Swal.fire({
                text: "Sorry, There are errors saving the record, please try again.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            });
        });
}

// Function to create list items dynamically
function createPostListItem(post) {
    var listItem = document.createElement("li");
    var link = document.createElement("a");
    link.style.color = "blue";
    link.href = "#";
    link.onclick = function () {
        goToDetails(post.questID);
    };
    link.textContent = post.title;
    listItem.appendChild(link);
    return listItem;
}
// Function to handle the click event
function goToDetails(questID) {
    let userDetail = quesAnsListData.find(item => item.questID === questID);
    if (userDetail) {
        sessionStorage.setItem("viewDetails_3108", JSON.stringify(userDetail));
        location.href = "forum.html";
    }
}
// Function to create a forum post dynamically 
function createForumPost(post) {
    //.doc(`${_user.department}`); //${_user.email}/${postData.questID}`);
    //{ questID: questID, askBy: askBy, date: date, department: department, title: title, reference: reference, description: description };
    var forumPost = document.createElement("div");
    forumPost.className = "gx-forum-list";

    var postCaption = document.createElement("div");
    postCaption.className = "forum-post-caption";
    postCaption.onclick = function () {
        goToDetails(post.questID);
    };

    var heading = document.createElement("h4");
    heading.className = "heading";

    var postLink = document.createElement("a");
    postLink.href = "#";
    postLink.textContent = post.title;
    postLink.onclick = function () {
        goToDetails(post.questID);
    };

    heading.appendChild(postLink);

    var entryMeta = document.createElement("p");
    entryMeta.className = "entry-meta";

    var dateIcon = document.createElement("i");
    dateIcon.className = "ri-calendar-2-line";
    entryMeta.appendChild(dateIcon);

    var dateSpan = document.createElement("span");
    dateSpan.textContent = post.date;
    entryMeta.appendChild(dateSpan);

    var bookmarkIcon = document.createElement("i");
    bookmarkIcon.className = "ri-bookmark-line";
    entryMeta.appendChild(bookmarkIcon);

    var categorySpan = document.createElement("span");
    categorySpan.textContent = post.department;
    entryMeta.appendChild(categorySpan);

    var userIcon = document.createElement("i");
    userIcon.className = "ri-user-line";
    var br = document.createElement("br");
    entryMeta.appendChild(br);
    entryMeta.appendChild(userIcon);

    var userSpan = document.createElement("span");
    userSpan.textContent = post.askBy;
    entryMeta.appendChild(userSpan);

    var templateSpan = document.createElement("span");
    templateSpan.textContent = post.reference;

    var searchContent = document.createElement("p");
    searchContent.className = "search-content";
    searchContent.textContent = post.description;

    postCaption.appendChild(heading);
    postCaption.appendChild(entryMeta);
    postCaption.appendChild(templateSpan);
    postCaption.appendChild(searchContent);

    forumPost.appendChild(postCaption);

    return forumPost;
}

let btnReply = document.getElementById("btnReply");
if (btnReply)
    btnReply.addEventListener('click', function (e) {
        e.preventDefault();
        let replyBy = _user.name;
        let replyDate = new Date().toUTCString();  
        let reply = document.getElementById("reply").value;
        if (!reply)
            alert("Pls write a reply.");
        else {
            _quest.replyBy = replyBy;
            _quest.replyDate = replyDate;
            _quest.reply = reply;
             firestoreUpdate(_quest);
        }
    });

    function firestoreUpdate(postData) {
        showLoading();
        const db = firebase.firestore();
        const regCollectionRef = db.collection('projectHND23/cshndf213108/questions').doc(postData.questID);
        regCollectionRef.set(postData)
            .then(docRef => { 
                Swal.close();
                Swal.fire({
                    text: "Congrats! Your reply has been sent successfully. Kindly keep checking for new questions.",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }).then(function (result) {
                    location.href = "forum-list.html";
                });
            })
            .catch(err => {
                console.log(err); Swal.close();
                Swal.fire({
                    text: "Sorry, There are errors saving the record, please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            });
    }

   if (!btnReply) CheckForQuestions();
    async function CheckForQuestions() {
        try {
            const db = firebase.firestore();
            const regCollectionRef = db.collection('projectHND23/cshndf213108/questions');
            const docSnapshot = await regCollectionRef.get();
            var quesAnsList = document.getElementById("quesAnsList");
            var questListContainer = document.getElementById("forumList");
            let questCount = 0;
            docSnapshot.forEach((doc) => {
                var data = doc.data();
                if (data) {
                    console.log(JSON.stringify(data));
                    if (data.department === _user.department) {
                        if (_user.usertype == "Admin" || _user.name == data.askBy) {
                            quesAnsListData.push(data);
                            if (data.reply) {
                                var listItem = createPostListItem(data);
                                quesAnsList.appendChild(listItem);
                            } else {
                                var forumPost = createForumPost(data);
                                questListContainer.appendChild(forumPost);
                                questCount++;
                            }
                        }
                    }
                }
            });
            document.getElementById("spanQuestCount").innerHTML = questCount + " questions asked";
        } catch (error) {
            console.error("Error checking key existence:", error);
        }
    }
    