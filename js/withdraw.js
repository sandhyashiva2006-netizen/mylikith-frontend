const API = "https://mylikith-backend.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    location.href = "login.html";
}

const userId = user.id;

document.addEventListener("DOMContentLoaded", () => {

    togglePaymentFields();

    loadSummary();

    loadPaymentDetails();

    loadHistory();

});

document.getElementById("paymentMethod")
.addEventListener("change", togglePaymentFields);

document.getElementById("savePaymentBtn")
.addEventListener("click", savePaymentDetails);

document.getElementById("withdrawBtn")
.addEventListener("click", submitWithdrawal);

function togglePaymentFields() {

    const method =
        document.getElementById("paymentMethod").value;

    document.getElementById("upiSection").style.display =
        method === "UPI" ? "block" : "none";

    document.getElementById("bankSection").style.display =
        method === "BANK" ? "block" : "none";

}

async function loadSummary() {

    try {

        const res = await fetch(
            `${API}/writers/earnings/${userId}`
        );

        const data = await res.json();

        document.getElementById("totalEarnings").innerText =
            "₹" + Number(data.summary.amount || 0).toFixed(2);

        document.getElementById("withdrawableAmount").innerText =
            "₹" + Number(data.summary.amount || 0).toFixed(2);

        const history =
            data.history || [];

        let pending = 0;
        let paid = 0;

        history.forEach(item => {

            if (item.status === "Pending")
                pending += Number(item.amount);

            if (
                item.status === "Approved" ||
                item.status === "Completed"
            )
                paid += Number(item.amount);

        });

        document.getElementById("pendingAmount").innerText =
            "₹" + pending.toFixed(2);

        document.getElementById("paidAmount").innerText =
            "₹" + paid.toFixed(2);

    }

    catch (err) {

        console.log(err);

    }

}

async function loadPaymentDetails() {

    try {

        const res =
            await fetch(
                `${API}/writers/payment-details/${userId}`
            );

        const data =
            await res.json();

        if (!data.success)
            return;

        const details =
            data.details;

        document.getElementById("paymentMethod").value =
            details.payment_method || "UPI";

        document.getElementById("upiId").value =
            details.upi_id || "";

        document.getElementById("accountName").value =
            details.account_name || "";

        document.getElementById("bankName").value =
            details.bank_name || "";

        document.getElementById("accountNumber").value =
            details.account_number || "";

        document.getElementById("ifscCode").value =
            details.ifsc_code || "";

        togglePaymentFields();

    }

    catch (err) {

        console.log(err);

    }

}

async function savePaymentDetails() {

    try {

        const body = {

            writer_id: userId,

            payment_method:
                document.getElementById("paymentMethod").value,

            upi_id:
                document.getElementById("upiId").value,

            account_name:
                document.getElementById("accountName").value,

            bank_name:
                document.getElementById("bankName").value,

            account_number:
                document.getElementById("accountNumber").value,

            ifsc_code:
                document.getElementById("ifscCode").value

        };

        const res =
            await fetch(

                `${API}/writers/payment-details`,

                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)

                }

            );

        const data =
            await res.json();

        alert(data.message);

    }

    catch (err) {

        console.log(err);

    }

}

async function submitWithdrawal() {

    const amount =
        Number(
            document.getElementById(
                "withdrawAmount"
            ).value
        );

    if (amount < 500) {

        alert(
            "Minimum withdrawal amount is ₹500."
        );

        return;

    }

    try {

        const body = {

            writer_id: userId,

            amount

        };

        const res =
            await fetch(

                `${API}/writers/withdraw`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(body)

                }

            );

        const data =
            await res.json();

        alert(data.message);

        document.getElementById(
            "withdrawAmount"
        ).value = "";

        loadHistory();

        loadSummary();

    }

    catch (err) {

        console.log(err);

    }

}

async function loadHistory() {

    try {

        const res =
            await fetch(

                `${API}/writers/withdraw-history/${userId}`

            );

        const history =
            await res.json();

        const container =
            document.getElementById(
                "withdrawHistory"
            );

        container.innerHTML = "";

        if (history.length === 0) {

            container.innerHTML =
                "<p>No withdrawal history.</p>";

            return;

        }

        history.forEach(item => {

            container.innerHTML += `

<div class="history-card">

<div class="history-left">

<h3>

₹${Number(item.amount).toFixed(2)}

</h3>

<p>

${new Date(item.requested_at).toLocaleDateString()}

</p>

</div>

<div class="history-right">

<div class="status ${item.status.toLowerCase()}">

${item.status}

</div>

</div>

</div>

`;

        });

    }

    catch (err) {

        console.log(err);

    }

}