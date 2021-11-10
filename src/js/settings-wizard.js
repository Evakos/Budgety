//Get all the Fieldsets
const getFieldSet = document.getElementsByTagName("fieldset");

// Declaring the active fieldset & the total fieldset count
let fsInit = 0;
const fieldset = getFieldSet[fsInit];
console.log("Number of fieldsets: " + fieldset);
fieldset.className = "fs-show";

//console.log(getFieldSet.length);

// creates and stores a number of bullets
let createBulletDiv = "<div class='wz-bullet'></div>";
const getFieldSetLength = getFieldSet.length;
for (let i = 1; i < getFieldSetLength; ++i) {
  createBulletDiv += "<div class='wz-bullet'></div>";
  console.log(createBulletDiv);
}

// Insert Bullets
const bulletCont = document.querySelectorAll(".wz-bullet-cont");

//console.log("This is the cont div: " + bulletCont);

for (let i = 0; i < bulletCont.length; ++i) {
  let bulletItem = bulletCont[i];
  //console.log(bulletItem);
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
    //console.log(event.target);
    //console.log("Next Clicked");
    var selection = getFieldSet[fsInit];
    //console.log("This is the: " + selection);
    selection.className = "fs-hide";

    fsInit = fsInit + 1;

    //console.log(fsInit);

    var selection = getFieldSet[fsInit];
    selection.className = "fs-show";

    var msf_bullets_a = fsInit * getFieldSetLength + fsInit;
    theBullets[msf_bullets_a].className += " wz-bullet-active";
  },
  false
);

document.addEventListener(
  "click",
  function (event) {
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches(".back")) return;
    // Don't follow the link
    event.preventDefault();
    // Log the clicked element in the console
    // console.log(event.target);
    // console.log("Next Clicked");
    var selection = getFieldSet[fsInit];
    console.log("This is the: " + selection);
    selection.className = "fs-hide";

    fsInit = fsInit - 1;

    console.log(fsInit);

    var selection = getFieldSet[fsInit];
    selection.className = "fs-show";

    let msf_bullets_a = fsInit * getFieldSetLength + fsInit;
    theBullets[msf_bullets_a].className += " wz-bullet-active";
  },
  false
);

//Handle for submission and DB update
const getForm = document.getElementById("submit");

getForm.addEventListener(
  "click",
  function (e) {
    e.preventDefault();

    //This is getting all the fieldsets and storing them in a const.
    const getFieldSet = document.getElementsByTagName("fieldset");

    for (fieldSet of getFieldSet) {
      //console.log(item);

      let getPeriod = fieldSet.querySelectorAll("[name=period]");
      let getAmount = fieldSet.querySelectorAll("[name=amount]");
      let getCurrency = fieldSet.querySelectorAll("[name=currency]");

      // let period = "";
      // let amount = "";
      // let currency = "";

      //Extract the period
      for (p of getPeriod) {
        if (p.checked) {
          period = p.value;

          console.log("This the period: " + period);
        }
      }
      //Extract the amount
      for (a of getAmount) {
        //console.log(am.value);
        amount = a.value;

        console.log("This the amount: " + amount);
      }
      for (c of getCurrency) {
        currency = c.value;
        console.log("This the currency " + currency);
      }
    }

    // console.log(selectPeriodOut + amount + currency);

    let postBod =
      "period=" + period + "&amount=" + amount + "&currency=" + currency;

    //console.log(postBod);

    fetch("/api/usersmeta", {
      method: "POST",
      body: postBod,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        console.log("Server request was successfully" + res.statusText);

        //return;

        window.location.href = "dashboard.html";
      })
      .catch((err) => {
        err.then((errorData) => {
          //console.dir(errorData);
          window.location.href = "login.html";
          console.log(
            "There was en error on the server side: " + errorData.error
          );
        });
      });
  },
  false
);
