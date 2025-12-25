// Dashboard Charts using Chart.js - CARGA DATOS DESDE JSON
// Agregar al final del admin.html: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
// Agregar al final del admin.html: <script src="js/dashboard-charts.js"></script>

let presupuestoData = null;
let eventoData = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos desde JSON
    try {
        const [presupuestoResponse, eventoResponse] = await Promise.all([
            fetch('data/presupuesto.json'),
            fetch('data/evento.json')
        ]);

        presupuestoData = await presupuestoResponse.json();
        eventoData = await eventoResponse.json();

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
    if (!tasksCtx || typeof Chart === 'undefined') return;

    // Calcular información completa vs pendiente
    let completados = 0;
    let pendientes = 0;

    // Analizar datos de evento.json
    if (eventoData) {
        // Contar campos completados vs null
        const campos = [
            eventoData.quinceañera?.nombre,
            eventoData.padres?.madre,
            eventoData.padres?.padre,
            eventoData.padrinos?.padrino,
            eventoData.padrinos?.madrina,
            eventoData.fechas?.evento,
            eventoData.fechas?.horaMisa,
            eventoData.fechas?.horaRecepcion,
            eventoData.ubicaciones?.iglesia?.nombre,
            eventoData.ubicaciones?.salon?.nombre
        ];

        campos.forEach(campo => {
            if (campo !== null && campo !== undefined && campo !== '') {
                completados++;
            } else {
                pendientes++;
            }
        });
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
