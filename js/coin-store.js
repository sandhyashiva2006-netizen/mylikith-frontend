const API="https://mylikith-backend.onrender.com/api";

const user=
JSON.parse(
localStorage.getItem("user")
);

if(!user){

location.href="login.html";

}

loadPackages();


async function loadPackages(){

try{

const res=await fetch(

`${API}/wallet/packages/list`

);

const packages=
await res.json();

const container=
document.getElementById(
"coinPackages"
);

container.innerHTML="";

packages.forEach(pkg=>{

container.innerHTML+=`

<div class="coin-card">

<h2>

${pkg.name}

</h2>

<div class="coin-price">

₹${pkg.price}

</div>

<div class="coin-total">

🪙 ${pkg.coins+pkg.bonus_coins} Coins

</div>

${
pkg.bonus_coins>0
?

`<p style="color:#00e676;">
+${pkg.bonus_coins} Bonus Coins
</p>`

:

""

}

<button
class="buy-btn"

onclick="buyPackage(${pkg.id})">

Buy Now

</button>

</div>

`;

});

}catch(err){

console.log(err);

}

}


async function buyPackage(packageId){

try{

const res=await fetch(

`${API}/wallet/packages/list`

);

const packages=
await res.json();

const selected=
packages.find(

p=>p.id===packageId

);

if(!selected){

alert("Package not found.");

return;

}

/* Razorpay Integration
   Coming Next */

alert(

`Selected Package

${selected.name}

₹${selected.price}

${selected.coins+selected.bonus_coins} Coins`

);

}catch(err){

console.log(err);

}

}