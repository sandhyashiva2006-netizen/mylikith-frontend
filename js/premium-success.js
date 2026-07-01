const API=
"https://mylikith-backend.onrender.com";

const params=
new URLSearchParams(location.search);

const orderId=
params.get("order_id");

const planId=
params.get("plan_id");

const user=
JSON.parse(
localStorage.getItem("user")
);

(async()=>{

const verify=
await fetch(

`${API}/api/premium/verify-payment`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

order_id:orderId,

plan_id:planId,

user_id:user.id

})

}

);

const data=
await verify.json();

if(data.success){

alert(

"Premium Activated Successfully!"

);

location.href=

"premium.html";

}
else{

alert(

data.message

);

location.href=

"premium.html";

}

})();