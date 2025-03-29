const authBtn = document.getElementById('auth-btn');
const signupModal = document.getElementById('signup-modal');
let userLoggedIn = false;

function verifyLinkedIn() {
    const url = document.getElementById('linkedin-url').value;
    if (url.includes('linkedin.com')) {
        // Simulate URL verification animation
        document.getElementById('linkedin-url').style.border = '2px solid #007bff';
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            signupModal.classList.remove('hidden');
        }, 1000);
    } else {
        alert('Invalid LinkedIn URL');
    }
}

function sendOTP() {
    const email = document.getElementById('email').value;
    fetch('http://localhost:3000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

function verifyOTP() {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            saveUserDetails();
            signupModal.classList.add('hidden');
            authBtn.textContent = 'Dashboard';
            userLoggedIn = true;
            alert('Signup Successful!');
        } else {
            alert('Invalid or Expired OTP');
        }
    });
}

function saveUserDetails() {
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Toggle login/dashboard button
authBtn.addEventListener('click', () => {
    if (userLoggedIn) {
        window.location.href = '#dashboard'; // Placeholder for dashboard
    } else {
        signupModal.classList.remove('hidden');
    }
});

// Framer Motion Animation for Cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', () => {
        // Using Framer Motion via CDN
        if (window.motion) {
            motion.animate(card, { scale: 1.05 }, { duration: 0.3 });
        }
    });
    card.addEventListener('mouseout', () => {
        if (window.motion) {
            motion.animate(card, { scale: 1 }, { duration: 0.3 });
        }
    });
});