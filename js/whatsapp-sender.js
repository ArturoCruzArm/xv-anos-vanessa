/**
 * WhatsAppSender - Sistema de envío de datos por WhatsApp
 * XV Años Barbara Brittany
 */

class WhatsAppSender {
    constructor() {
        this.phoneNumber = '524779203776'; // Número internacional
        this.baseURL = 'https://wa.me/';
    }

    /**
     * Recolecta todos los datos de un formulario
     * @param {string} formId - ID del formulario
     * @returns {Object} - Objeto con los datos del formulario
     */
    collectFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`✗ Formulario ${formId} no encontrado`);
            return {};
        }

        const data = {};
        const fields = form.querySelectorAll('[data-json-path], [data-label]');

        fields.forEach(field => {
            const path = field.getAttribute('data-json-path');
            const label = field.getAttribute('data-label') || this.pathToLabel(path);
            let value;

            if (field.type === 'checkbox') {
                value = field.checked ? 'Sí' : 'No';
            } else if (field.tagName === 'SELECT') {
                value = field.options[field.selectedIndex]?.text || field.value;
            } else if (field.tagName === 'TEXTAREA') {
                value = field.value.trim();
            } else {
                value = field.value;
            }

            // Solo incluir si tiene valor
            if (value && value !== '' && value !== 'No') {
                data[label] = value;
            }
        });

        return data;
    }

    /**
     * Convierte un path JSON a una etiqueta legible
     * @param {string} path - Path del JSON
     * @returns {string} - Etiqueta legible
     */
    pathToLabel(path) {
        if (!path) return '';

        const labels = {
            // Banquete
            'servicios.banquete.numeroPersonas': 'Número de personas',
            'servicios.banquete.costoPorPersona': 'Costo por persona',
            'servicios.banquete.menu.entradas': 'Menú - Entradas',
            'servicios.banquete.menu.platoFuerte': 'Menú - Plato fuerte',
            'servicios.banquete.menu.bebidas': 'Menú - Bebidas',
            'servicios.banquete.menu.postres': 'Menú - Postres',
            'servicios.banquete.menu.menuVegetariano': 'Menú vegetariano disponible',
            'servicios.banquete.menu.menuSinGluten': 'Menú sin gluten disponible',
            'servicios.banquete.menu.menuNinos': 'Menú para niños',
            'servicios.banquete.restricciones': 'Restricciones alimenticias',
            'servicios.banquete.notasAdicionales': 'Notas adicionales',

            // Música
            'servicios.musica.costo': 'Costo del servicio',
            'servicios.musica.horarioInicio': 'Horario inicio',
            'servicios.musica.horarioFin': 'Horario fin',
            'servicios.musica.playlist.valsPadre': 'Vals con el padre',
            'servicios.musica.playlist.valsSorpresa': 'Vals sorpresa',
            'servicios.musica.playlist.chambelanes': 'Vals chambelanes',
            'servicios.musica.playlist.entradaQuinceañera': 'Entrada de la quinceañera',
            'servicios.musica.playlist.musicaRecepcion': 'Música de recepción',
            'servicios.musica.playlist.generosFiesta': 'Géneros para la fiesta',
            'servicios.musica.playlist.noReproducir': 'No reproducir',
            'servicios.musica.instruccionesEspeciales': 'Instrucciones especiales',

            // Decoración
            'servicios.decoracion.costo': 'Costo del servicio',
            'servicios.decoracion.colores.principal': 'Color principal',
            'servicios.decoracion.colores.secundario': 'Color secundario',
            'servicios.decoracion.colores.acento': 'Color de acento',
            'servicios.decoracion.tema': 'Tema decorativo',
            'servicios.decoracion.conceptoDecorativo': 'Concepto decorativo',
            'servicios.decoracion.notasEspeciales': 'Notas especiales',

            // Fotografía
            'servicios.fotografia.paquete': 'Paquete seleccionado',
            'servicios.fotografia.costo': 'Costo del servicio',
            'servicios.fotografia.detalles.fechaSesionPreEvento': 'Fecha sesión pre-evento',
            'servicios.fotografia.detalles.estiloFotografico': 'Estilo fotográfico',

            // Evento
            'quinceañera.nombre': 'Nombre de la quinceañera',
            'padres.madre': 'Nombre de la madre',
            'padres.padre': 'Nombre del padre',
            'fechas.diaEvento': 'Fecha del evento',
            'fechas.horaRecepcion': 'Hora de la recepción',
            'invitados.numeroEstimado': 'Número estimado de invitados',

            // Salón
            'ubicaciones.salon.nombre': 'Nombre del salón',
            'ubicaciones.salon.direccion': 'Dirección del salón',
            'ubicaciones.salon.contacto': 'Contacto del salón',
            'ubicaciones.salon.telefono': 'Teléfono del salón',
            'ubicaciones.salon.capacidad': 'Capacidad del salón',

            // Iglesia
            'ubicaciones.iglesia.nombre': 'Nombre de la iglesia',
            'ubicaciones.iglesia.direccion': 'Dirección de la iglesia',
            'ubicaciones.iglesia.padre': 'Nombre del padre/pastor'
        };

        return labels[path] || path.split('.').pop();
    }

    /**
     * Formatea los datos en un mensaje de WhatsApp
     * @param {Object} data - Datos recolectados
     * @param {string} section - Nombre de la sección (ej: "Banquete", "Música")
     * @param {string} emoji - Emoji para la sección (opcional)
     * @returns {string} - Mensaje formateado
     */
    formatMessage(data, section, emoji = '📝') {
        let message = `${emoji} *ACTUALIZACIÓN - XV AÑOS BARBARA BRITTANY*\n\n`;
        message += `*Sección:* ${section}\n`;
        message += `*Fecha:* ${new Date().toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}\n\n`;

        message += `━━━━━━━━━━━━━━━━━━\n\n`;

        // Agregar cada campo
        for (const [label, value] of Object.entries(data)) {
            if (value) {
                message += `▸ *${label}:*\n`;
                message += `  ${value}\n\n`;
            }
        }

        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📋 _Por favor actualizar el archivo correspondiente en GitHub_\n`;
        message += `⏰ Enviado: ${new Date().toLocaleTimeString('es-MX')}`;

        return message;
    }

    /**
     * Formatea mensaje para cotización de mobiliario
     * @param {Array} items - Items seleccionados con cantidades
     * @param {number} total - Total de la cotización
     * @returns {string} - Mensaje formateado
     */
    formatCotizacion(items, total) {
        let message = `💺 *COTIZACIÓN DE MOBILIARIO*\n`;
        message += `*XV Años Barbara Brittany*\n\n`;
        message += `*Fecha:* ${new Date().toLocaleDateString('es-MX')}\n\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;

        items.forEach(item => {
            if (item.cantidad > 0) {
                message += `▸ *${item.nombre}*\n`;
                message += `  Cantidad: ${item.cantidad}\n`;
                message += `  Precio unitario: $${item.precio.toFixed(2)}\n`;
                message += `  Subtotal: $${(item.cantidad * item.precio).toFixed(2)}\n\n`;
            }
        });

        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `💰 *TOTAL: $${total.toFixed(2)}*\n\n`;
        message += `📋 Solicito cotización formal de estos items\n`;
        message += `⏰ ${new Date().toLocaleTimeString('es-MX')}`;

        return message;
    }

    /**
     * Envía el mensaje por WhatsApp
     * @param {string} message - Mensaje a enviar
     */
    send(message) {
        const url = `${this.baseURL}${this.phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        console.log('✓ WhatsApp abierto con mensaje preparado');
    }

    /**
     * Envía información de un formulario específico
     * @param {string} formId - ID del formulario
     * @param {string} section - Nombre de la sección
     * @param {string} emoji - Emoji para el mensaje
     */
    sendFormData(formId, section, emoji = '📝') {
        const data = this.collectFormData(formId);

        if (Object.keys(data).length === 0) {
            alert('⚠️ No hay información para enviar. Por favor completa al menos un campo.');
            return;
        }

        const message = this.formatMessage(data, section, emoji);
        this.send(message);
    }

    /**
     * Previsualiza el mensaje antes de enviar
     * @param {string} formId - ID del formulario
     * @param {string} section - Nombre de la sección
     * @param {string} emoji - Emoji para el mensaje
     * @returns {string} - Mensaje formateado
     */
    preview(formId, section, emoji = '📝') {
        const data = this.collectFormData(formId);
        return this.formatMessage(data, section, emoji);
    }

    /**
     * Muestra un modal de confirmación antes de enviar
     * @param {string} formId - ID del formulario
     * @param {string} section - Nombre de la sección
     * @param {string} emoji - Emoji para el mensaje
     */
    confirmAndSend(formId, section, emoji = '📝') {
        const preview = this.preview(formId, section, emoji);

        // Crear modal de confirmación
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h3 style="margin-top: 0;">📱 Vista Previa del Mensaje</h3>
                <pre style="
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    white-space: pre-wrap;
                    font-family: monospace;
                    font-size: 12px;
                ">${preview}</pre>
                <div style="margin-top: 20px; text-align: right;">
                    <button onclick="this.closest('[style*=fixed]').remove()" style="
                        padding: 10px 20px;
                        margin-right: 10px;
                        background: #ccc;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Cancelar</button>
                    <button onclick="
                        whatsappSender.send(\`${preview.replace(/`/g, '\\`')}\`);
                        this.closest('[style*=fixed]').remove();
                    " style="
                        padding: 10px 20px;
                        background: #25D366;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        <i class='fab fa-whatsapp'></i> Enviar por WhatsApp
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }
}

// Crear instancia global
const whatsappSender = new WhatsAppSender();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppSender;
}
