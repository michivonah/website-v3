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

    const container = document.createElement("div");
    container.classList = "project-card fade-up";
    container.classList.add(category);
    //container.style.animation = "fade-up var(--baseDuration) linear";
    //container.style.backgroundImage = `url(${image})`;

    const cardFirst = document.createElement("div");
    cardFirst.classList = "card-first";
    const emptyText = document.createElement("p");
    cardFirst.appendChild(emptyText);
    const cardImage = document.createElement("img");
    cardImage.src = image;
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

    container.appendChild(cardFirst);
    container.appendChild(cardSecond);

    return container;
}

async function loadMoreContent(wrapperSelector, amount, endpoint = "https://api.michivonah.ch", btnSelector = ".project-load-btn"){
    const wrapper =  document.querySelector(wrapperSelector);
    const page = ((wrapper.childElementCount <= 0) ? 1 : (wrapper.childElementCount / amount) + 1);

    // just for debugging purposes
    //console.log(`children: ${wrapper.childElementCount} limit: ${amount} page: ${page}`);

    // error validation -> only load more content when page num is valid
    if (page % 1 == 0){
        await showProjects('.project-list', await loadContent(endpoint, amount, page));
    }
    else{
        // hide button if no more content is available
        //if (event.target.tagName == "BUTTON") event.target.style.display = "none";
        document.querySelector(btnSelector).style.opacity = 0;
    }
    
}