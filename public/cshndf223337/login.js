// Updated arrays for sample data
const firstNames = [
    'Chinedu', 'Ngozi', 'Emeka', 'Chioma', 'Ifeanyi', // Igbo
    'Adeola', 'Olumide', 'Folake', 'Adebayo', 'Toyin', // Yoruba
    'Aminu', 'Fatima', 'Usman', 'Zainab', 'Mohammed' // Hausa
];

const middleNames = [
    'Chukwuemeka', 'Ifeoma', 'Nkemdilim', 'Chinonso', 'Nnenna', // Igbo
    'Oluwaseun', 'Bolanle', 'Ayotunde', 'Temidayo', 'Adefolake', // Yoruba
    'Yusuf', 'Suleiman', 'Hajara', 'Ibrahim', 'Maimuna' // Hausa
];

const lastNames = [
    'Okafor', 'Eze', 'Nwachukwu', 'Obi', 'Iroegbu', // Igbo
    'Adegbite', 'Ogunleye', 'Olatunji', 'Akinbode', 'Ojo', // Yoruba
    'Bello', 'Abdullahi', 'Aliyu', 'Datti', 'Giwa' // Hausa
];

const staffCategories = ['academic', 'administrative', 'technical', 'library'];

const academicRanks = ['Assistant Lecturer', 'Lecturer II', 'Lecturer I', 'Senior Lecturer', 'Principal Lecturer'];
const administrativeRanks = ['Administrative Officer', 'Clerk', 'Secretary', 'Accountant'];
const technicalRanks = ['Technologist', 'Lab Technician', 'Workshop Supervisor'];
const libraryRanks = ['Librarian', 'Assistant Librarian', 'Library Assistant'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomEmail(firstName, lastName) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@fedpoffa.edu.ng`;
}
 
function generateRandomStaffInfo() {
    const firstName = getRandomItem(firstNames);
    const middleName = getRandomItem(middleNames);
    const lastName = getRandomItem(lastNames);
    const staffCategory = getRandomItem(staffCategories);
    let staffRank;

    switch (staffCategory) {
        case 'academic':
            staffRank = getRandomItem(academicRanks);
            break;
        case 'administrative':
            staffRank = getRandomItem(administrativeRanks);
            break;
        case 'technical':
            staffRank = getRandomItem(technicalRanks);
            break;
        case 'library':
            staffRank = getRandomItem(libraryRanks);
            break;
        default:
            staffRank = 'Unknown';
    }

    const staffEmail = generateRandomEmail(firstName, lastName);
    const staffPassword = staffEmail.split("@")[0];

    return { firstName, middleName, lastName, staffCategory, staffRank, staffEmail, staffPassword };
}

function registerStaffAccount() {
    const staff = generateRandomStaffInfo();

    firebase.auth().createUserWithEmailAndPassword(staff.staffEmail, staff.staffPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            // Add user info to Firestore
            return firebase.firestore().collection('staff').doc(user.uid)
                .set({
                    firstName: staff.firstName,
                    middleName: staff.middleName,
                    lastName: staff.lastName,
                    staffCategory: staff.staffCategory,
                    staffRank: staff.staffRank,
                    staffEmail: staff.staffEmail,
                });
        })
        .then(() => {
            console.log(`Staff ${staff.firstName} ${staff.lastName} successfully added!`);
        })
        .catch((error) => {
            console.error('Error: ' + error.message);
        });
}

let count = 0;
const totalStaff = 20; // Number of staff accounts to register
const interval = 5000; // Interval in milliseconds (10 seconds)

function startReg() {
    const intervalId = setInterval(() => {
        if (count < totalStaff) {
            registerStaffAccount();
            count++;
        } else {
            clearInterval(intervalId); // Stop the interval once all accounts are registered
            console.log('All staff accounts registered.');
        }
    }, interval);
}

//startReg();





document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var userObj = userCredential.user;
            sessionStorage.setItem("current_user_cshndf223337", JSON.stringify(userObj));
            firebase.firestore().collection('users').doc(userObj.uid).get().then(function (doc) {
                if (doc.exists) {
                    var userData = doc.data();
                    Swal.fire('Login successful!');
                    // Redirect to dashboard
                    if (userData.staffCategory)
                        window.location.href = `staff-info.html?id=${userObj.uid}`;
                    else window.location.href = 'dashboard.html';
                } else {
                    console.log(userObj.uid);
                    firebase.firestore().collection('staff').doc(userObj.uid).get().then(function (doc2) {
                        if (doc2.exists) {
                            var staffData = doc2.data();
                            Swal.fire('Login successful!');
                            // Redirect to dashboard
                            if (staffData.staffCategory)
                                window.location.href = `staff-info.html?id=${userObj.uid}`;
                            else window.location.href = 'dashboard.html';
                        } else {
                            Swal.fire('Error trying to login');
                        }
                    }).catch(function (error) {
                        Swal.fire('Error getting document:', error);
                    });
                }
            }).catch(function (error) {
                Swal.fire('Error getting document:', error);
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Swal.fire('Error: ' + errorMessage);
        });
});
sessionStorage.removeItem("current_user_cshndf223337");