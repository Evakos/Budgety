// console.log("Reloaded");

// // dom variables
const getFieldSet = document.getElementsByTagName("fieldset");

// declaring the active fieldset & the total fieldset count
let fsInit = 0;
const fieldset = getFieldSet[fsInit];
console.log("Number of fieldsets: " + fieldset);
fieldset.className = "fs-show";

console.log(getFieldSet.length);

// creates and stores a number of bullets
let createBulletDiv = "<div class='wz-bullet'></div>";
const getFieldSetLength = getFieldSet.length;
for (let i = 1; i < getFieldSetLength; ++i) {
  createBulletDiv += "<div class='wz-bullet'></div>";
  console.log(createBulletDiv);
}

// // Insert Bullets
const bulletCont = document.querySelectorAll(".wz-bullet-cont");

console.log("This is the cont div: " + bulletCont);

for (let i = 0; i < bulletCont.length; ++i) {
  let bulletItem = bulletCont[i];
  console.log(bulletItem);
  bulletItem.innerHTML = createBulletDiv;
}

// // removes the first back button & the last next button
document.getElementsByName("back")[0].className = "fs-hide";
document.getElementsByName("next")[bulletCont.length - 1].className = "fs-hide";

// Makes the first dot active
let theBullets = document.getElementsByClassName("wz-bullet");
theBullets[fsInit].className += " wz-bullet-active";

//Validation loop & goes to the next step

document.addEventListener(
  "click",
  function (event) {
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches(".next")) return;
    // Don't follow the link
    event.preventDefault();
    // Log the clicked element in the console
    console.log(event.target);
    console.log("Next Clicked");
    var selection = getFieldSet[fsInit];
    console.log("This is the: " + selection);
    selection.className = "fs-hide";

    fsInit = fsInit + 1;

    console.log(fsInit);

    var selection = getFieldSet[fsInit];
    selection.className = "fs-show";

    var msf_bullets_a = fsInit * getFieldSetLength + fsInit;
    theBullets[msf_bullets_a].className += " wz-bullet-active";
  },
  false
);

// const getNext = getFieldSet.querySelectorAll(".next");

// console.log(getNext);

// console.log(fsInit);

// getNext.addEventListener("click", (event) => {
//   var twat = document.querySelectorAll("fieldset")[fsInit];

//   console.log("Next Clicked");
//   var selection = getFieldSet[fsInit];
//   console.log("This is the: " + selection);
//   selection.className = "fs-hide";

//   fsInit = fsInit + 1;

//   console.log(fsInit);

//   var selection = getFieldSet[fsInit];
//   selection.className = "fs-show";

//   var msf_bullets_a = fsInit * getFieldSetLength + fsInit;
//   theBullets[msf_bullets_a].className += " wz-bullet-active";
// });

document.addEventListener(
  "click",
  function (event) {
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches(".back")) return;
    // Don't follow the link
    event.preventDefault();
    // Log the clicked element in the console
    console.log(event.target);
    console.log("Next Clicked");
    var selection = getFieldSet[fsInit];
    console.log("This is the: " + selection);
    selection.className = "fs-hide";

    fsInit = fsInit - 1;

    console.log(fsInit);

    var selection = getFieldSet[fsInit];
    selection.className = "fs-show";

    var msf_bullets_a = fsInit * getFieldSetLength + fsInit;
    theBullets[msf_bullets_a].className += " wz-bullet-active";
  },
  false
);

// const getPrev = document.querySelector(".back");

// getPrev.addEventListener("click", (event) => {
//   console.log("Back Clicked");
//   var selection = getFieldSet[fsInit];
//   selection.className = "fs-hide";
//   fsInit = fsInit - 1;
//   getFieldSet[fsInit].className = "fs-show";
// });

// function wzNext() {
//   console.log("Next");
//   // goes to the next step

//   // fsInit = fsInit + 1;
//   // let selection = getFieldSet[fsInit];

//   // selection.className = "fs-show";
//   // refreshes the bullet
//   // var msf_bullets_a = msf_form_nr * msf_length + msf_form_nr;
//   // msf_bullets[msf_bullets_a].className += " msf_bullet_active";
// }

// goes one step back
// function msf_btn_back() {
//   msf_getFsTag[msf_form_nr].className = "msf_hide";
//   msf_form_nr = msf_form_nr - 1;
//   msf_getFsTag[msf_form_nr].className = "msf_showhide";
// }

// console.log("loaded");
