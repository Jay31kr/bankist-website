"use strict";

//////////////////////////////////////
// selecting and keeping elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const allimg = document.querySelectorAll("img[data-src]");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabcontents = document.querySelectorAll(".operations__content");

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/////////////////////////////////
// scrolling feature

btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////////////////////////////
//page navigation

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  // Matcing Strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//////////////////////////
// tab component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Gaurd Clause
  if (!clicked) return;

  // removing active class
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabcontents.forEach((c) => c.classList.remove("operations__content--active"));

  //  adding active
  clicked.classList.add("operations__tab--active");

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/////////////////////////////
// menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// sticky navigation
const initialCoords = section1.getBoundingClientRect();
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const headObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headObserver.observe(header);

// Reveal sections
const allSection = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionobserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(function (section) {
  sectionobserver.observe(section);
  section.classList.add("section--hidden");
});

// lazzy img loading

const lazzyLoading = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazzyLoading, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

allimg.forEach((img) => imgObserver.observe(img));

//////////////////////////////
// page slider

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const sliderCntrl = function () {
  let currentSlide = 0;

  // Functions

  const activeDots = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const updateSlide = function (Slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - Slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === slides.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    updateSlide(currentSlide);
    activeDots(currentSlide);
  };

  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide--;
    }
    updateSlide(currentSlide);
    activeDots(currentSlide);
  };

  // init function
  const init = function () {
    // createDots();
    updateSlide(0);
    activeDots(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", previousSlide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") previousSlide();
    e.key === "ArrowRight" && nextSlide();
  });
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      let { slide } = e.target.dataset;
      slide = parseInt(slide, 10);
      currentSlide = slide;
      updateSlide(currentSlide);
      activeDots(currentSlide);
    }
  });
};
const activeCntrl = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  sliderCntrl();
};

const options = {
  root: null,
  threshold: 0,
};
const slideObserver = new IntersectionObserver(activeCntrl, options);
slideObserver.observe(document.querySelector(".slider"));
