// Dashboard Charts using Chart.js - CARGA DATOS DESDE JSON
// Agregar al final del admin.html: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
// Agregar al final del admin.html: <script src="js/dashboard-charts.js"></script>

let presupuestoData = null;
let eventoData = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos desde JSON consolidado
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();

        presupuestoData = data.presupuesto;
        eventoData = data;

        // Esperar un poco para que la página se cargue
        setTimeout(() => {
            createBudgetChart();
            createGuestsChart();
            createTasksProgress();
        }, 500);
    } catch (error) {
        console.error('Error cargando datos para gráficas:', error);
    }
});

function createBudgetChart() {
    // Check if container exists
    let container = document.getElementById('budgetChartContainer');
    if (!container) {
        // Create container in dashboard stats section
        const statsSection = document.querySelector('.dashboard-stats');
        if (statsSection) {
            const chartsSection = document.createElement('section');
            chartsSection.className = 'service-section';
            chartsSection.innerHTML = `
                <h2 class="section-title"><i class="fas fa-chart-pie"></i> Análisis Visual</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 15px rgba(0,0,0,0.05);">
                        <h3 style="text-align: center; margin-bottom: 20px; color: var(--dark);">
                            <i class="fas fa-dollar-sign"></i> Presupuesto
                        </h3>
                        <canvas id="budgetChart"></canvas>
                    </div>
                    <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 15px rgba(0,0,0,0.05);">
                        <h3 style="text-align: center; margin-bottom: 20px; color: var(--dark);">
                            <i class="fas fa-users"></i> Invitados
                        </h3>
                        <canvas id="guestsChart"></canvas>
                    </div>
                    <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 15px rgba(0,0,0,0.05);">
                        <h3 style="text-align: center; margin-bottom: 20px; color: var(--dark);">
                            <i class="fas fa-tasks"></i> Información
                        </h3>
                        <canvas id="tasksChart"></canvas>
                    </div>
                </div>
            `;
            statsSection.parentNode.insertBefore(chartsSection, statsSection.nextSibling);
        }
    }

    // Calcular presupuesto desde JSON
    let totalGastado = 0;
    let totalPresupuesto = presupuestoData?.total || 0;

    if (presupuestoData?.rubros) {
        // Sumar todos los pagos realizados
        presupuestoData.rubros.forEach(rubro => {
            totalGastado += rubro.pagado || 0;
        });
    }

    // Si hay pagos adicionales, sumarlos
    if (presupuestoData?.pagos) {
        presupuestoData.pagos.forEach(pago => {
            totalGastado += pago.monto || 0;
        });
    }

    const disponible = totalPresupuesto - totalGastado;

    // Budget Chart
    const budgetCtx = document.getElementById('budgetChart');
    if (budgetCtx && typeof Chart !== 'undefined') {
        // Si no hay datos, mostrar mensaje
        if (totalPresupuesto === 0) {
            budgetCtx.parentElement.innerHTML += '<p style="text-align: center; color: #999; margin-top: 20px;">Configure el presupuesto en presupuesto.json</p>';
            return;
        }

        new Chart(budgetCtx, {
            type: 'doughnut',
            data: {
                labels: ['Gastado', 'Disponible'],
                datasets: [{
                    data: [totalGastado, disponible > 0 ? disponible : 0],
                    backgroundColor: ['#e94560', '#00b894'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '$' + context.parsed.toLocaleString('es-MX');
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
}

function createGuestsChart() {
    const guestsCtx = document.getElementById('guestsChart');
    if (!guestsCtx || typeof Chart === 'undefined') return;

    // Obtener datos de invitados desde JSON
    const confirmados = eventoData?.invitados?.numeroConfirmado || 0;
    const estimado = eventoData?.invitados?.numeroEstimado || 0;
    const pendientes = estimado - confirmados > 0 ? estimado - confirmados : 0;

    // Si no hay datos, mostrar mensaje
    if (estimado === 0) {
        guestsCtx.parentElement.innerHTML += '<p style="text-align: center; color: #999; margin-top: 20px;">Configure invitados en evento.json</p>';
        return;
    }

    new Chart(guestsCtx, {
        type: 'pie',
        data: {
            labels: ['Confirmados', 'Pendientes'],
            datasets: [{
                data: [confirmados, pendientes],
                backgroundColor: ['#00b894', '#fdcb6e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed + ' personas';
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function createTasksProgress() {
    const tasksCtx = document.getElementById('tasksChart');
    if (!tasksCtx || typeof Chart === 'undefined') {
        console.warn('tasksChart canvas no encontrado o Chart.js no cargado');
        return;
    }

    // Calcular información completa vs pendiente
    let completados = 0;
    let pendientes = 0;

    console.log('Analizando datos para gráfica de información...');

    // Analizar datos de evento.json - CAMPOS PRINCIPALES
    if (eventoData) {
        const camposEvento = [
            { nombre: 'Nombre quinceañera', valor: eventoData.quinceañera?.nombre },
            { nombre: 'Madre', valor: eventoData.padres?.madre },
            { nombre: 'Padre', valor: eventoData.padres?.padre },
            { nombre: 'Padrino', valor: eventoData.padrinos?.padrino },
            { nombre: 'Madrina', valor: eventoData.padrinos?.madrina },
            { nombre: 'Fecha evento', valor: eventoData.fechas?.evento },
            { nombre: 'Hora misa', valor: eventoData.fechas?.horaMisa },
            { nombre: 'Hora recepción', valor: eventoData.fechas?.horaRecepcion },
            { nombre: 'Fecha límite RSVP', valor: eventoData.fechas?.confirmacionLimite },
            { nombre: 'Iglesia', valor: eventoData.ubicaciones?.iglesia?.nombre },
            { nombre: 'Dirección iglesia', valor: eventoData.ubicaciones?.iglesia?.direccion },
            { nombre: 'Salón', valor: eventoData.ubicaciones?.salon?.nombre },
            { nombre: 'Dirección salón', valor: eventoData.ubicaciones?.salon?.direccion },
            { nombre: 'Número estimado invitados', valor: eventoData.invitados?.numeroEstimado }
        ];

        camposEvento.forEach(campo => {
            if (campo.valor !== null && campo.valor !== undefined && campo.valor !== '' && campo.valor !== 0) {
                completados++;
                console.log('✓ Completado:', campo.nombre, '=', campo.valor);
            } else {
                pendientes++;
                console.log('⚠ Pendiente:', campo.nombre);
            }
        });
    } else {
        console.warn('eventoData no disponible');
    }

    // Analizar presupuesto - RUBROS
    if (presupuestoData?.rubros) {
        console.log('Analizando', presupuestoData.rubros.length, 'rubros del presupuesto...');
        presupuestoData.rubros.forEach(rubro => {
            if (rubro.estado === 'completado' || (rubro.pagado && rubro.pagado > 0)) {
                completados++;
                console.log('✓ Rubro pagado:', rubro.concepto, '- $' + rubro.pagado);
            } else {
                pendientes++;
                console.log('⚠ Rubro pendiente:', rubro.concepto);
            }
        });
    } else {
        console.warn('presupuestoData.rubros no disponible');
    }

    console.log('📊 RESUMEN:', completados, 'completados,', pendientes, 'pendientes');

    // Crear gráfica
    new Chart(tasksCtx, {
        type: 'bar',
        data: {
            labels: ['Completados', 'Pendientes'],
            datasets: [{
                label: 'Campos de Información',
                data: [completados, pendientes],
                backgroundColor: ['#00b894', '#fdcb6e'],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 12 }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const total = completados + pendientes;
                            const porcentaje = ((context.parsed.y / total) * 100).toFixed(1);
                            return context.parsed.y + ' campos (' + porcentaje + '%)';
                        }
                    }
                }
            }
        }
    });

    console.log('✓ Gráfica de información creada exitosamente');
}

// Analizar presupuesto
    if (presupuestoData?.rubros) {
        presupuestoData.rubros.forEach(rubro => {
            if (rubro.estado === 'completado' || rubro.pagado > 0) {
                completados++;
            } else {
                pendientes++;
            }
        });
    }

    new Chart(tasksCtx, {
        type: 'bar',
        data: {
            labels: ['Completados', 'Pendientes'],
            datasets: [{
                label: 'Información',
                data: [completados, pendientes],
                backgroundColor: ['#6c5ce7', '#fdcb6e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' items';
                        }
                    }
                }
            }
        }
    });
}
