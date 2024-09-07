//show select
let select = document.querySelector('.form__selectContent');
let selectList = document.querySelector('.select__list');


show(select, selectList);


//show nav in phone size
let navIcon = document.querySelector('.nav__icon');
let navCategoryList = document.querySelector('.nav__category__list');

show(navIcon, navCategoryList);


//get select items
let listGame = '';
(function showListGame() {
    fetch("./javascript/database/gameInfo.json")

        .then(function (response) {
            return response.json();
        })

        .then(function (game) {
            var len = game.length;

            for (var i = 0; i < len; i++) {
                listGame += `<div class="select__item" value="${game[i].title}">${game[i].title}</div> `;
            }

            listGame += `<div class="select__item" value="Other">Other</div> `;
            selectList.innerHTML = listGame;
        })

        .then(function (response) {
            changeContent();
        })


        .catch(function (error) {
            console.error('Error:', error);
        });
})()



//Change the content in select
function changeContent() {
    let selectContent = document.querySelector('.form__selectContent span');
    let selectItem = document.querySelectorAll('.select__item');

    selectItem.forEach((e) => {
        e.onclick = () => {
            selectContent.setAttribute('value', e.getAttribute('value'));
            selectContent.innerHTML = `${e.textContent}`;
        }
    });
}





//show hide Function
function show(Click, Effect) {
    Click.onclick = () => {
        if (Effect.style.display == '' || Effect.style.display == 'none') {
            Effect.style.display = 'block';
        } else {
            Effect.style.display = 'none';
        }
    }


    //check if onclick != element before click or child of element
    document.addEventListener('click', (event) => {
        if (Click != event.target && !Click.contains(event.target) && Effect.style.display == 'block') {
            Effect.style.display = 'none';
        }
    })
}


//Survey


//check
(function getInfomation() {


    //information
    let form = document.querySelector('.form');
    let nameSurvey = form.querySelectorAll('input[type ="text"]')[0];
    let email = form.querySelectorAll('input[type ="text"]')[1];
    let detail = form.querySelector('textarea');
    let img = form.querySelectorAll('input[type ="file"]')[0];


    //check null
    nameSurvey.onblur = (e) => {
        checkNullOfFeedback(nameSurvey, 'Name');
    }

    email.onblur = () => {
        // checkNull(email, 'Email');
        checkMail(email);
    }

    detail.onblur = () => {
        checkNullOfFeedback(detail, 'Detail');
    }

    //send information
    let sendBtn = document.querySelector('.form__btn button');
    sendBtn.onclick = () => {
        if (!checkNullOfFeedback(nameSurvey, 'Name') && !checkMail(email) && !checkNullOfFeedback(detail, 'Detail')) {

            //information
            let option = document.querySelector('.form__selectContent span').getAttribute('value');

            const data = {
                option: option,
                name: nameSurvey.value,
                email: email.value,
                detail: detail.value,
                img: img.value,
            };

            postData(data);
            //Show thanks

            let form = document.querySelector('.form');
            form.classList.add('row')


            let formTitle = document.createElement('div');
            formTitle.classList.add('form__title');
            formTitle.classList.add('col');
            formTitle.classList.add('l-12');
            formTitle.classList.add('m-12');
            formTitle.classList.add('c-12');
            formTitle.textContent = 'Thank you for taking our survey!';

            let formDescription = document.createElement('div');
            formDescription.classList.add('form__description');
            formDescription.classList.add('col');
            formDescription.classList.add('l-12');
            formDescription.classList.add('m-12');
            formDescription.classList.add('c-12');
            formDescription.textContent = 'Your input is invaluable and will help us improve our services/products';

            form.innerHTML = '';
            form.appendChild(formTitle);
            form.appendChild(formDescription);
        }

    }




})();

//post Data
async function postData(data) {
    const formData = new FormData();

    formData.append("entry.2079069389", data.option);
    formData.append("entry.859422550", data.name);
    formData.append("entry.1399706665", data.email);
    formData.append("entry.1975445795", data.detail);
    formData.append("entry.387525104", data.img);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSeWhWVr-mxZsf_8mTGikCxElr2luo2bp3xUJ9TbEmf3MNtyfw/formResponse", {
        method: "POST",
        body: formData,
        mode: "no-cors",
    })
}








//function check null
function checkNullOfFeedback(e, type) {
    let formItem = document.querySelectorAll('.form__item');


    //remove  message and validated 
    formItem.forEach((item) => {
        if (item.contains(e) && item.querySelector('.label-message')) {
            item.querySelector('.form__container').classList.remove('validated');
            item.querySelector('.label-message').innerHTML = '';
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
            formItem.forEach((item) => {
                if (item.contains(e)) {
                    item.querySelector('.form__container').classList.add('validated');
                    item.querySelector('.label-message').innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>' + message;
                }
            });
        }

    }

    return message;
};

//check mail

function checkMail(mail) {
    let formItem = document.querySelectorAll('.form__item');
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var message;


    //remove  message and validated 
    formItem.forEach((item) => {
        if (item.contains(mail) && item.querySelector('.label-message')) {
            item.querySelector('.form__container').classList.remove('validated');
            item.querySelector('.label-message').innerHTML = '';
        }
    });

    if (mail.value.match(regex)) {
        message = false;
    }
    else {
        message = 'Invalid email (eg: email@domain.com)';
    }


    //add message and validated 
    if (message) {
        formItem.forEach((item) => {
            if (item.contains(mail)) {
                item.querySelector('.form__container').classList.add('validated');
                item.querySelector('.label-message').innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>' + message;
            }
        });
    }

    return message;
};

