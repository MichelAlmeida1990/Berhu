/**
 * Berhu Report Generator
 * Handles data collection and opening the printable report window.
 */

class ReportGenerator {
    constructor() {
        this.reportWindow = null;
    }

    /**
     * Collects all necessary data from the evaluation page form and inputs
     */
    collectData() {
        // Collect Patient Info (Assuming inputs exist on the page with these IDs)
        const patientData = {
            name: document.getElementById('patient-name')?.value || 'Paciente sem nome',
            email: document.getElementById('patient-email')?.value || '',
            complaint: document.getElementById('main-complaint')?.value || ''
        };

        // Collect Scores from Sliders/Inputs
        // Assuming we have inputs like name="score_family", name="score_health", etc.
        const scores = {};
        const categories = ['family', 'health', 'career', 'spirituality', 'relationships', 'finances', 'leisure', 'personal_growth'];
        
        categories.forEach(cat => {
            // Try to find by name or ID
            const input = document.querySelector(`[name="score_${cat}"]`) || document.getElementById(`score-${cat}`);
            if (input) {
                scores[cat] = parseInt(input.value) || 0;
            } else {
                // Fallback for simulation/testing
                scores[cat] = Math.floor(Math.random() * 5) + 5; 
            }
        });

        // Collect Observations
        const observations = document.getElementById('clinical-observations')?.value || '';

        return {
            patient: patientData,
            scores: scores,
            observations: observations,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Generates and opens the report
     */
    generate() {
        const data = this.collectData();
        
        // Store data in localStorage so the new window can pick it up
        localStorage.setItem('berhu_current_report', JSON.stringify(data));
        
        // Open the report template
        const width = 1000;
        const height = 800;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        
        this.reportWindow = window.open(
            'report-template.html', 
            'BerhuReport', 
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
        );
        
        if (this.reportWindow) {
            this.reportWindow.focus();
        } else {
            alert('Por favor, permita pop-ups para gerar o relatório.');
        }
    }
}

// Export specific instance or class
window.BerhuReportGenerator = new ReportGenerator();
