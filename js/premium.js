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

const user=
JSON.parse(localStorage.getItem("user"));

if(!user){

alert("Please login first.");

location.href="login.html";

return;

}

const response=

await fetch(

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

const data=

await response.json();

if(!data.success){

alert(data.message);

return;

}

const cashfree=

Cashfree({

mode:"sandbox"

});

cashfree.checkout({

paymentSessionId:

data.paymentSessionId,

redirectTarget:"_self"

});

}

loadPlans();