const API = "https://mylikith-backend.onrender.com";

loadPayments();

async function loadPayments() {

    try {

        const response = await adminFetch(
            `${API}/api/manual-payments/admin/list`
        );

        const payments = await response.json();

        const container = document.getElementById("manualPayments");

        if (!payments.length) {

            container.innerHTML = `
                <div class="dashboard-card">
                    <h3>No Manual Payments Found</h3>
                </div>
            `;

            return;
        }

        container.innerHTML = "";

        payments.forEach(payment => {

            container.innerHTML += `

            <div class="dashboard-card">

                <h2>${payment.name}</h2>

                <p><b>Email:</b> ${payment.email}</p>

                <p><b>Payment Type:</b> ${payment.payment_type}</p>

                <p><b>Amount:</b> ₹${payment.amount}</p>

                <p><b>Coins:</b> ${payment.coins}</p>

                <p><b>Transaction ID:</b><br>${payment.transaction_id}</p>

                <p><b>Status:</b> ${payment.status}</p>

                ${
                    payment.screenshot
                    ?
                    `
                    <p>
                        <a

href="${payment.screenshot}"

target="_blank"

class="admin-link">

📷 View Payment Proof

</a>
                           target="_blank">
                           View Screenshot
                        </a>
                    </p>
                    `
                    :
                    ""
                }

                <div
                style="display:flex;gap:10px;margin-top:15px;">

                    ${
                        payment.status==="Pending"
                        ?

                        `
                        <button
                        class="admin-btn"
                        onclick="approvePayment(${payment.id})">

                        ✅ Approve

                        </button>

                        <button
                        class="admin-btn"
                        style="background:#d63031"
                        onclick="rejectPayment(${payment.id})">

                        ❌ Reject

                        </button>
                        `

                        :

                        `<b>${payment.status}</b>`
                    }

                </div>

            </div>

            `;

        });

    }

    catch(err){

        console.log(err);

    }

}

async function approvePayment(id){

    if(!confirm("Approve this payment?")){

        return;

    }

    const response=await adminFetch(

        `${API}/api/manual-payments/admin/${id}/approve`,

        {

            method:"PUT"

        }

    );

    const data=await response.json();

    alert(data.message);

    loadPayments();

}

async function rejectPayment(id){

    const note=prompt(

        "Reason for rejection"

    );

    if(note===null){

        return;

    }

    const response=await adminFetch(

        `${API}/api/manual-payments/admin/${id}/reject`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                admin_note:note

            })

        }

    );

    const data=await response.json();

    alert(data.message);

    loadPayments();

}