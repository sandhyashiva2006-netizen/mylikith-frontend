const API="https://mylikith-backend.onrender.com";

async function loadReports(){

const response=

await fetch(`${API}/api/admin/reports`);

const reports=

await response.json();

const table=

document.getElementById("reportsTable");

table.innerHTML="";

if(reports.length===0){

table.innerHTML=

"<div class='loading'>No reports found</div>";

return;

}

reports.forEach(report=>{

table.innerHTML+=`

<div class="report-row">

<div>

<span class="report-status">

Pending

</span>

</div>

<div>

<strong>

${report.type}

</strong>

<br>

${report.reason}

</div>

<div>

${report.reported_item}

</div>

<div class="user-actions">

<button
class="admin-btn"
onclick="resolveReport(${report.id})">

Resolve

</button>

<button
class="admin-btn delete-btn"
onclick="deleteReport(${report.id})">

Delete

</button>

</div>

</div>

`;

});

}

async function resolveReport(id){

await fetch(

`${API}/api/admin/reports/${id}/resolve`,

{

method:"PUT"

}

);

loadReports();

}

async function deleteReport(id){

await fetch(

`${API}/api/admin/reports/${id}`,

{

method:"DELETE"

}

);

loadReports();

}

loadReports();