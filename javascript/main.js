// open close menu 

let iconMenu = document.querySelector('.nav__icon');

iconMenu.onclick = () => {

    if (window.innerWidth > 739) {
        //menu
        var menu = document.querySelector('.menu');
        var menuFooter = document.querySelector('.menu-footer');
        var menuContainer = document.querySelector('.menu__container');

        menu.classList.toggle('l-1');
        menu.classList.toggle('m-1');
        menu.classList.toggle('l-2');
        menu.classList.toggle('m-2');

        if (menuFooter.style.display == '' || menuFooter.style.display == 'block') {
            menuFooter.style.display = 'none';
        } else {
            menuFooter.style.display = 'block';
        }

        if (menuContainer.style.textAlign == '') {
            menuContainer.style.textAlign = 'center';
        } else {
            menuContainer.style.textAlign = '';
        }






        //home
        var home = document.querySelector('.home');
        var sliderImg = document.querySelectorAll('.slider-img');

        home.classList.toggle('l-11');
        home.classList.toggle('m-11');
        home.classList.toggle('l-10');
        home.classList.toggle('m-10');

        sliderImg.forEach((e) => {
            if (window.innerWidth > 1024) {
                if (e.style.width == '' || e.style.width == '80vw') {
                    e.style.width = '89vw';
                } else {
                    e.style.width = '80vw';
                }
            }
            // console.log(e.offsetWidth);
        });
    } else {

        var menuContainer = document.querySelector('.menu__container');
        if (menuContainer.style.display == '' || menuContainer.style.display == 'none') {
            menuContainer.style.display = 'block';
        } else {
            menuContainer.style.display = 'none';
        }

    }

}



//slider
let sliderList = document.querySelector('.slider-list');
let sliderItem = document.querySelectorAll('.slider-item');
let sliderDot = document.querySelectorAll('.slider-dot li');
let prev = document.getElementById('button_pre');
let next = document.getElementById('button_next');

let active = 0;
let lengthItems = sliderItem.length - 1;

// next btn
next.onclick = function () {
    if (active + 1 > lengthItems) {
        active = 0;
    } else {
        active++;
    }
    reloadSlider();
}

// prev btn
prev.onclick = function () {
    if (active - 1 < 0) {
        active = lengthItems;
    } else {
        active--;
    }
    reloadSlider();
}

// auto chuyển slider
let refeshSlider = setInterval(() => { next.click() }, 5000);

function reloadSlider() {
    let checkLeft = sliderItem[active].offsetLeft;
    sliderList.style.left = -checkLeft + 'px';

    //lấy dot đang được active (xoá và trở lại bth)
    let lastActiveDot = document.querySelector('.dot-item__active');
    lastActiveDot.classList.remove('dot-item__active');
    lastActiveDot.classList.add('dot-item');

    // lấy dot kế tiếp xoá và thêm active
    sliderDot[active].classList.remove('dot-item');
    sliderDot[active].classList.add('dot-item__active');

    //xoá thời gian đếm auto chuyển slider và gọi lại để đếm lại từ đầu
    clearInterval(refeshSlider);
    refeshSlider = setInterval(() => { next.click() }, 5000)
}

sliderDot.forEach((li, key) => {
    li.addEventListener('click', function () {
        active = key;
        reloadSlider();
    })
})

// //Grabbing slider
// const sliderGrabbing = document.querySelector('.slider-list');

// let isDown = false;
// let startX;
// let scrollLeft;

// sliderGrabbing.addEventListener('mousedown', (e) => {
//     isDown = true;
//     sliderGrabbing.classList.add('active');

//     startX = e.pageX - sliderGrabbing.offsetLeft;
//     scrollLeft = sliderGrabbing.scrollLeft;
// });

// sliderGrabbing.addEventListener('mouseleave', () => {
//     isDown = false;
//     sliderGrabbing.classList.remove('active');
// });

// sliderGrabbing.addEventListener('mouseup', () => {
//     isDown = false;
//     sliderGrabbing.classList.remove('active');
// });

// sliderGrabbing.addEventListener('mousemove', (e) => {
//     //stop when dont grabbing
//     if (!isDown) return;
//     e.preventDefault();
//     const x = e.pageX - sliderGrabbing.offsetLeft;
//     const walk = (x - startX) * 1;
//     sliderGrabbing.scrollLeft = scrollLeft - walk;
// });



//list Game (Show  4 new game )

let gameContainer = document.querySelector('.game__list');
let listGame = `<div class="row">`;
fetch("./javascript/database/gameInfo.json")

    .then(function (response) {
        return response.json();
    })

    .then(function (game) {
        for (var i = 3; i >= 0; i--) {
            listGame += `
                <li class="game__item col l-3 m-3 c-12">
                    <a href="${game[i].url}" class="game__link">
                        <img src="${game[i].img}" alt="">
                    </a>
                </li>
        `;
        }

        listGame += '</div>';
        gameContainer.innerHTML = listGame;
    })


    .catch(function (error) {
        console.error('Error:', error);
    });