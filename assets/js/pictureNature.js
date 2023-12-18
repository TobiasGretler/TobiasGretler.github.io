function generateGallery() {
    var galleryContainer = document.querySelector(".row.gy-4.justify-content-center");

    for (var i = 0; i < imageGalleryData.length; i++) {
      var imageInfo = imageGalleryData[i];
      var galleryItem = document.createElement("div");
      galleryItem.className = "col-xl-3 col-lg-4 col-md-6 gallery-item";
      galleryItem.innerHTML = `
        <div class="gallery-item h-100">
          <a href="${imageInfo.src}" class="glightbox" data-alt="${imageInfo.alt}">
            <img src="${imageInfo.src}" class="img-fluid" alt="${imageInfo.alt}">
          </a>
        </div>
      `;
      galleryContainer.appendChild(galleryItem);
    }
  
    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true, 
      keyboardNavigation: true, 
      closeButton: false,
    });
  }
  
  window.addEventListener("load", generateGallery);
