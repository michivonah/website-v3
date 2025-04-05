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

// intersection observer for animations
// credits: https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/
function animationOnScroll(triggerSelector, animationClass, targetElement){
    const trigger = document.querySelector(triggerSelector);
    const target = ((targetElement) ? document.querySelector(targetElement) : trigger);

    if(trigger){
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {     
              if (entry.isIntersecting) {
                target.classList.add(animationClass);
              }
              else{
                target.classList.remove(animationClass);
              }
            });
        }, { rootMargin: '0px 0px 5% 0px', threshold: 0.1 });
          
        return observer.observe(trigger);
    }
}

animationOnScroll('.contact-title-wrapper', 'typewriter-animation', '.contact-title');

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