//Open - Close form
let signInBtn = document.querySelector('.nav__signInBtn button');
let authenticationContainer = document.querySelector('.authentication__container');
let authenticationLogin = document.querySelector('.authentication__login');


show(signInBtn, authenticationContainer, authenticationContainer);



//Show Hide password
let iconEye = document.querySelectorAll('.authentication__iconEye');
let inputPass = document.querySelectorAll('input[type ="password"]');


iconEye.forEach((e, index) => {
    var isCheck = true;
    e.onclick = () => {
        e.classList.toggle('fa-eye');
        if (isCheck) {
            inputPass[index].type = 'text';
            isCheck = false;
        } else {
            inputPass[index].type = 'password';
            isCheck = true;
        }
    }
});

//change between Login/Register
let changeElement = document.querySelectorAll('.authentication__footer a');
let authenticationRegister = document.querySelector('.authentication__register');

changeElement.forEach((e) => e.onclick = () => {
    if (authenticationRegister.style.display == '' || authenticationRegister.style.display == 'none') {

        authenticationLogin.classList.add('slideOutLeft');
        authenticationRegister.classList.remove('slideOutRight');

        //give time to add animation
        setTimeout(() => {
            authenticationRegister.style.display = 'block';
            authenticationLogin.style.display = 'none';
        }, 100);



    } else {

        authenticationRegister.classList.add('slideOutRight');
        authenticationLogin.classList.remove('slideOutLeft');

        //give time to add animation
        setTimeout(() => {
            authenticationLogin.style.display = 'block';
            authenticationRegister.style.display = 'none';
        }, 100);


    }
});



//get Login and register


//check
(function getInfomation() {


    //information
    let textInput = authenticationContainer.querySelectorAll('input[type ="text"]');
    let password = authenticationContainer.querySelectorAll('input[type ="password"]');


    //check name
    textInput.forEach((e, index) => {
        if (index != 1) {
            e.onblur = () => {
                checkNull(e, 'username');
            }
        } else {
            e.onblur = () => {
                checkNull(e, 'name');
            }
        }

    });

    //check password
    password.forEach((e, index) => {
        e.onblur = () => {
            checkNull(e, 'password');
        }

    });


    //register 
    let registerBtn = authenticationRegister.querySelector('.register__btn button');
    let nameRegister = authenticationRegister.querySelectorAll('input[type ="text"]')[1];
    let usernameRegister = authenticationRegister.querySelectorAll('input[type ="text"]')[2];
    let passwordRegister = authenticationRegister.querySelectorAll('input[type ="password"]')[1];

    registerBtn.onclick = () => {
        if (!checkNull(nameRegister, 'Name') && !checkNull(usernameRegister, 'Name') && !checkNull(passwordRegister, 'password')) {

            // console.log(nameRegister.value);
            // console.log(usernameRegister.value);
            // console.log(passwordRegister.value);

            //information

            const data = {
                name: nameRegister.value,
                username: usernameRegister.value,
                password: passwordRegister.value,
            };
            postData(data);

            toast({
                title: 'Registered successful',
                message: 'Login to experience the features',
                type: 'Success',
                duration: 5000
            })

            setTimeout(() => {
                authenticationContainer.style.display = 'none';
            }, 2000);

        } else {
            toast({
                title: 'Registered fail',
                message: 'The server may be experiencing an error. Please try again',
                type: 'Error',
                duration: 5000
            })
        }

    }



    //Login 
    let loginBtn = document.querySelector('.login__btn button');

    let usernameLogin = authenticationLogin.querySelectorAll('input[type ="text"]')[0];
    let passwordLogin = authenticationLogin.querySelectorAll('input[type ="password"]')[0];

    loginBtn.onclick = () => {

        // console.log(loginBtn);
        // console.log(usernameLogin);
        // console.log(passwordLogin.value);
        if (!checkNull(usernameLogin, 'Name') && !checkNull(passwordLogin, 'Password')) {

            fetch("https://script.google.com/macros/s/AKfycby9h73P713wl8d8TZqjr9Y9r51ADBpO6Wmu-WqPpYOZHYhugnNMfCvoNHVtwS_tqGF_/exec")

                .then(function (response) {
                    return response.json();
                })

                .then(function (user) {

                    var isCheck = false;
                    var name = "";
                    var username = "";
                    var len = user.data.length;
                    for (var i = 0; i < len; i++) {

                        if (user.data[i].Username == usernameLogin.value && user.data[i].Password == passwordLogin.value) {
                            isCheck = true;
                            name = user.data[i].Name;
                            username = user.data[i].Username;
                            break;
                        }
                    }

                    if (isCheck) {
                        toast({
                            title: 'Login success',
                            message: 'You can now use the features on the page',
                            type: 'Success',
                            duration: 5000
                        })

                        setTimeout(() => {
                            authenticationContainer.style.display = 'none';
                        }, 2000);

                        //cookie(set cookie to store 8 days)
                        const date = new Date();
                        date.setTime(date.getTime() + (8 * 24 * 60 * 60 * 1000));
                        expires = "; expires=" + date.toUTCString();

                        document.cookie = "gameVerse" + "=" + name + "-" + username + expires + "; path=/";


                        userCookie();

                    } else {
                        toast({
                            title: 'Login fail',
                            message: 'Your password or username is incorrect',
                            type: 'Error',
                            duration: 5000
                        })
                    }


                })

                .catch(function (error) {
                    console.error('Error:', error);
                });
        }
    }








})();


