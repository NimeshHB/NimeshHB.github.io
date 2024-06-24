// script.js


// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


/* Existing CSS code here */

#nimesh {
    display: inline-block;
    animation: colorChange 5s infinite;
}

@keyframes colorChange {
    0% { color: #6a0dad; }
    25% { color: #ff6347; } /* tomato */
    50% { color: #4682b4; } /* steelblue */
    75% { color: #32cd32; } /* limegreen */
    100% { color: #6a0dad; }
}


