// Function to handle smooth scrolling for anchor links
const smoothScroll = function (target, duration) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetElement = document.querySelector(target);
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    const startPosition = window.pageYOffset;
    let startTime = null;

    function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, targetPosition, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(scrollAnimation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(scrollAnimation);
}

// Smooth scroll for navigation links
document.querySelectorAll('header nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScroll(target, 1000); // Adjust scroll speed as needed (milliseconds)
    });
});

// Form submission handling
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Simulate form submission
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // You can handle form submission here, e.g., send data to backend or display a success message
    console.log('Form submitted:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Clear form fields
    this.reset();
});

// Toggle active class on nav links on scroll
window.addEventListener('scroll', function () {
    let currentSection = '';

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            currentSection = section.getAttribute('id');
        }
    });

    document.querySelectorAll('header nav ul li a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(currentSection)) {
            a.classList.add('active');
        }
    });
});

// Fun animations
const projects = document.querySelectorAll('.project');
projects.forEach(project => {
    project.addEventListener('mouseover', function () {
        const image = this.querySelector('img');
        const originalWidth = image.clientWidth;
        const originalHeight = image.clientHeight;

        // Scale up image
        image.style.transform = 'scale(1.1)';
        image.style.transition = 'transform 0.4s ease';

        // Add shadow effect
        this.style.boxShadow = '0px 10px 15px rgba(0, 0, 0, 0.3)';
    });

    project.addEventListener('mouseleave', function () {
        const image = this.querySelector('img');
        
        // Scale down image
        image.style.transform = 'scale(1)';
        image.style.transition = 'transform 0.4s ease';

        // Remove shadow effect
        this.style.boxShadow = 'none';
    });
});

// Floating social media icons
const socialMediaIcons = document.querySelectorAll('.social-media ul li a img');
socialMediaIcons.forEach(icon => {
    icon.addEventListener('mouseover', function () {
        const randomX = Math.random() * 40 - 20; // Random X position between -20 and 20
        const randomY = Math.random() * 40 - 20; // Random Y position between -20 and 20
        icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(360deg)`;
        icon.style.transition = 'transform 0.4s ease';
    });

    icon.addEventListener('mouseleave', function () {
        icon.style.transform = 'none';
    });
});
// Function to create yellow square animation
const createYellowSquare = function () {
    const yellowSquare = document.createElement('div');
    yellowSquare.classList.add('yellow-square');
    document.body.appendChild(yellowSquare);

    document.addEventListener('mousemove', function (e) {
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        yellowSquare.style.left = mouseX + 'px';
        yellowSquare.style.top = mouseY + 'px';
    });
};

// Initialize yellow square animation
createYellowSquare();
