//show nav in phone size
let navIcon = document.querySelector('.nav__icon');
let navCategoryList = document.querySelector('.nav__category__list');

show(navIcon, navCategoryList);



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
