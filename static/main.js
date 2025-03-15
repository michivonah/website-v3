// Add event listeners
document.addEventListener('DOMContentLoaded', function(){
    scrollTopVisibilityUpdate();
    updateNavStyle();
    calculateAge(".age");

    // add eventlistener to language selector
    const languageSelector = document.querySelector(".language-selector");
    languageSelector.addEventListener('change', function(){
        window.location.href = languageSelector.value + window.location.hash;
    });
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
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const actionObject = entry.target.querySelector('.contact-title');
  
      if (entry.isIntersecting) {
        actionObject.classList.add('typewriter-animation');
        return;
      }
  
      actionObject.classList.remove('typewriter-animation');
    });
});
  
observer.observe(document.querySelector('.contact-title-wrapper'));

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