// Add event listeners
document.addEventListener('DOMContentLoaded', async function(){
    scrollTopVisibilityUpdate();
    updateNavStyle();
    calculateAge(".age");

    // add eventlistener to language selector
    const languageSelector = document.querySelector(".language-selector");
    languageSelector.addEventListener('change', function(){
        window.location.href = languageSelector.value + window.location.hash;
    });

    // load projects
    loadMoreContent('.project-list', 6);

    // hide loader
    /*const loader = document.querySelector('.loadingscreen');
    loader.classList.add('fade-out-no-scale');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 250);*/

    console.log(
        "                                                                \n" +
        "  __  __ _      _     _                                   _     \n" +
        " |  \\/  (_)    | |   (_)                            /\\   | |    \n" +
        " | \\  / |_  ___| |__  _    __   _____  _ __        /  \\  | |__  \n" +
        " | |\\/| | |/ __| '_ \\| |   \\ \\ / / _ \\| '_ \\      / /\\ \\ | '_ \\ \n" +
        " | |  | | | (__| | | | |    \\ V / (_) | | | |    / ____ \\| | | |\n" +
        " |_|  |_|_|\\___|_| |_|_|     \\_/ \\___/|_| |_|   /_/    \\_\\_| |_|\n" +
        "                                                                \n" +
        "                    Website V3 - michivonah.ch                  \n" +
        "                                                                \n"
    );
});

window.addEventListener('scroll', function(){
    scrollTopVisibilityUpdate();
    updateNavStyle();
});

document.querySelector(".nav-toggle").addEventListener('click', function(){
    toggleNav();
});

document.querySelectorAll(".nav-links a").forEach(element => {
    element.addEventListener('click', function(){
        toggleNav();
    });
});

document.querySelector(".project-load-btn").addEventListener('click', function(){
    loadMoreContent('.project-list', 3);
});

document.querySelector(".copyright .close-modal-btn").addEventListener('click', function(){
    toggleClass(".copyright", "fade-in-no-scale-flex");
    toggleClass(".copyright", "fade-out-no-scale");
});

document.querySelector(".copyright-modal-link").addEventListener('click', function(){
    const copyrightModal = document.querySelector(".copyright");
    copyrightModal.classList.remove("hidden");
    copyrightModal.classList.remove("fade-out-no-scale");
    copyrightModal.classList.add("fade-in-no-scale-flex");
});

// Generic functions
function toggleDisplayByClass(className, displayType){
    let items = document.getElementsByClassName(className);
    for (const item of items){
        item.style.display = ((item.style.display == "none") ? displayType : 'none');
    }
}

function toggleClass(obj, className){
    document.querySelector(obj).classList.toggle(className);
}

function switchClasses(selector, class1, class2){
    obj = document.querySelector(selector);
    obj.classList.toggle(class1);
    obj.classList.toggle(class2, !obj.classList.contains(class1));
}

// Nav functions
function toggleNav(){
    toggleClass("nav", "open");
    switchClasses(".nav-toggle i", "ai-text-align-right", "ai-cross");
}

// class toggle on scroll
function scrollTopVisibilityUpdate(){
    const scrollTop = document.querySelector(".scroll-top");
    scrollTop.style.display = ((window.scrollY > 20) ? 'flex' : 'none');
    scrollTop.style.right = ((window.scrollY > 20) ? '0' : '-55px');
}

function updateNavStyle(){
    document.querySelector("nav").classList.toggle("small", window.scrollY > 20);
}

/**
 * Template for easily creating a IntersectionObserver
 * @param {*} triggerElement Element which triggers the IntersectionObserver
 * @param {*} callback Function which gets interesction object back
 * @param {*} rootMargin Parameter rootMargin of the IntersectionObserver
 * @param {*} threshold  Parameter threshold of the IntersectionObserver
 * @returns IntersectionObserver
 */
function createIntersectionObserver(triggerElement, callback, rootMargin = '0px 0px 5% 0px', threshold = 0.1){
    if(triggerElement){
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {     
              callback(entry);
            });
        }, { rootMargin, threshold });
        return observer.observe(triggerElement);
    }
}

/**
 * Function which applies an IntersectionObserver
 * for running animations on scroll/visibility of a container.
 * 
 * Original inspiration: https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/
 * @param {*} triggerSelector Query selector of the element, which should trigger the animation
 * @param {*} animationClass Class to append when animation is triggered
 * @param {*} targetElement Element to apply the animation (css class) to. Will applied to triggerSelector if not defined.
 * @returns IntersectionObserver
 */
function animationOnScroll(triggerSelector, animationClass, targetElement){
    const trigger = document.querySelector(triggerSelector);
    const target = ((targetElement) ? document.querySelector(targetElement) : trigger);

    return createIntersectionObserver(trigger, (entry) => {
        entry.isIntersecting ? target.classList.add(animationClass) : target.classList.remove(animationClass);
    });
}

