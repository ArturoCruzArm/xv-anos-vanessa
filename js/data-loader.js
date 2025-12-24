/**
 * DataLoader - Sistema de carga de datos desde JSON con cache en localStorage
 * XV Años Barbara Brittany
 */

class DataLoader {
    constructor() {
        this.cache = {};
        this.cachePrefix = 'xv-barbara-json-';
        this.cacheExpiry = 1000 * 60 * 60; // 1 hora
    }

    /**
     * Carga un archivo JSON con cache en localStorage
     * @param {string} file - Ruta del archivo JSON (ej: 'data/evento.json')
     * @returns {Promise<Object>} - Datos del JSON
     */
    async loadJSON(file) {
        try {
            // Verificar cache en memoria
            if (this.cache[file]) {
                console.log(`✓ Datos de ${file} cargados desde cache en memoria`);
                return this.cache[file];
            }

            // Verificar cache en localStorage
            const cacheKey = this.cachePrefix + file;
            const cached = localStorage.getItem(cacheKey);
            const cacheTime = localStorage.getItem(cacheKey + '-time');

            if (cached && cacheTime) {
                const age = Date.now() - parseInt(cacheTime);
                if (age < this.cacheExpiry) {
                    const data = JSON.parse(cached);
                    this.cache[file] = data;
                    console.log(`✓ Datos de ${file} cargados desde localStorage (${Math.round(age/1000)}s de antigüedad)`);
                    return data;
                }
            }

            // Cargar desde archivo
            console.log(`⟳ Cargando ${file} desde servidor...`);
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Guardar en cache
            this.cache[file] = data;
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheKey + '-time', Date.now().toString());

            console.log(`✓ Datos de ${file} cargados y guardados en cache`);
            return data;

        } catch (error) {
            console.error(`✗ Error cargando ${file}:`, error);
            return null;
        }
    }

    /**
     * Limpia el cache de un archivo específico o todo el cache
     * @param {string} file - Archivo a limpiar, o null para limpiar todo
     */
    clearCache(file = null) {
        if (file) {
            delete this.cache[file];
            localStorage.removeItem(this.cachePrefix + file);
            localStorage.removeItem(this.cachePrefix + file + '-time');
            console.log(`✓ Cache de ${file} limpiado`);
        } else {
            this.cache = {};
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.cachePrefix)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('✓ Todo el cache JSON limpiado');
        }
    }

    /**
     * Puebla un formulario con datos del JSON
     * @param {string} formId - ID del formulario
     * @param {Object} data - Datos del JSON
     * @param {string} prefix - Prefijo para los IDs de campos (opcional)
     */
    populateForm(formId, data, prefix = '') {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`⚠ Formulario ${formId} no encontrado`);
            return;
        }

        let fieldsPopulated = 0;
        let fieldsEmpty = 0;

        // Recorrer todos los campos con data-json-path
        const fields = form.querySelectorAll('[data-json-path]');

        fields.forEach(field => {
            const path = field.getAttribute('data-json-path');
            const value = this.getValueByPath(data, path);

            if (value !== null && value !== undefined && value !== '') {
                if (field.type === 'checkbox') {
                    field.checked = Boolean(value);
                } else if (field.tagName === 'SELECT') {
                    field.value = value;
                } else {
                    field.value = value;
                }
                fieldsPopulated++;
            } else {
                fieldsEmpty++;
            }
        });

        console.log(`✓ Formulario ${formId}: ${fieldsPopulated} campos poblados, ${fieldsEmpty} vacíos`);
    }

    /**
     * Obtiene un valor de un objeto usando notación de punto
     * @param {Object} obj - Objeto a consultar
     * @param {string} path - Ruta en notación de punto (ej: 'foro7.banquete.menu.entradas')
     * @returns {*} - Valor encontrado o null
     */
    getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => {
            return acc && acc[part] !== undefined ? acc[part] : null;
        }, obj);
    }

    /**
     * Establece un valor en un objeto usando notación de punto
     * @param {Object} obj - Objeto a modificar
     * @param {string} path - Ruta en notación de punto
     * @param {*} value - Valor a establecer
     */
    setValueByPath(obj, path, value) {
        const parts = path.split('.');
        const last = parts.pop();
        const target = parts.reduce((acc, part) => {
            if (!acc[part]) acc[part] = {};
            return acc[part];
        }, obj);
        target[last] = value;
    }

    /**
     * Guarda automáticamente cambios en localStorage
     * @param {string} section - Sección (ej: 'banquete', 'decoracion')
     * @param {string} formId - ID del formulario
     * @param {Object} data - Datos originales del JSON
     */
    autoSaveToLocalStorage(section, formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;

        const fields = form.querySelectorAll('[data-json-path]');
        const updatedData = JSON.parse(JSON.stringify(data)); // Clonar

        fields.forEach(field => {
            const path = field.getAttribute('data-json-path');
            let value;

            if (field.type === 'checkbox') {
                value = field.checked;
            } else if (field.type === 'number') {
                value = field.value ? parseFloat(field.value) : null;
            } else {
                value = field.value || null;
            }

            this.setValueByPath(updatedData, path, value);
        });

        // Guardar en localStorage con prefijo de sección
        const key = `xv-barbara-backup-${section}`;
        localStorage.setItem(key, JSON.stringify(updatedData));
        localStorage.setItem(key + '-time', new Date().toLocaleString('es-MX'));

        console.log(`💾 Auto-guardado: ${section} (${new Date().toLocaleTimeString()})`);

        // Mostrar indicador visual (opcional)
        this.showSaveIndicator();
    }

    /**
     * Muestra un indicador visual de guardado
     */
    showSaveIndicator() {
        let indicator = document.getElementById('save-indicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'save-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            indicator.innerHTML = '<i class="fas fa-check"></i> Guardado automáticamente';
            document.body.appendChild(indicator);
        }

        indicator.style.opacity = '1';

        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }

    /**
     * Obtiene los campos que están vacíos/null
     * @param {Object} data - Datos del JSON
     * @param {string} parentPath - Ruta padre (uso interno)
     * @returns {Array} - Lista de paths de campos vacíos
     */
    getMissingFields(data, parentPath = '') {
        const missing = [];

        for (const key in data) {
            const value = data[key];
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            if (value === null || value === undefined || value === '') {
                missing.push(currentPath);
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                // Recursivo para objetos anidados
                missing.push(...this.getMissingFields(value, currentPath));
            }
        }

        return missing;
    }

    /**
     * Restaura datos desde el backup de localStorage
     * @param {string} section - Sección a restaurar
     * @returns {Object|null} - Datos restaurados o null
     */
    restoreFromBackup(section) {
        const key = `xv-barbara-backup-${section}`;
        const backup = localStorage.getItem(key);
        const backupTime = localStorage.getItem(key + '-time');

        if (backup) {
            console.log(`✓ Backup encontrado de ${section} (${backupTime})`);
            return JSON.parse(backup);
        }

        console.log(`⚠ No hay backup de ${section}`);
        return null;
    }

    /**
     * Inicializa el sistema de auto-guardado en un formulario
     * @param {string} formId - ID del formulario
     * @param {string} section - Sección (ej: 'banquete')
     * @param {Object} data - Datos originales
     */
    initAutoSave(formId, section, data) {
        const form = document.getElementById(formId);
        if (!form) return;

        const fields = form.querySelectorAll('[data-json-path]');

        fields.forEach(field => {
            field.addEventListener('change', () => {
                this.autoSaveToLocalStorage(section, formId, data);
            });

            // También guardar al escribir en campos de texto (con debounce)
            if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                let timeout;
                field.addEventListener('input', () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        this.autoSaveToLocalStorage(section, formId, data);
                    }, 1000); // Esperar 1 segundo después de dejar de escribir
                });
            }
        });

        console.log(`✓ Auto-guardado activado para ${section}`);
    }
}

// Crear instancia global
const dataLoader = new DataLoader();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
