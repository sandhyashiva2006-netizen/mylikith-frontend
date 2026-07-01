const API="https://mylikith-backend.onrender.com";

const user=
JSON.parse(localStorage.getItem("user"));

async function loadPlans(){

const res=

await fetch(

`${API}/api/premium/plans`

);

const plans=

await res.json();

const container=

document.getElementById("plans");

container.innerHTML="";

plans.forEach(plan=>{

container.innerHTML+=`

<div class="plan">

<h2>${plan.name}</h2>

<div class="price">

₹${plan.price}

</div>

<p>

${plan.description}

</p>

<p>

${plan.duration_days} Days

</p>

<p>

🎁 ${plan.coins} Bonus Coins

</p>

<button

onclick="buyPlan(${plan.id})"

>

Buy Now

</button>

</div>

`;

});

}

async function buyPlan(planId){

try{

const response=await fetch(

`${API}/api/premium/create-order`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:user.id,

plan_id:planId

})

}

);

console.log("STATUS:",response.status);

const text=await response.text();

console.log("RAW RESPONSE:",text);

alert("Check Console");

}
catch(err){

console.log(err);

}

}

loadPlans();