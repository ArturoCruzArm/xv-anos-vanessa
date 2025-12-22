// Countdown Timer
function updateCountdown() {
    // Fecha del evento: 12 de abril de 2025 a las 17:00 hrs
    const eventDate = new Date(2025, 3, 12, 17, 0, 0).getTime(); // Mes 3 = Abril (0-indexed)
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p style="text-align: center; font-size: 1.5rem; color: var(--gold);">¡El evento ya comenzó! 🎉</p>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Add to Calendar
function addToCalendar(type) {
    const title = type === 'ceremony' ? 'XV Años Vanessa - Ceremonia' : 'XV Años Vanessa - Recepción';
    const location = type === 'ceremony'
        ? 'La Joya, León, Guanajuato'
        : 'La Joya, León, Guanajuato';
    const startTime = type === 'ceremony' ? '20250412T170000' : '20250412T183000';
    const endTime = type === 'ceremony' ? '20250412T180000' : '20250413T020000';

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent('XV Años de Vanessa')}&location=${encodeURIComponent(location)}`;

    window.open(googleCalendarUrl, '_blank');
}

// RSVP Form Submission
function submitRSVP(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const guests = formData.get('guests');
    const attendance = formData.get('attendance');
    const message = formData.get('message') || 'Sin mensaje';

    const whatsappMessage = `
✨ CONFIRMACIÓN XV AÑOS - VANESSA ✨

👤 Nombre: ${name}
📱 Teléfono: ${phone}
👥 Invitados: ${guests}
✅ Asistencia: ${attendance === 'si' ? 'Sí asistiré' : 'No podré asistir'}
💬 Mensaje: ${message}

📅 Fecha: 12 de abril de 2025
    `.trim();

    // Actualizar con el número correcto de WhatsApp
    const whatsappUrl = `https://wa.me/524779203776?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    document.getElementById('successMessage').style.display = 'block';
    event.target.reset();

    setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
}

// Social Sharing
function shareWhatsApp() {
    const text = '¡Estás invitado a mis XV años! 👑✨ - Vanessa - 12 de abril de 2025';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
}

function shareFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareTwitter() {
    const text = '¡Estás invitado a mis XV años! 👑✨ - Vanessa - 12 de abril de 2025';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('¡Enlace copiado al portapapeles!');
    }).catch(() => {
        prompt('Copia este enlace:', url);
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
