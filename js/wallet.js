const API="https://mylikith-backend.onrender.com/api";

const user=JSON.parse(localStorage.getItem("user"));

if(!user){

location.href="login.html";

}

const userId=user.id;

loadWallet();

loadSummary();

loadTransactions();


async function loadWallet(){

try{

const res=await fetch(

`${API}/wallet/${userId}`

);

const data=await res.json();

document.getElementById("walletBalance").innerText=

"₹"+Number(data.balance).toFixed(2);

document.getElementById("walletCoins").innerText=

data.coins;

}catch(err){

console.log(err);

}

}


async function loadSummary(){

try{

const res=await fetch(

`${API}/wallet/${userId}/summary`

);

const data=await res.json();

document.getElementById("credits").innerText=

"₹"+data.credits;

document.getElementById("debits").innerText=

"₹"+data.debits;

document.getElementById("transactions").innerText=

data.transactions;

}catch(err){

console.log(err);

}

}


async function loadTransactions(){

try{

const res=await fetch(

`${API}/wallet/${userId}/history`

);

const data=await res.json();

const list=document.getElementById("transactionList");

if(data.length===0){

list.innerHTML="<p>No Transactions Yet</p>";

return;

}

list.innerHTML="";

if(!Array.isArray(data)){

    console.error(data);

    document.getElementById("transactionList").innerHTML =
    "<p>Unable to load transactions.</p>";

    return;

}

data.forEach(item=>{

const div=document.createElement("div");

div.className="transaction";

div.innerHTML=`

<div>

<h4>${item.description}</h4>

<small>

${new Date(item.created_at).toLocaleString()}

</small>

</div>

<div class="${
item.type==="Credit"
?
"credit"
:
"debit"
}">

${
item.type==="Credit"
?
"+"
:
"-"
}

₹${item.amount}

</div>

`;

list.appendChild(div);

});

}catch(err){

console.log(err);

}

}


document.getElementById("addMoneyBtn")

.addEventListener(

"click",

()=>{

alert("Coin Purchase Module Coming Next.");

}

);


