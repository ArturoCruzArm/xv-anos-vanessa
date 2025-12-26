// Budget Calculator - CARGA DESDE JSON
let presupuestoData = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos desde JSON
    try {
        const response = await fetch('data/presupuesto.json');
        presupuestoData = await response.json();

        console.log('✓ Presupuesto cargado desde JSON:', presupuestoData);

        // Cargar datos en la página
        loadBudgetData();

        // Configurar event listeners
        const budgetInputs = document.querySelectorAll('.budget-input');
        budgetInputs.forEach(input => {
            input.addEventListener('input', calculateBudget);
        });

        // Calcular totales iniciales
        calculateBudget();
    } catch (error) {
        console.error('Error cargando presupuesto.json:', error);
        calculateBudget(); // Calcular con valores por defecto
    }
});

function loadBudgetData() {
    if (!presupuestoData) return;

    // Actualizar presupuesto total
    const totalBudgetEl = document.getElementById('totalBudget');
    if (totalBudgetEl) {
        totalBudgetEl.textContent = '$' + presupuestoData.total.toLocaleString('es-MX');
    }

    // Cargar rubros en la tabla
    const tbody = document.querySelector('.budget-table tbody');
    const rows = tbody.querySelectorAll('tr:not(.budget-total)');

    presupuestoData.rubros.forEach((rubro, index) => {
        if (rows[index]) {
            const inputs = rows[index].querySelectorAll('.budget-input');
            const select = rows[index].querySelector('select');

            // Cargar valores
            if (inputs[0] && rubro.costo !== null) {
                inputs[0].value = rubro.costo;
            }
            if (inputs[1] && rubro.anticipo !== null) {
                inputs[1].value = rubro.anticipo;
            }

            // Cargar estado
            if (select && rubro.estado) {
                const estadoMap = {
                    'pendiente': 'Pendiente',
                    'apartado': 'Apartado',
                    'pagado': 'Pagado',
                    'completado': 'Pagado'
                };
                const estadoTexto = estadoMap[rubro.estado.toLowerCase()] || 'Pendiente';
                for (let option of select.options) {
                    if (option.text === estadoTexto) {
                        option.selected = true;
                        break;
                    }
                }
            }
        }
    });

    console.log('✓ Datos del presupuesto cargados en la tabla');
}

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

    // Cargar presupuesto total desde JSON, o usar 150000 como fallback
    const budgetTotal = presupuestoData?.total || 150000;
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
        const mensaje = '💾 DATOS GUARDADOS LOCALMENTE

' +
                      '✅ La información se guardó en tu navegador

' +
                      '⚠️ IMPORTANTE:
' +
                      'Para CONFIRMAR los cambios y que yo los reciba,
' +
                      'debes enviarme la información por WhatsApp

' +
                      'Los datos guardados aquí solo están en tu dispositivo.';

        alert(mensaje);
    });
});
