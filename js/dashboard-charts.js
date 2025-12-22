// Dashboard Charts using Chart.js
// Agregar al final del admin.html: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
// Agregar al final del admin.html: <script src="js/dashboard-charts.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the page to load
    setTimeout(() => {
        createBudgetChart();
        createGuestsChart();
        createTasksProgress();
    }, 500);
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
                            <i class="fas fa-tasks"></i> Tareas
                        </h3>
                        <canvas id="tasksChart"></canvas>
                    </div>
                </div>
            `;
            statsSection.parentNode.insertBefore(chartsSection, statsSection.nextSibling);
        }
    }

    // Budget Chart
    const budgetCtx = document.getElementById('budgetChart');
    if (budgetCtx && typeof Chart !== 'undefined') {
        new Chart(budgetCtx, {
            type: 'doughnut',
            data: {
                labels: ['Gastado', 'Disponible'],
                datasets: [{
                    data: [50000, 100000], // Example data
                    backgroundColor: ['#e94560', '#00b894'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

function createGuestsChart() {
    const guestsCtx = document.getElementById('guestsChart');
    if (guestsCtx && typeof Chart !== 'undefined') {
        new Chart(guestsCtx, {
            type: 'pie',
            data: {
                labels: ['Confirmados', 'Pendientes', 'No Asisten'],
                datasets: [{
                    data: [80, 50, 20], // Example data
                    backgroundColor: ['#00b894', '#fdcb6e', '#d63031'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

function createTasksProgress() {
    const tasksCtx = document.getElementById('tasksChart');
    if (tasksCtx && typeof Chart !== 'undefined') {
        new Chart(tasksCtx, {
            type: 'bar',
            data: {
                labels: ['Completadas', 'Pendientes'],
                datasets: [{
                    label: 'Tareas',
                    data: [12, 8], // Example data
                    backgroundColor: ['#6c5ce7', '#fdcb6e'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}
