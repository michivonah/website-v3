// Add event listeners
document.addEventListener('DOMContentLoaded', function(){
    scrollTopVisibilityUpdate();
});

window.addEventListener('scroll', function(){
    scrollTopVisibilityUpdate();
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

// scroll top visibility
function scrollTopVisibilityUpdate(){
    const scrollTop = document.querySelector(".scroll-top");
    scrollTop.style.display = ((window.scrollY > 20) ? 'flex' : 'none');
    scrollTop.style.right = ((window.scrollY > 20) ? '0' : '-55px');
}