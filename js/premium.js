const API = "https://mylikith-backend.onrender.com";


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

`${API}/api/premium/plans`

);

const plans=

await res.json();

const status=await fetch(

`${API}/api/premium/status/${user.id}`

);

const premium=await status.json();


container.innerHTML="";

plans.forEach(plan=>{

    const badge =
        plan.duration_days === 365
            ? `<div class="premium-badge">⭐ Best Value</div>`
            : "";

    container.innerHTML+=`

<div class="plan">

    ${badge}

<h2>${plan.name}</h2>

<div class="price">

₹${plan.price}

</div>

<p>

${plan.description}

</p>

<p>

${plan.duration_days} Days Premium Access

</p>



${
premium.premium && premium.details.plan_id===plan.id

?

`<button disabled class="active-plan">
👑 Current Plan
</button>`

:

`<button onclick="manualPremiumPayment(
    ${plan.id},
    ${plan.price}
)">

Subscribe Now

</button>`

}

</div>

`;

});

}

async function buyPlan(planId){

try{

const res=await fetch(

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

let selectedPremiumPlan=null;

function manualPremiumPayment(

    planId,

    amount

){

selectedPremiumPlan={

planId,

amount

};

document.getElementById(

"manualAmount"

).innerText=amount;

document.getElementById(

"manualPaymentModal"

).style.display="flex";

}

document.getElementById(

"submitManualPayment"

).onclick=

async()=>{

const transactionId=

document.getElementById(

"manualTransactionId"

).value.trim();

if(!transactionId){

alert(

"Please enter UPI Transaction ID."

);

return;

}

const file=

document.getElementById(

"manualScreenshot"

).files[0];

if(!file){

alert(

"Please upload payment screenshot."

);

return;

}

const formData=

new FormData();

formData.append(

"payment",

file

);

const upload = await fetch(
    `${API}/payment/upload`,
    {
        method: "POST",

        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },

        body: formData
    }
);

const uploadData=

await upload.json();

if(!uploadData.success){

alert(

uploadData.message

);

return;

}

const response=

await fetch(

`${API}/manual-payments/submit`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:

"Bearer "+

localStorage.getItem("token")

},

body:JSON.stringify({

payment_type:"premium",

plan_id:selectedPremiumPlan.planId,

transaction_id:transactionId,

screenshot:uploadData.url

})

}

);

const data=

await response.json();

alert(data.message);

if(data.success){

document.getElementById(

"manualPaymentModal"

).style.display="none";

document.getElementById(

"manualTransactionId"

).value="";

document.getElementById(

"manualScreenshot"

).value="";

selectedPremiumPlan=null;

}

};

