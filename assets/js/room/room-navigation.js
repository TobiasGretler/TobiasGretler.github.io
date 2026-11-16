/**
 * Room navigation
 * ---------------
 * Slides between "rooms" in a 3D stage (zoom out -> slide -> zoom in).
 * Controls: prev/next buttons, ArrowLeft/ArrowRight, horizontal swipe.
 */
(() => {
  "use strict";

  const CONFIG = {
    centeredDepth: 460, // translateZ (px) while a room is in focus
    swipeThreshold: 55, // min. horizontal distance (px) to count as a swipe
    transitionTimeout: 900, // fallback if `transitionend` never fires (ms)
    reducedMotionTimeout: 50,
  };

  const NO_ROTATION = "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------
  const $ = (selector) => document.querySelector(selector);

  const dom = {
    stage: $(".room-stage"),
    scroller: $(".room-scroller"),
    rooms: Array.from(document.querySelectorAll(".room-scroller .room")),
    prevButton: $(".room-nav--previous"),
    nextButton: $(".room-nav--next"),
    title: $("[data-room-title]"),
    indexLabel: $("[data-room-index]"),
    totalLabel: $("[data-room-total]"),
  };

  const { stage, scroller, rooms, prevButton, nextButton } = dom;

  // Bail out quietly on pages without the room markup.
  const hasAllElements =
    rooms.length > 0 &&
    Object.entries(dom).every(([, el]) => (Array.isArray(el) ? true : el));
  if (!hasAllElements) return;

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let currentIndex = Math.max(
    0,
    rooms.findIndex((room) => room.classList.contains("room--current"))
  );
  let isMoving = false;
  let isNavigating = false;
  let swipeStartX = null;

  // ---------------------------------------------------------------------------
  // Transform helpers
  // ---------------------------------------------------------------------------
  const buildTransform = (x, z) =>
    `translate3d(${x}, 0px, ${z}px) ${NO_ROTATION}`;

  const applyTransform = (x, z) => {
    scroller.style.transform = buildTransform(x, z);
  };

  /** Animates the scroller to (x, z) and resolves once the transition is done. */
  function moveTo(x, z) {
    return new Promise((resolve) => {
      if (isMoving) return resolve();
      isMoving = true;

      const reduced = prefersReducedMotion.matches;
      let finished = false;
      let timer;

      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        scroller.removeEventListener("transitionend", onTransitionEnd);
        scroller.removeEventListener("transitioncancel", onTransitionEnd);
        isMoving = false;
        resolve();
      };

      const onTransitionEnd = (event) => {
        if (event.target === scroller && event.propertyName === "transform") finish();
      };

      scroller.addEventListener("transitionend", onTransitionEnd);
      scroller.addEventListener("transitioncancel", onTransitionEnd);
      timer = setTimeout(
        finish,
        reduced ? CONFIG.reducedMotionTimeout : CONFIG.transitionTimeout
      );

      requestAnimationFrame(() => {
        applyTransform(x, z);
        if (reduced) finish();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  const pad = (n) => String(n).padStart(2, "0");

  function updateLabels() {
    dom.title.textContent = rooms[currentIndex].dataset.title || `Room ${currentIndex + 1}`;
    dom.indexLabel.textContent = pad(currentIndex + 1);
    dom.totalLabel.textContent = pad(rooms.length);
  }

  function setBusy(busy) {
    prevButton.disabled = busy;
    nextButton.disabled = busy;
    if (busy) stage.setAttribute("aria-busy", "true");
    else stage.removeAttribute("aria-busy");
  }

  function swapCurrentRoom(from, to) {
    from.classList.remove("room--current");
    from.setAttribute("aria-hidden", "true");
    from.style.removeProperty("opacity");

    to.classList.add("room--current");
    to.setAttribute("aria-hidden", "false");
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  /** @param {1 | -1} direction  1 = next, -1 = previous */
  async function navigate(direction) {
    if (isNavigating || isMoving || rooms.length < 2) return;

    isNavigating = true;
    setBusy(true);

    const nextIndex = (currentIndex + direction + rooms.length) % rooms.length;
    const fromRoom = rooms[currentIndex];
    const toRoom = rooms[nextIndex];

    const entryOffset = direction > 0 ? "100%" : "-100%"; // where the next room waits
    const travel = direction > 0 ? "-100%" : "100%"; // how far the scroller slides

    toRoom.style.transform = `translate3d(${entryOffset}, 0, 0)`;
    toRoom.style.opacity = "1";

    try {
      await moveTo("0px", 0); // 1. zoom out
      await moveTo(travel, 0); // 2. slide over

      swapCurrentRoom(fromRoom, toRoom);
      currentIndex = nextIndex;
      updateLabels();

      await moveTo(travel, CONFIG.centeredDepth); // 3. zoom in

      // 4. silently reset the scroller so the next move starts at the origin
      scroller.style.transition = "none";
      toRoom.style.transform = "translate3d(0, 0, 0)";
      applyTransform("0px", CONFIG.centeredDepth);
      requestAnimationFrame(() => scroller.style.removeProperty("transition"));
    } finally {
      isNavigating = false;
      setBusy(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------
  prevButton.addEventListener("click", () => navigate(-1));
  nextButton.addEventListener("click", () => navigate(1));

  document.addEventListener("keydown", (event) => {
    const isArrow = event.key === "ArrowLeft" || event.key === "ArrowRight";
    if (!isArrow || event.altKey || event.ctrlKey || event.metaKey) return;

    const target = event.target;
    if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;

    event.preventDefault();
    navigate(event.key === "ArrowRight" ? 1 : -1);
  });

  stage.addEventListener("pointerdown", (event) => {
    swipeStartX = event.clientX;
  });

  stage.addEventListener("pointerup", (event) => {
    if (swipeStartX === null) return;

    const distance = event.clientX - swipeStartX;
    swipeStartX = null;

    if (Math.abs(distance) < CONFIG.swipeThreshold) return;
    if (event.target.closest("a, button")) return;

    navigate(distance < 0 ? 1 : -1);
  });

  stage.addEventListener("pointercancel", () => {
    swipeStartX = null;
  });

  updateLabels();
})();
