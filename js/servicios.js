// Generic service page functionality

// Save button handlers
document.addEventListener('DOMContentLoaded', () => {
    // Save buttons
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('✅ Información guardada correctamente');
        });
    });

    // Contact buttons
    const contactButtons = document.querySelectorAll('.btn-contact');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.contact-card');
            const name = card.querySelector('h4').textContent;
            alert(`Abriendo WhatsApp para contactar con ${name}...`);
        });
    });

    // Schedule buttons
    const scheduleButtons = document.querySelectorAll('.btn-schedule');
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const date = prompt('Ingresa la fecha para la cita (DD/MM/YYYY):');
            if (date) {
                const timeInfo = this.previousElementSibling.querySelector('p');
                timeInfo.textContent = `Programado para: ${date}`;
                alert('✅ Cita agendada correctamente');
            }
        });
    });

    // Auto-calculate totals for budget
    const costInputs = document.querySelectorAll('input[type="number"]');
    costInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
});

function calculateTotal() {
    const costPerPerson = parseFloat(document.querySelector('input[placeholder="$350"]')?.value || 0);
    const numberOfPeople = parseFloat(document.querySelector('input[placeholder="150"]')?.value || 0);
    const total = costPerPerson * numberOfPeople;

    const totalField = document.querySelector('input[value^="$"]');
    if (totalField) {
        totalField.value = `$${total.toLocaleString('es-MX')}`;
    }
}
