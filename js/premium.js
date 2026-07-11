const API="https://mylikith-backend.onrender.com/api";

const cashfree=Cashfree({
mode:"sandbox"
});

const user=
JSON.parse(localStorage.getItem("user"));

async function loadPlans(){

const container = document.getElementById("plans");

if(!user){

container.innerHTML = `

<div class="login-required">

<h2>🔒 Login Required</h2>

<p>

Please login to purchase Premium Membership.

</p>

<a href="login.html" class="btn-primary">

Login

</a>

</div>

`;

return;

} 


const res=

await fetch(

`${API}/premium/plans`

);

const plans=

await res.json();

const status=await fetch(

`${API}/premium/status/${user.id}`

);

const premium=await status.json();

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

${
premium.premium && premium.details.plan_id===plan.id

?

`<button disabled class="active-plan">
✅ Active Plan
</button>`

:

`<button onclick="buyPlan(${plan.id})">
Buy Now
</button>`

}

</div>

`;

});

}

async function buyPlan(planId){

try{

const res=await fetch(

`${API}/premium/create-order`,

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

const data=await res.json();

console.log("ORDER RESPONSE:",data);

if(!data.success){

alert("Unable to create order.");

return;

}

const checkoutOptions={

paymentSessionId:data.paymentSessionId,

redirectTarget:"_self"

};

console.log("CHECKOUT OPTIONS:",checkoutOptions);

await cashfree.checkout(checkoutOptions);

}catch(err){

console.log(err);

alert("Payment initialization failed.");

}

}

loadPlans();