// Budget Calculator
document.addEventListener('DOMContentLoaded', () => {
    const budgetInputs = document.querySelectorAll('.budget-input');

    // Calculate on input change
    budgetInputs.forEach(input => {
        input.addEventListener('input', calculateBudget);
    });

    // Initial calculation
    calculateBudget();
});

function calculateBudget() {
    const rows = document.querySelectorAll('.budget-table tbody tr:not(.budget-total)');
    let totalCost = 0;
    let totalAdvance = 0;
    let totalPending = 0;

    rows.forEach(row => {
        const inputs = row.querySelectorAll('.budget-input');
        const cost = parseFloat(inputs[0]?.value || 0);
        const advance = parseFloat(inputs[1]?.value || 0);
        const pending = cost - advance;

        // Update pending cell
        const pendingCell = row.querySelector('.calculated');
        if (pendingCell) {
            pendingCell.textContent = `$${pending.toLocaleString('es-MX')}`;
        }

        totalCost += cost;
        totalAdvance += advance;
        totalPending += pending;
    });

    // Update totals
    document.getElementById('grandTotal').textContent = `$${totalCost.toLocaleString('es-MX')}`;
    document.getElementById('totalAdvance').textContent = `$${totalAdvance.toLocaleString('es-MX')}`;
    document.getElementById('totalPending').textContent = `$${totalPending.toLocaleString('es-MX')}`;

    // Update summary cards
    document.getElementById('totalSpent').textContent = `$${totalAdvance.toLocaleString('es-MX')}`;

    const budgetTotal = 150000; // Fixed budget
    const remaining = budgetTotal - totalCost;
    document.getElementById('remaining').textContent = `$${remaining.toLocaleString('es-MX')}`;

    // Update progress bar
    const percentage = Math.min((totalCost / budgetTotal) * 100, 100);
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressFill').textContent = `${percentage.toFixed(0)}%`;
    document.getElementById('progressPercent').textContent = `${percentage.toFixed(0)}%`;

    // Change color based on percentage
    const progressFill = document.getElementById('progressFill');
    if (percentage > 100) {
        progressFill.style.background = 'linear-gradient(90deg, #d63031, #e17055)';
    } else if (percentage > 80) {
        progressFill.style.background = 'linear-gradient(90deg, #fdcb6e, #f39c12)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #00b894, #c41e3a)';
    }
}

// Save button
document.querySelectorAll('.btn-save').forEach(button => {
    button.addEventListener('click', () => {
        alert('✅ Presupuesto guardado correctamente');
    });
});
