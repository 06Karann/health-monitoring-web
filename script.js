window.app = {
    toggleView: function(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
        
        // Show target view
        const targetView = document.getElementById(viewId + '-view');
        if(targetView) targetView.classList.add('active-view');
        
        // Update sidebar active links if view is not landing
        if(viewId !== 'landing') {
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            // Find sidebar link corresponding to view
            document.querySelectorAll('.sidebar-nav li').forEach(li => {
                const onclickAttr = li.getAttribute('onclick');
                if(onclickAttr && onclickAttr.includes(viewId)) {
                    li.classList.add('active');
                } else if(viewId === 'dashboard' && li.innerText.includes('Overview')) {
                    li.classList.add('active');
                }
            });
        }
        
        // Scroll to top
        window.scrollTo(0,0);
    },
    
    // Tracking Add Vital Data
    addVitalData: function() {
        const date = document.getElementById('vital-date').value;
        const hr = document.getElementById('vital-hr').value;
        const sys = document.getElementById('vital-sys').value;
        const dia = document.getElementById('vital-dia').value;
        
        if(!date || !hr || !sys || !dia) {
            alert('Please fill all vital details');
            return;
        }
        alert(`Data for ${date} added successfully!\nHR: ${hr}bpm, BP: ${sys}/${dia}mmHg`);
        
        document.getElementById('vital-date').value = '';
        document.getElementById('vital-hr').value = '';
        document.getElementById('vital-sys').value = '';
        document.getElementById('vital-dia').value = '';
    },

    // Mental Wellbeing Features
    setMood: function(mood, btnElement) {
        document.querySelectorAll('.mood-btn').forEach(b => {
             b.style.transform = 'scale(1)';
             b.style.borderColor = 'transparent';
        });
        btnElement.style.transform = 'scale(1.1)';
        btnElement.style.borderColor = 'var(--primary)';
        alert(`Mood recorded as: ${mood}`);
    },

    calcStress: function() {
        const stressVal = document.getElementById('stress-slider').value;
        const sleep = document.getElementById('sleep-hours').value;
        let stressScore = "Moderate";
        
        if(stressVal > 7 || sleep === 'bad') {
             stressScore = "High 🚨 - Consider a short meditation session.";
             document.getElementById('stress-result').style.color = 'var(--red)';
        } else if(stressVal < 4 && sleep === 'good') {
             stressScore = "Low 🌟 - You are doing great!";
             document.getElementById('stress-result').style.color = 'var(--green)';
        } else {
             stressScore = "Moderate ⚖️ - Keep monitoring your stress.";
             document.getElementById('stress-result').style.color = 'var(--orange)';
        }
        
        document.getElementById('stress-result').innerText = `Analysis: ${stressScore}`;
    },

    timerInterval: null,
    startTimer: function(seconds) {
        this.stopTimer();
        let remaining = seconds;
        const display = document.getElementById('med-timer');
        
        const formatTime = (sec) => {
            const m = Math.floor(sec / 60).toString().padStart(2, '0');
            const s = (sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        display.innerText = formatTime(remaining);
        
        this.timerInterval = setInterval(() => {
            remaining--;
            if(remaining < 0) {
                this.stopTimer();
                display.innerText = "00:00";
                alert('Meditation session complete! Feel the calmness.');
                return;
            }
            display.innerText = formatTime(remaining);
        }, 1000);
    },

    stopTimer: function() {
        if(this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};

const app = window.app;

// Init script
document.addEventListener('DOMContentLoaded', () => {
    // Dropdown hiding
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.user-profile-nav')) {
            const dropdown = document.getElementById('profile-dropdown');
            if(dropdown) dropdown.classList.remove('show');
        }
    });

    // Reminders Logic
    const saveReminderBtn = document.getElementById('save-reminder-btn');
    if(saveReminderBtn) {
        saveReminderBtn.addEventListener('click', () => {
            const name = document.getElementById('reminder-name').value;
            const time = document.getElementById('reminder-time').value;
            if(!name || !time) return alert('Please enter both medication name and time.');
            
            const html = `
                <li class="reminder-item border border-1" style="margin-top: 1rem; padding: 1rem; border-radius: 8px;">
                    <div class="rem-info">
                        <h4 style="margin:0;">${name}</h4>
                        <p class="text-muted" style="margin-top: 5px;"><i class="ph ph-clock text-green"></i> at ${time}</p>
                    </div>
                </li>
            `;
            const fullList = document.getElementById('full-reminder-list');
            const dashList = document.getElementById('dashboard-reminder-list');
            if(fullList) fullList.innerHTML += html;
            if(dashList) dashList.innerHTML += html;
            
            document.getElementById('reminder-name').value = '';
            document.getElementById('reminder-time').value = '';
            alert('Reminder saved successfully!');
        });
    }

    // Contacts Logic
    const saveContactBtn = document.getElementById('save-contact-btn');
    if(saveContactBtn) {
        saveContactBtn.addEventListener('click', () => {
            const name = document.getElementById('contact-name').value;
            const number = document.getElementById('contact-number').value;
            if(!name || !number) return alert('Please enter both name and number.');
            
            const html = `
                <li class="reminder-item border border-1" style="margin-top: 1rem; padding: 1rem; border-radius: 8px;">
                    <div class="rem-info">
                        <h4 style="margin:0;">${name}</h4>
                        <p class="text-muted" style="margin-top: 5px;"><i class="ph ph-phone text-blue"></i> ${number}</p>
                    </div>
                </li>
            `;
            const list = document.getElementById('contacts-list');
            const pending = list.querySelector('.pending');
            if(pending) list.removeChild(pending);
            list.innerHTML += html;
            
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-number').value = '';
            alert('Emergency contact added!');
        });
    }

    // PDF Download mock
    const dlBtn = document.querySelector('.btn-download-pdf');
    if(dlBtn) {
        dlBtn.addEventListener('click', () => {
            alert('Downloading generic Diet Plan PDF...');
        });
    }

    // Chart.js init (for tracking)
    const ctx = document.getElementById('vitalsChart');
    if(ctx && window.Chart) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Avg Systolic BP (mmHg)',
                    data: [125, 122, 120, 118],
                    backgroundColor: '#FA5252'
                }, {
                    label: 'Avg Diastolic BP (mmHg)',
                    data: [85, 82, 80, 78],
                    backgroundColor: '#4C6EF5'
                }, {
                    label: 'Avg Heart Rate (bpm)',
                    data: [78, 75, 74, 72],
                    backgroundColor: '#12B886'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
});
