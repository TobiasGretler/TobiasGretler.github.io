/**
 * Picture gallery
 * ---------------
 * Renders a single row of thumbnails (the amount depends on the viewport)
 * and wires them up to GLightbox.
 */
(() => {
  "use strict";

  const IMAGE_DIR = "assets/img/gallery";
  const CONTAINER_SELECTOR = "#gallery-row";
  const LINK_CLASS = "gallery-link";
  const RESIZE_DEBOUNCE_MS = 150;

  // Numbers of the files `gallery-<n>.jpg`.
  // NOTE: contains repeats (2, 15, 16) - only the first row is ever rendered anyway.
  const IMAGE_NUMBERS = [1, 2, 15, 15, 2, 16, 2, 15, 16, 2, 2];

  const images = IMAGE_NUMBERS.map((n) => ({
    src: `${IMAGE_DIR}/gallery-${n}.jpg`,
    alt: `Gallery ${n}`,
    title: `Gallery ${n}`,
  }));

  // Matches the Bootstrap columns: col-xl-3 / col-lg-4 / col-md-6 / full width.
  const BREAKPOINTS = [
    { minWidth: 1200, imagesPerRow: 4 },
    { minWidth: 992, imagesPerRow: 3 },
    { minWidth: 768, imagesPerRow: 2 },
  ];

  const getImagesPerRow = (width = window.innerWidth) =>
    BREAKPOINTS.find((bp) => width >= bp.minWidth)?.imagesPerRow ?? 1;

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  function createGalleryItem({ src, alt, title }) {
    const column = document.createElement("div");
    column.className = "col-xl-3 col-lg-4 col-md-6 gallery-item";

    const inner = document.createElement("div");
    inner.className = "gallery-item h-100";

    const link = document.createElement("a");
    link.href = src;
    link.className = LINK_CLASS;
    link.dataset.alt = alt;
    link.title = title;

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "img-fluid";
    img.loading = "lazy";

    link.append(img);
    inner.append(link);
    column.append(inner);
    return column;
  }

  let lightbox = null;
  let renderedCount = -1;

  function render() {
    const container = document.querySelector(CONTAINER_SELECTOR);
    if (!container) return;

    const count = Math.min(getImagesPerRow(), images.length);
    if (count === renderedCount) return; // nothing changed -> no rebuild
    renderedCount = count;

    container.replaceChildren(...images.slice(0, count).map(createGalleryItem));

    if (typeof GLightbox === "undefined") return;

    if (lightbox) {
      lightbox.reload(); // re-scan the new links instead of creating another instance
    } else {
      lightbox = GLightbox({
        selector: `${CONTAINER_SELECTOR} .${LINK_CLASS}`,
        touchNavigation: true,
        keyboardNavigation: true,
        closeButton: false,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------
  let resizeTimer;
  window.addEventListener("load", render);
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, RESIZE_DEBOUNCE_MS);
  });
})();
