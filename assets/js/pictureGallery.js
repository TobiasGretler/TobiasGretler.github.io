const imageGalleryData = [
    {
        src: "assets/img/gallery/gallery-1.jpg",
        alt: "Gallery 1",
        title: "Gallery 1"
    },
    {
        src: "assets/img/gallery/gallery-2.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-15.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-15.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-2.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-16.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-2.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-15.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-16.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-2.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    },
    {
        src: "assets/img/gallery/gallery-2.jpg",
        alt: "Gallery 2",
        title: "Gallery 2"
    }
];

function generateGallery() {
    var galleryContainer = document.querySelector("#gallery-row");
    var screenWidth = window.innerWidth;
    var imagesPerRow = calculateImagesPerRow(screenWidth);

    for (var i = 0; i < imagesPerRow; i++) {
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

  function calculateImagesPerRow(screenWidth) {
    if (screenWidth >= 1200) {
      return 4; // 4 images per row for large screens
    } else if (screenWidth >= 992) {
      return 3; // 3 images per row for medium screens
    } else if (screenWidth >= 768) {
      return 2; // 2 images per row for small screens
    } else {
      return 1; // 1 image per row for extra small screens (e.g., mobile)
    }
  }

  window.addEventListener("load", generateGallery);
  window.addEventListener("resize", function () {
    // Recalculate and regenerate the gallery on window resize
    var galleryContainer = document.querySelector("#gallery-row");
    galleryContainer.innerHTML = '';
    generateGallery();
  });