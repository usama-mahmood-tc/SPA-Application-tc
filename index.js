// Close navbar when clicking on a nav-link-----------------
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  });
});

// Close navbar when clicking outside of it
document.addEventListener("click", function (event) {
  const navbar = document.querySelector(".navbar");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (!navbar.contains(event.target)) {
    if (navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  }
});

// Sticky Navbar functionality-----------
const navbar = document.getElementById("navbar");
const header = document.querySelector("header");
const stickyOffset = header.offsetHeight;

window.addEventListener("scroll", () => {
  if (window.scrollY > stickyOffset) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

// Smooth scroll to section when nav link is clicked
const links = document.querySelectorAll("a.nav-link");

links.forEach((li) => {
  li.addEventListener("click", (e) => {
    e.preventDefault();
    const sectionId = e.target.getAttribute("href").substring(1);
    const section = document.getElementById(sectionId);

    section.scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Highlight nav link and change URL when section comes into view
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

// Helper function to remove active class from all nav links
function removeActiveClasses() {
  navLinks.forEach((link) => link.classList.remove("active"));
}

// Observer callback for section in view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        // Remove active class from all links
        removeActiveClasses();

        const activeLink = document.querySelector(
          `.nav-link[href="#${sectionId}"]`
        );

        if (activeLink) {
          activeLink.classList.add("active");
        }

        // Update the URL
        history.replaceState(null, null, `#${sectionId}`);
      }
    });
  },
  { threshold: 0.3 }
);

// Observe each section
sections.forEach((section) => {
  observer.observe(section);
});

// Back-To-Top Button Starts
const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

window.onload = () => {
  backToTopButton.classList.remove("show");
};

// Circle bar Progress Js------------------

$(document).ready(function () {
  // Function to animate the circle and number when in view
  function animateCircleProgress($circle, targetValue, finalNumber) {
    var duration = 1500; // Duration of the animation

    // Animate the circle progress
    $circle
      .circleProgress({
        value: targetValue,
        size: 210,
        thickness: 18,
        fill: { gradient: ["#1faaae", "#255aa5"] },
        emptyFill: "#e0e0e0",
        animation: { duration: duration },
        lineCap: "round",
      })
      .on("circle-animation-progress", function (event, progress) {
        // Animate the number inside the circle
        var currentNumber = Math.round(finalNumber * progress);
        $circle.find(".counter-num").text(currentNumber + "+");
      });
  }

  // Trigger animation when circles come into view (using Intersection Observer)
  let observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var $circle = $(entry.target);

        // Get individual targetValue and finalNumber from data attributes
        var targetValue = parseFloat($circle.data("value"));
        var finalNumber = parseInt($circle.data("number"), 10);

        animateCircleProgress($circle, targetValue, finalNumber);
        observer.unobserve(entry.target);
      }
    });
  });

  // Observe each circle
  document.querySelectorAll(".circle").forEach(function (circle) {
    observer.observe(circle);
  });
});

// Form Validation Starts------------------
// Function to validate and submit the form
function validateAndSubmitForm() {
  // Get all form inputs
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const project = document.getElementById("project");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");

  // Reset previous error messages
  clearErrors();

  // Validate each field
  let isValid = true;

  if (name.value.trim() === "") {
    displayError(name, "Name is required");
    isValid = false;
  }

  if (email.value.trim() === "") {
    displayError(email, "Email is required");
    isValid = false;
  } else if (!ValidEmail(email.value)) {
    displayError(email, "Please enter a valid email address");
    isValid = false;
  }

  if (phone.value.trim() === "") {
    displayError(phone, "Phone is required");
    isValid = false;
  } else if (!validPhone(phone.value)) {
    displayError(phone, "please enter a phone number");
    isValid = false;
  }

  if (project.value.trim() === "") {
    displayError(project, "Project is required");
    isValid = false;
  }

  if (subject.value.trim() === "") {
    displayError(subject, "Subject is required");
    isValid = false;
  }

  if (message.value.trim() === "") {
    displayError(message, "Message is required");
    isValid = false;
  }

  // If the form is valid, submit it
  if (isValid) {
    // Create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://jsonplaceholder.typicode.com/posts", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Handle the response
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 201) {
        const response = JSON.parse(xhr.responseText);
        console.log("Success:", response);
        // alert("Form submitted successfully!");
        document.getElementById("form").reset();
        document.getElementById("submitButton").textContent = "Send Message";
        // Show success toast
        const toastElement = document.getElementById("successToast");
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      } else if (xhr.readyState === 4) {
        const toastElement = document.getElementById("errorToast");
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        document.getElementById("submitButton").textContent = "Send Message";
        console.error("Error:", xhr.status, xhr.statusText);

        // alert("Failed to submit the form.");
      }
    };

    xhr.onloadstart = function () {
      document.getElementById("submitButton").textContent = "Sending...";
    };

    // Send the form data as a JSON string
    const formData = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      project: project.value,
      subject: subject.value,
      message: message.value,
    };
    xhr.send(JSON.stringify(formData));
  }
}

// Helper function to display error messages
function displayError(input, message) {
  clearErrorForInput(input);

  const formFloating = input.closest(".form-floating");
  const error = document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  error.style.color = "red";
  error.style.fontSize = "0.8rem";
  error.style.marginTop = "5px";
  formFloating.appendChild(error);
  input.classList.add("is-invalid");
}

// function to validate email format
function ValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
// function to validate phone number format
function validPhone(phone) {
  const phonePattern = /^\d+$/;
  return phonePattern.test(phone);
}

// Getting input fields for removing warning on input
const inputs = form.querySelectorAll("input, textarea");
inputs.forEach((input) => {
  input.addEventListener("input", function () {
    clearErrorForInput(this);
  });
});

function clearErrorForInput(input) {
  const formFloating = input.closest(".form-floating");
  const error = formFloating.querySelector(".error-message");
  if (error) {
    error.remove();
  }
  input.classList.remove("is-invalid");
}

function clearErrors() {
  inputs.forEach(clearErrorForInput);
}

// Added event listener to the submit button
document
  .getElementById("submitButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    validateAndSubmitForm();
  });

// Mouse Move Animatin Js Starts-------------------
const circle = document.querySelector(".circle-move");

let mouseX = 0,
  mouseY = 0;
let currentX = 0,
  currentY = 0;

// Function to animate the circle's movement
function animateCircle() {
  currentX += (mouseX - currentX) * 0.1;
  currentY += (mouseY - currentY) * 0.1;

  circle.style.left = `${currentX}px`;
  circle.style.top = `${currentY}px`;

  requestAnimationFrame(animateCircle);
}

// Start the animation
animateCircle();

document
  .querySelector(".header-main-container")
  .addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    circle.style.opacity = "1";
  });

document
  .querySelector(".header-main-container")
  .addEventListener("mouseleave", (e) => {
    circle.style.opacity = "0";
  });

// Enlarge the circle on hover over nav links--------------
const navLinkes = document.querySelectorAll(".interactive");

navLinkes.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    circle.style.width = "70px";
    circle.style.height = "70px";
    circle.style.backgroundColor = "rgb(31, 170, 174,0.2)";
    circle.style.border = "0";
  });

  link.addEventListener("mouseleave", () => {
    circle.style.width = "35px";
    circle.style.height = "35px";
    circle.style.backgroundColor = "transparent";
    circle.style.border = "2px solid #1faaae";
  });
});