//Check user exist in cookie

function userCookie() {

    let navUser = document.querySelector('.nav__user');

    if (document.cookie.indexOf("gameVerse=") !== -1) {
        var cookie = document.cookie.split(/=|-/);
        var name = cookie[1];
        var username = cookie[2];


        navUser.innerHTML = `
            <div class="userNav">
                <i class="fa-solid fa-circle-user userNav__icon"></i>
                <div class="userNav__container">

                    <div class="userNav__info">
                        <i class="fa-solid fa-circle-user"></i>
                        <span>
                            <div class="userNav__name">Hello,${name}</div>
                            <div class="userNav__username">#${username}</div>
                        </span>
                        <div class="userNav__exit">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>

                    <div class="userNav__list">

                        <div class="userNav__item">
                            <a href="./Feedback_page.html" class="userNav__link">Friends</a>
                        </div>

                        <div class="userNav__item">
                            <a href="./Feedback_page.html" class="userNav__link">Feedback</a>
                        </div>
                    </div>

                    <div class="userNav__button">
                        <button>Sign out</button>
                    </div>

                </div>
            </div>
        `;


        showUser();
    }


};

userCookie();



// User open - close
function showUser() {

    let userNavIcon = document.querySelector('.userNav__icon');
    let userNavContainer = document.querySelector('.userNav__container');
    let userNavExit = document.querySelector('.userNav__exit i');

    userNavIcon.onclick = () => {
        userNavContainer.style.display = 'block';
    }

    userNavExit.onclick = () => {
        userNavContainer.style.display = 'none';
    }

    let signOutBtn = document.querySelector('.userNav__button button');


    // sign Out User
    signOutBtn.onclick = () => {
        if (document.cookie.indexOf("gameVerse=") !== -1) {
            document.cookie = "gameVerse=; expires=Thu, 01 Jan 1999 00:00:00 UTC; path=/;";

            let navUser = document.querySelector('.nav__user');
            navUser.innerHTML = `
                <div class="nav__signInBtn">
                    <button>Sign In</button>
                </div>
            `;

            //when render again set for Open - Close form
            let signInBtn = document.querySelector('.nav__signInBtn button');
            let authenticationContainer = document.querySelector('.authentication__container');
            let authenticationLogin = document.querySelector('.authentication__login');


            show(signInBtn, authenticationContainer, authenticationContainer);
        }
    }
}




//post Data of register
async function postData(data) {
    const formData = new FormData();

    formData.append("entry.639326645", data.name);
    formData.append("entry.1079806058", data.username);
    formData.append("entry.1904755020", data.password);


    fetch("https://docs.google.com/forms/d/e/1FAIpQLSe4Y8DSXG_li5mJcjUG7UPqIBJERrHTE2_hjSQmBK1c7xAJ_w/formResponse", {
        method: "POST",
        body: formData,
        mode: "no-cors",
    })
}

// Toast Function

function toast({
    title = '',
    message = '',
    type = 'Info',
    duration = 3000
}) {
    const main = document.querySelector('.toast__container');
    if (main) {
        const toast = document.createElement('div');

        //Auto remove toast
        const autoRemoveId = setTimeout(() => {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when click
        toast.onclick = (e) => {
            console.log(e.target);
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            Success: "fa-solid fa-circle-check",
            Info: "fa-solid  fa-circle-info",
            Warning: "fa-solid fa-triangle-exclamation",
            Error: "fa-solid fa-triangle-exclamation"
        };

        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInRight ease 0.3s, fadeOut linear 1s ${delay}s forwards`;
        toast.innerHTML = `
            <div class="toast__icon" >
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-x"></i>
            </div>
        `;
        main.appendChild(toast);


    }
};



//function check null
function checkNull(e, type) {

    let authenticationItem = document.querySelectorAll('.authentication__item');
    let authenticationInputContainer = document.querySelectorAll('.authentication__inputContainer');

    //remove  message and validated 
    authenticationItem.forEach((item) => {
        if (item.contains(e) && item.querySelector('.label-message')) {
            item.querySelector('.authentication__inputContainer').classList.remove('validated');
            item.querySelector('.label-message').remove();
        }
    });

    var message;
    if (e) {
        if (e.value == null || e.value == '') {
            message = 'Please enter ' + type;
        } else {
            message = false;
        }



        //add message and validated 
        if (message) {
            var labelMessage = document.createElement('label');

            authenticationInputContainer.forEach((item) => {

                if (item.contains(e)) {
                    item.classList.add('validated');
                }
            });


            labelMessage.classList.add('label-message');
            labelMessage.innerHTML = '<i class="authentication__iconValidated fa-solid fa-triangle-exclamation"></i>' + message;


            authenticationItem.forEach((item) => {
                if (item.contains(e)) {
                    item.appendChild(labelMessage);
                }
            });
        }

    }

    return message;
};





//show hide Function
/**
 * Click : object that click
 * Effect : object that show or hide
 * hideEffect : object that when click to hide of object
*/
function show(Click, Effect, hideEffect) {
    Click.onclick = () => {
        if (Effect.style.display == '' || Effect.style.display == 'none') {
            Effect.style.display = 'flex';
        } else {
            Effect.style.display = 'none';
        }

    }

    //check if onclick != element before click or child of element
    document.onclick = (event) => {
        if (hideEffect == event.target) {
            Effect.style.display = 'none';
        }
    }
}




