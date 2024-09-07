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




// list Game 

let gameContainer = document.querySelector('.game__list');
let listGame = `<div class="row">`;
function showListGame() {
    fetch("./javascript/database/gameInfo.json")

        .then(function (response) {
            return response.json();
        })

        .then(function (game) {
            var len = game.length;
            // console.log(len);

            for (var i = 0; i < len; i++) {
                listGame += `
            <li class="game__item col l-2-4 m-4 c-12 ">
                <a href="${game[i].url}" class="game__link">
                    <div class="game__content">
                        <div class="game__img">
                            <img src="${game[i].img}" alt="">
                        </div>
                        <div class="game__name">
                            <img src="${game[i].icon}" alt="">
                            ${game[i].title}
                        </div>
                    </div>
                </a>
            </li>
            `;
            }
            listGame += `</div>`;
            gameContainer.innerHTML = listGame;
        })


        .catch(function (error) {
            console.error('Error:', error);
        });
}

showListGame();


// Search Game
let searchIcon = document.querySelector('.nav__search i');
let searchInput = document.querySelector('.nav__search input');

// hint of Search
searchInput.oninput = (e) => {
    var searchHint = document.querySelector('.nav__search input').value;

    var searchHintContent = searchHint.replace(/[\s-]/g, '').toLowerCase();



    let navHint = document.querySelector('.nav__hint');
    let listGame = "";

    fetch("./javascript/database/gameInfo.json")

        .then(function (response) {
            return response.json();
        })


        .then(function (game) {

            if (searchHintContent) {

                var len = game.length;
                listGame = `<ul class="hint__list">`;

                var ischeckGame = false;
                for (var i = 0; i < len; i++) {

                    var name = game[i].title.replace(/[\s-]/g, '').toLowerCase();


                    if (name === searchHintContent || name.startsWith(searchHintContent)) {
                        ischeckGame = true;

                        listGame += `
                        <li class="hint__item">${game[i].title}</li>                        
                        `;

                    }
                }



                if (ischeckGame) {
                    navHint.style.display = 'block';

                } else {
                    navHint.style.display = 'none';
                }

                listGame += `</ul>`;
                navHint.innerHTML = listGame;
            } else {
                navHint.style.display = 'block';

                listGame = `<ul class="hint__list">`;
                for (var i = 3; i >= 0; i--) {
                    listGame += `
                       <li class="hint__item">${game[i].title}</li>      
                    `;
                }
                listGame += `</ul>`;
                navHint.innerHTML = listGame;


            }

            //onclick to select item
            let hintItem = document.querySelectorAll('.hint__item');
            clickHintItem(hintItem);


            //keydown and up to select item
            var count = 0;
            var selectHint = "";

            searchInput.addEventListener("keydown", function (event) {
                var len = hintItem.length - 1;
                if (event.key === "ArrowDown" || event.keyCode === 40) {

                    hintItem.forEach((e, index) => {
                        if (index == count) {
                            e.style.backgroundColor = '#474C54';
                            selectHint = e.textContent;
                        } else {
                            e.style.backgroundColor = '';
                        }
                    })
                    count = (count >= len) ? 0 : (count + 1);

                    searchInput.addEventListener("keydown", function (event) {
                        if (event.key === "Enter" || event.keyCode === 13) {
                            // get item render to input
                            document.querySelector('.nav__search input').value = selectHint;
                            navHint.style.display = 'none';
                            searchGame(selectHint);
                        }
                    });

                } else if (event.key === "ArrowUp" || event.keyCode === 38) {

                    var len = hintItem.length - 1;

                    hintItem.forEach((e, index) => {
                        if (index == count) {
                            e.style.backgroundColor = '#474C54';
                            selectHint = e.textContent;
                        } else {
                            e.style.backgroundColor = '';
                        }
                    })
                    count = (count <= 0) ? len : (count - 1);

                    searchInput.addEventListener("keydown", function (event) {
                        if (event.key === "Enter" || event.keyCode === 13) {
                            // get item render to input
                            document.querySelector('.nav__search input').value = selectHint;
                            navHint.style.display = 'none';
                            searchGame(selectHint);
                        }
                    });
                } else if (event.key === "Enter" || event.keyCode === 13) {
                    //function Search With Enter

                    // chuối tìm xoá các khoảng và -, chuyển về in thường
                    var searchContent = searchInput.value.replace(/[\s-]/g, '').toLowerCase();

                    searchGame(searchContent);

                }

            });

        })



        .catch(function (error) {
            console.error('Error:', error);
        });




}

// click
searchIcon.onclick = () => {

    // chuối tìm xoá các khoảng và -, chuyển về in thường
    var searchContent = searchInput.value.replace(/[\s-]/g, '').toLowerCase();
    searchGame(searchContent);
};



searchInput.addEventListener("click", function (event) {

    //close when blur out input
    document.addEventListener("click", (e) => {
        if (e.target !== event.target) {
            let navHint = document.querySelector('.nav__hint');
            navHint.style.display = 'none';
        }
    });



});

// Function click hint item to search

function clickHintItem(element) {
    element.forEach((e) => {
        e.onclick = () => {

            // get item render to input
            let navHint = document.querySelector('.nav__hint');

            document.querySelector('.nav__search input').value = e.textContent;
            navHint.style.display = 'none';
            searchGame(e.textContent);

        }

    });
}





//Function search game
function searchGame(searchContent) {
    let listGame = "";

    searchContent = searchContent.replace(/[\s-]/g, '').toLowerCase();
    fetch("./javascript/database/gameInfo.json")

        .then(function (response) {
            return response.json();
        })

        .then(function (game) {
            var len = game.length;
            listGame = `<div class="row">`;

            for (var i = 0; i < len; i++) {

                var name = game[i].title.replace(/[\s-]/g, '').toLowerCase();



                if (name === searchContent || name.startsWith(searchContent)) {
                    listGame += `
                        <li class="game__item col l-2-4 m-4 c-12 ">
                            <a href="${game[i].url}" class="game__link">
                                <div class="game__content">
                                    <div class="game__img">
                                        <img src="${game[i].img}" alt="">
                                    </div>
                                    <div class="game__name">
                                        <img src="${game[i].icon}" alt="">
                                        ${game[i].title}
                                    </div>
                                </div>
                            </a>
                        </li>
                     `;
                }
            }

            if (listGame === `<div class="row">`) {
                listGame += '<div class="game__list--notification">Game not Found!!</div>';
            }
            listGame += `</div>`;
            gameContainer.innerHTML = listGame;
        })

        .catch(function (error) {
            console.error('Error:', error);
        });
};
