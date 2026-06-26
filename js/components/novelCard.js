function createNovelCard(novel){

return `

<div class="novel-card">

<img

class="novel-cover"

src="${
novel.cover_url ||
"assets/images/default-cover.png"
}"

alt="${novel.title}">

<div class="novel-body">

<h2>

${novel.title}

</h2>

<p>

${novel.category}

•

${novel.language}

</p>

<div class="novel-meta">

<span>

👁 ${formatNumber(novel.views||0)}

</span>

<span>

❤️ ${formatNumber(novel.followers||0)}

</span>

<span>

⭐ ${novel.rating||0}

</span>

</div>

<div class="novel-buttons">

<a

href="novel.html?id=${novel.id}"

class="btn btn-primary">

Read

</a>

<a

href="novel.html?id=${novel.id}"

class="btn btn-secondary">

Details

</a>

</div>

</div>

</div>

`;

}