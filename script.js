document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-button');
    const sections = document.querySelectorAll('.page-section');
    const heart = document.getElementById('heart');
    const backgroundMusic = document.getElementById('background-music');
    const rsvpForm = document.getElementById('rsvp-form');
    const formMessage = document.getElementById('form-message');

    let currentIndex = 0;

    // Create message viewer container (hidden by default)
    const messageViewer = document.createElement('div');
    messageViewer.id = 'message-viewer';
    messageViewer.style.position = 'fixed';
    messageViewer.style.top = '10%';
    messageViewer.style.left = '10%';
    messageViewer.style.width = '80%';
    messageViewer.style.height = '80%';
    messageViewer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    messageViewer.style.border = '2px solid #ccc';
    messageViewer.style.padding = '20px';
    messageViewer.style.overflowY = 'auto';
    messageViewer.style.zIndex = '1000';
    messageViewer.style.display = 'none';
    messageViewer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    document.body.appendChild(messageViewer);

    // Function to show the current section and hide others
    function showCurrentSection() {
        sections.forEach((section, index) => {
            section.style.display = index === currentIndex ? 'block' : 'none';
        });
    }

    // Initialize by showing the first section
    showCurrentSection();

    // Next button click handler
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % sections.length;
        showCurrentSection();
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

    // Function to load saved messages from localStorage and display
    function loadSavedMessages() {
        const messages = JSON.parse(localStorage.getItem('rsvpMessages') || '[]');
        if (messages.length === 0) {
            messageViewer.innerHTML = '<p>No saved messages.</p>';
            return;
        }
        let html = '<h2>Saved RSVP Messages</h2><ul>';
        messages.forEach((msg, index) => {
            html += `<li><strong>${msg.name}</strong> (${msg.response}): ${msg.message || '(No message)'}</li>`;
        });
        html += '</ul>';
        messageViewer.innerHTML = html;
    }

    // Toggle message viewer visibility on Ctrl key press
    let ctrlPressed = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Control' && !ctrlPressed) {
            ctrlPressed = true;
            loadSavedMessages();
            messageViewer.style.display = 'block';
        }
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            ctrlPressed = false;
            messageViewer.style.display = 'none';
        }
    });

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

            // Save message locally
            const savedMessages = JSON.parse(localStorage.getItem('rsvpMessages') || '[]');
            savedMessages.push(formData);
            localStorage.setItem('rsvpMessages', JSON.stringify(savedMessages));

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