/**
 * Creates IntersectionObserver for triggering counter animation
 * @param {*} elementSelector Selector of the element(s) to apply the counter effect to
 * @param {*} cssPropertyName CSS Property with counter's value
 * @param {*} valueAttribute HTML data attribute with the counter's final value
 */
function countOnScroll(elementSelector, cssPropertyName, valueAttribute){
    const items = document.querySelectorAll(elementSelector);

    items.forEach(element => {
        const value = parseInt(element.getAttribute(valueAttribute));

        createIntersectionObserver(element, (entry) => {
            element.style.setProperty(cssPropertyName, entry.isIntersecting  ? value : 0);
        });
    });
}

// apply on scroll effects
animationOnScroll('.contact-title-wrapper', 'typewriter-animation', '.contact-title');
countOnScroll('.fact-counter', '--factCounter', 'data-count');

// calculate age
function calculateAge(selector){
    const obj = document.querySelector(selector);
    const birthdate = obj.getAttribute("data-birthdate").split(",");
    const birth = new Date(birthdate[2], birthdate[1] - 1, birthdate[0]);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    obj.textContent = age;
}

// tag filtering
document.querySelectorAll(".tag-checkbox").forEach(element => {
    element.addEventListener("change", function(){
        showSelectedProjects(element.value, element.checked);
    });
});

function showSelectedProjects(category, show = true, noProjectSelector = '.no-projects'){
    if(category){
        document.querySelectorAll(`.${category}`).forEach(project => {
            project.classList.toggle("hidden", !show);
        });
        // show message when no project is available
        document.querySelector(noProjectSelector).classList.toggle('hidden', document.querySelector('.project-card:not(.hidden)'));
    }
    else{
        console.error("func showSelectedProjects(): Missing category name.");
    }
}

function isCategoryEnabled(category){
    return document.querySelector(`#tag-${category}`).checked;
}

// load projects from api
// content api: https://api.michivonah.ch/?limit=8&page=1
async function loadContent(endpoint = "https://api.michivonah.ch", limit = 6, page = 1){
    try{
        constRequestUrl = `${endpoint}/?limit=${limit}&page=${page}`;
        const response = await fetch(constRequestUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
    catch(error){
        return console.error({"message":error});
    }
}

// add projects to page
async function showProjects(wrapperSelector, data){
    const wrapper =  document.querySelector(wrapperSelector);

    for (const project of data){
        wrapper.append(await getProjectCard(project));
    }
}

// create project card
async function getProjectCard(data){
    const title = data.title;
    const url = data.url;
    const image = data.image;
    const date = data.date;
    const icon = data.icon;
    const category = data.category;

    const dateFormatted = new Date(date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    const link = document.createElement("a");
    link.href = url;
    link.title = title;
    link.alt = title;

    const container = document.createElement("div");
    container.classList = "project-card fade-up";
    container.classList.add(category);
    if(!isCategoryEnabled(category)) container.classList.add("hidden");
    //container.style.animation = "fade-up var(--baseDuration) linear";

    const cardFirst = document.createElement("div");
    cardFirst.classList = "card-first";
    const cardImage = document.createElement("img");
    cardImage.src = image;
    cardImage.alt = title;
    cardImage.title = title;
    cardFirst.appendChild(cardImage);

    const cardSecond = document.createElement("div");
    cardSecond.classList = "card-second";
    const cardIcon = document.createElement("i");
    cardIcon.classList = icon;
    const cardTitle = document.createElement("h2");
    cardTitle.textContent = title;
    const cardDate = document.createElement("p");
    cardDate.textContent = dateFormatted;
    cardSecond.appendChild(cardIcon);
    cardSecond.appendChild(cardTitle);
    cardSecond.appendChild(cardDate);

    link.appendChild(cardFirst);
    link.appendChild(cardSecond);
    container.appendChild(link);

    return container;
}

async function loadMoreContent(wrapperSelector, amount, endpoint = "https://api.michivonah.ch", btnSelector = ".project-load-btn"){
    const wrapper =  document.querySelector(wrapperSelector);
    const page = ((wrapper.childElementCount <= 0) ? 1 : (wrapper.childElementCount / amount) + 1);
    const loader = document.querySelector('.project-loader-wrapper');

    // just for debugging purposes
    //console.log(`children: ${wrapper.childElementCount} limit: ${amount} page: ${page}`);

    const hideLoadMoreButton = () => {
        document.querySelector(btnSelector).classList.add('hidden');
    };

    // error validation -> only load more content when page num is valid
    if (page % 1 == 0){
        loader.classList.remove('hidden');
        const content = await loadContent(endpoint, amount, page);
        if(Array.isArray(content) && content.length === 0){
            console.log("No more projects available");
            // hide button if no more content is available
            hideLoadMoreButton();
        }
        else{
            // show projects
            await showProjects('.project-list', content);
        }
        loader.classList.add('hidden');
    }
    else{
        // hide button if no more content is available
        hideLoadMoreButton();
    }
}