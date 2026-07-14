const API="https://mylikith-backend.onrender.com/api";

const cashfree =
Cashfree({
mode:"sandbox"
});

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

style="width:100%;margin-top:15px;"

onclick="manualPayment(

${pkg.id},

${pkg.price},

${pkg.coins+pkg.bonus_coins}

)">

Buy Coins

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

const res=
await fetch(

`${API}/wallet/create-order`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:JSON.stringify({

user_id:user.id,

package_id:packageId

})

}

);

const data =
await res.json();

console.log("ORDER RESPONSE:", data);

if(!data.success){

    alert("Unable to create order.");

    return;

}

const checkoutOptions={

    paymentSessionId:
    data.paymentSessionId,

    redirectTarget:"_self"

};

console.log("CHECKOUT OPTIONS:", checkoutOptions);

await cashfree.checkout(
    checkoutOptions
);

}catch(err){

console.log(err);

alert("Payment initialization failed.");

}

}

let selectedPackage=null;

function manualPayment(
packageId,
amount,
coins
){

selectedPackage={

packageId,
amount,
coins

};

document.getElementById(
"manualAmount"
).innerText=amount;

document.getElementById(
"manualPaymentModal"
).style.display="flex";

}

document.getElementById(

"closeManualPayment"

).onclick=()=>{

document.getElementById(

"manualPaymentModal"

).style.display="none";

};

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

if(transactionId.length<8){

alert(

"Please enter a valid UPI Transaction ID."

);

return;

}

let screenshot=null;

const file=document.getElementById(
"manualScreenshot"
).files[0];

if(!file){

alert(

"Please upload the payment screenshot."

);

return;

}

if(file){

const formData=new FormData();

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

const uploadData = await upload.json();

if(!uploadData.success){

alert(

uploadData.message||

"Unable to upload screenshot."

);

return;

}

screenshot=uploadData.url;

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

payment_type:"coin",

package_id:selectedPackage.packageId,

transaction_id:transactionId,

screenshot

})

}

);

const data=

await response.json();

alert(data.message);

if(data.success){

document.getElementById(
"manualTransactionId"
).value="";

document.getElementById(
"manualScreenshot"
).value="";

document.getElementById(
"manualPaymentModal"
).style.display="none";

selectedPackage=null;

}

};

