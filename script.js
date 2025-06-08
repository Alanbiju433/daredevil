document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a[data-page]');
    const sections = document.querySelectorAll('.page-section');
    const heart = document.getElementById('heart');
    const backgroundMusic = document.getElementById('background-music');
    const rsvpForm = document.getElementById('rsvp-form');
    const formMessage = document.getElementById('form-message');

    // Function to show the selected section and hide others
    function showSection(page) {
        sections.forEach(section => {
            if (section.id === page) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    // Initialize by showing the About section
    showSection('about');

    // Navigation link click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showSection(page);
        });
    });

    // Heart click event: play music and alert
    heart.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        }
        alert('Love is in the air! ❤️');
    });

    // Play background music on user interaction if not already playing
    document.body.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        }
    }, { once: true });

    // RSVP form submission handler
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formMessage.textContent = '';

            const formData = {
                name: rsvpForm.name.value.trim(),
                response: rsvpForm.response.value,
                message: rsvpForm.message.value.trim()
            };

            if (!formData.name || !formData.response) {
                formMessage.textContent = 'Please fill in all required fields.';
                formMessage.style.color = 'red';
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    formMessage.textContent = 'Thank you for your response!';
                    formMessage.style.color = 'green';
                    rsvpForm.reset();
                } else {
                    formMessage.textContent = 'Failed to send response. Please try again later.';
                    formMessage.style.color = 'red';
                }
            } catch (error) {
                formMessage.textContent = 'Error sending response. Please check your connection.';
                formMessage.style.color = 'red';
            }
        });
    }

    // Warn user before closing the page if RSVP not submitted
    window.addEventListener('beforeunload', (e) => {
        if (rsvpForm && !rsvpForm.dataset.submitted) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});
