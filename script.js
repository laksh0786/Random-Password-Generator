// Random Password Genrator Javascript

//------------------------- Handling slider and the password length---------------------------------------------------//

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]"); 

let passwordLength = 10;  //default value


handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //Anything more --? 
    const min = inputSlider.min; //0
    const max = inputSlider.max; //20

    inputSlider.style.backgroundSize = ( ((passwordLength - min) * 100) / (max - min) )+ "% 100%";

} 

inputSlider.addEventListener("input" , (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})


//------------------------------------Calculating Strength and Strength Indicator of Password-------------------------//


const indicator = document.querySelector("[data-indicator]");
// console.log(indicator); 

const setIndicator = (color)=>{
    indicator.style.backgroundColor = color;
    //shadow -- ????
    //Bos shadow ------   `offset-x | offset-y | blur-radius | spread-radius | color`

    indicator.style.boxShadow = `0 0 12px 1px ${color} `;
}

//Set strength circle to grey
setIndicator("#ccc");


// calculating Strength of password

function calStrength(){
    
    const lower = document.querySelector("#lowercase").checked ? true : false ;
    const upper = document.querySelector("#uppercase").checked ? true : false ;
    const numbers = document.querySelector("#numbers").checked ? true : false ;
    const symbol = document.querySelector("#symbols").checked ? true : false ;

    if(lower && upper && (numbers || symbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if ( (lower || upper) && (numbers || symbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}



// ----------------------------------------Copy Content---------------------------------------------------------------//


// navigator.clipboard.writeText() to copy text to clipboard and is asynchronous function so we need to use async await
// to use it in a function we need to make the function async and then use await before the function call

const passwordDisplay = document.querySelector("#passwordDisplay");
const copyMsg = document.querySelector("[data-copyMsg]"); 
const copyBtn = document.querySelector("[data-copyBtn]");

async function  copyContent(){
   
    try{
        await  navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";

    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    //to make the message apper in copyMsg span we need to add active class to it
    copyMsg.classList.add("active");

    //to remove the active class after 2 seconds
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    } , 2000)

}

copyBtn.addEventListener("click" , ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});



//------------------------Checking How many check boxes are checked---------------------------------------//


let checkCount = 1 ;

//-------Looking for how many checkboxes are checked and generate password only when count>0

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

function checkBoxHandler(){
    
    checkCount = 0;

    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked==true){
            checkCount++;
        }
    })
    // console.log(checkCount);

    //If checkCount is greater than passwordLength then passwordLength is updated to checkCount

    if(checkCount  > passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }
    

}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change" , checkBoxHandler);
})

//-------------------------------Get Random Character Number And Symbols-----------------------------------------------//


const symbols = "!@#$%^&*()_+{}[];':,./<>?`~";

function getRandomInteger(min , max){

    return Math.floor(Math.random()*(max-min)) + min ; 

}

function generateNumber(){
    return getRandomInteger(0 , 9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97 , 122));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65 , 90));
}

function generateSymbol(){
    // console.log( symbols[getRandomInteger(0 , symbols.length)] ) ;
    return( symbols[getRandomInteger(0 , symbols.length)] ) ;
}


//-----------------------------------------Generate Password-----------------------------------------------------//

const generateBtn = document.querySelector(".generateBtn");
let password = passwordDisplay.value;

function shufflePassword(password){

    //Algorithm to shuffle password --> Fisher-Yates Algorithm

    for(let i=password.length-1 ; i>0 ; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }

    let str="";
    password.forEach((char)=>{
        str += char;
     })
    //str=password.join("");

    // console.log(str);
    return str;

}

generateBtn.addEventListener("click" , function(){

    //if no check box is checked then return
    console.log(passwordDisplay)

    if(checkCount == 0){
        // passwordDisplay.setAttribute( "placeholder" , "Select atleast one option");
        passwordDisplay.placeholder="Select atleast one option"
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //New password generate
    
    password = "";

    
    const lowinp = document.getElementById("lowercase");
    const uppinp = document.getElementById("uppercase");
    const numinp = document.getElementById("numbers");
    const syminp = document.getElementById("symbols");

    // console.log(lowinp , uppinp , numinp , syminp);

    const selBoxGeneratorFunction = [];
    
    if(lowinp.checked){
        selBoxGeneratorFunction.push(generateLowercase);
    }

    if(uppinp.checked){
        selBoxGeneratorFunction.push(generateUppercase);
    }

    if(numinp.checked){
        selBoxGeneratorFunction.push(generateNumber);
    }

    if(syminp.checked){
        selBoxGeneratorFunction.push(generateSymbol);
    }

    //firstly putting all the checked boxes once in the password
    selBoxGeneratorFunction.forEach((box)=>{
        // password = password + box();
        password += box();
    })

    for(let i=0 ; i<passwordLength - selBoxGeneratorFunction.length ; i++){
        let randomInt  = getRandomInteger(0 , selBoxGeneratorFunction.length);
        // console.log(randomInt);
        password += selBoxGeneratorFunction[randomInt]();
    }

    //Shuffle the password
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    //Calculate Strength
    calStrength();

})
