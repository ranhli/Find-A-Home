const paginate = document.getElementById("paginate");
const $container = $("#bnb-container");

paginate.addEventListener("click", function (e) {
  e.preventDefault();
  fetch(this.href)
    .then((response) => response.json())
    .then((data) => {
      for (const bnb of data.docs) {
        let template = createTemplate(bnb);
        $container.append(template);
      }
      let { nextPage } = data;
      this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
      bnbs.features.push(...data.docs);
      map.getSource("bnbs").setData(bnbs);
    })
    .catch((err) => console.log("ERROR", err));
});

function createTemplate(bnb) {
  let template = `<div class="card mb-3">
  <div class="row">
    <img class="card-img-top" src="${
      bnb.image.length ? bnb.image[0].url : ""
    }" alt="" />
    <div class="card-body mx-3">
      <h5 class="card-title">${bnb.location}</h5>
      <p class="card-text text-muted mb-1">
        ${bnb.title} ${bnb.type}
      </p>
      <a
        class="stretched-link mt-0"
        href="/homes/${bnb._id}"
        style="color: black"
      >
        ${bnb.price}/night before taxes
      </a>
    </div>
  </div>
</div>`;
  return template;
}
