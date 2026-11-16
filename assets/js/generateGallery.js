function generateGallery(images) {
  var galleryContainer = document.querySelector(
    ".row.gy-4.justify-content-center"
  );

  if (!galleryContainer) return;

  images.forEach(function (imageInfo) {
    var galleryItem = document.createElement("div");
    galleryItem.className = "col-xl-3 col-lg-4 col-md-6 gallery-item";

    var imageWrapper = document.createElement("div");
    imageWrapper.className = "gallery-item h-100";

    var link = document.createElement("a");
    link.href = imageInfo.src;
    link.className = "glightbox";

    var image = document.createElement("img");
    image.src = imageInfo.src;
    image.className = "img-fluid";
    image.alt = imageInfo.alt || "";
    link.dataset.alt = image.alt;

    link.appendChild(image);
    imageWrapper.appendChild(link);
    galleryItem.appendChild(imageWrapper);
    galleryContainer.appendChild(galleryItem);
  });

  if (images.length && window.GLightbox) {
    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      keyboardNavigation: true,
      closeButton: false,
    });
  }
}

function loadNatureImages() {
  generateGallery(nature);
}
function loadArchitectureImages() {
  generateGallery(architecture);
}
function loadSportImages() {
  generateGallery(sport);
}
function loadTravelImages() {
  generateGallery(travel);
}
function loadAnimalImages() {
  generateGallery(animal);
}
