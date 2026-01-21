// Appointments Page JavaScript for Berhu Platform

// Services Data
const services = {
    reiki: {
        name: 'Reiki',
        description: 'Canalização de energia universal para cura e equilíbrio',
        price: 200,
        duration: '60 minutos',
        professional: 'Fabiana Berkana'
    },
    meditation: {
        name: 'Meditação Guiada',
        description: 'Sessões de meditação para equilíbrio e paz interior',
        price: 150,
        duration: '45 minutos',
        professional: 'Fabiana Berkana'
    },
    astrology: {
        name: 'Consulta de Astrologia',
        description: 'Mapa astral e consultas astrológicas personalizadas',
        price: 197,
        duration: '90 minutos',
        professional: 'Fabiana Berkana'
    },
    crystals: {
        name: 'Terapia com Cristais',
        description: 'Terapia energética com cristais e pedras',
        price: 250,
        duration: '75 minutos',
        professional: 'Fabiana Berkana'
    }
};

// Global Variables
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentDate = new Date();
let appointments = [];

// Initialize Appointments Page
document.addEventListener('DOMContentLoaded', function() {
    initializeAppointments();
});

// Initialize Appointments
function initializeAppointments() {
    checkSession();
    setupEventListeners();
    renderCalendar();
    loadMyAppointments();
}

// Check User Session
function checkSession() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    
    if (!session) {
        window.location.href = 'auth.html';
        return;
    }
    
    try {
        const sessionData = JSON.parse(session);
        if (new Date(sessionData.expiresAt) <= new Date()) {
            localStorage.removeItem('berhu_session');
            sessionStorage.removeItem('berhu_session');
            window.location.href = 'auth.html';
            return;
        }
        
        window.currentUser = sessionData.user;
    } catch (error) {
        console.error('Invalid session:', error);
        window.location.href = 'auth.html';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Service selection
    document.querySelectorAll('.service-option').forEach(option => {
        option.addEventListener('click', function() {
            selectService(this.dataset.service);
        });
    });
    
    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', previousMonth);
    document.getElementById('next-month').addEventListener('click', nextMonth);
    
    // Confirm appointment
    document.getElementById('confirm-appointment').addEventListener('click', confirmAppointment);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// Select Service
function selectService(serviceId) {
    selectedService = serviceId;
    
    // Update UI
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected', 'bg-purple-600', 'bg-opacity-20', 'ring-2', 'ring-purple-400');
    });
    
    const selectedElement = document.querySelector(`[data-service="${serviceId}"]`);
    selectedElement.classList.add('selected', 'bg-purple-600', 'bg-opacity-20', 'ring-2', 'ring-purple-400');
    
    // Update service info
    const service = services[serviceId];
    document.getElementById('selected-service-info').innerHTML = `
        <div class="space-y-3">
            <h4 class="font-semibold text-lg">${service.name}</h4>
            <p class="text-sm text-gray-300">${service.description}</p>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-gray-400">Duração:</span>
                    <span>${service.duration}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Profissional:</span>
                    <span>${service.professional}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Valor:</span>
                    <span class="font-bold text-purple-300">R$ ${service.price}</span>
                </div>
            </div>
        </div>
    `;
    
    updateAppointmentSummary();
    checkCanConfirm();
}

// Render Calendar
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Clear calendar
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        dayElement.className = 'calendar-day p-3 text-center rounded-lg cursor-pointer transition';
        dayElement.textContent = day;
        
        if (isToday) {
            dayElement.classList.add('bg-purple-600', 'bg-opacity-30', 'font-bold');
        } else if (isPast) {
            dayElement.classList.add('disabled', 'opacity-30', 'cursor-not-allowed');
        } else if (isWeekend) {
            dayElement.classList.add('bg-blue-600', 'bg-opacity-10');
        } else {
            dayElement.classList.add('hover:bg-white', 'hover:bg-opacity-10');
        }
        
        if (!isPast) {
            dayElement.addEventListener('click', () => selectDate(date));
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// Select Date
function selectDate(date) {
    selectedDate = date;
    
    // Update calendar UI
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected', 'bg-purple-600', 'bg-opacity-50', 'ring-2', 'ring-purple-400');
    });
    
    event.target.classList.add('selected', 'bg-purple-600', 'bg-opacity-50', 'ring-2', 'ring-purple-400');
    
    // Update date display
    const dateStr = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update selected date display in time slots section
    document.getElementById('selected-date-display').innerHTML = `
        <i class="fas fa-calendar-day mr-2"></i>${dateStr}
    `;
    
    document.getElementById('selected-datetime').innerHTML = `
        <div class="space-y-2">
            <p class="text-sm text-gray-400">Data selecionada:</p>
            <p class="font-semibold">${dateStr}</p>
        </div>
    `;
    
    // Load time slots for selected date
    loadTimeSlots(date);
    
    updateAppointmentSummary();
    checkCanConfirm();
}

// Load Time Slots
function loadTimeSlots(date) {
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';
    
    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);
    
    if (selectedDay < today) {
        timeSlotsContainer.innerHTML = '<p class="text-gray-400 text-center col-span-full">Não é possível agendar para datas passadas</p>';
        return;
    }
    
    // Generate time slots (8:00 - 18:00)
    const timeSlots = [];
    const now = new Date();
    const isToday = selectedDay.getTime() === today.getTime();
    
    for (let hour = 8; hour <= 18; hour++) {
        for (let minute of [0, 30]) {
            if (hour === 18 && minute === 30) break; // Don't include 18:30
            
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            // Check if time slot is in the past for today
            let isPast = false;
            if (isToday) {
                const slotTime = new Date();
                slotTime.setHours(hour, minute, 0, 0);
                isPast = slotTime <= now;
            }
            
            const isBooked = !isPast && isTimeSlotBooked(date, time);
            
            timeSlots.push({ time, isBooked, isPast });
        }
    }
    
    // Render time slots
    timeSlots.forEach(slot => {
        const slotElement = document.createElement('button');
        slotElement.className = 'time-slot p-3 rounded-lg text-sm font-medium transition';
        slotElement.textContent = slot.time;
        
        if (slot.isPast) {
            slotElement.classList.add('disabled', 'opacity-30', 'cursor-not-allowed', 'bg-gray-600', 'bg-opacity-20');
            slotElement.disabled = true;
            slotElement.title = 'Horário passado';
        } else if (slot.isBooked) {
            slotElement.classList.add('booked', 'bg-red-600', 'bg-opacity-20', 'cursor-not-allowed');
            slotElement.disabled = true;
            slotElement.title = 'Indisponível';
        } else {
            slotElement.classList.add('bg-white', 'bg-opacity-10', 'hover:bg-opacity-20', 'available');
            slotElement.addEventListener('click', () => selectTime(slot.time));
            slotElement.title = 'Disponível';
        }
        
        timeSlotsContainer.appendChild(slotElement);
    });
    
    // Add legend
    if (timeSlots.length > 0) {
        const legend = document.createElement('div');
        legend.className = 'col-span-full mt-4 flex justify-center space-x-6 text-xs text-gray-400';
        legend.innerHTML = `
            <span class="flex items-center"><span class="w-3 h-3 bg-white bg-opacity-20 rounded mr-1"></span> Disponível</span>
            <span class="flex items-center"><span class="w-3 h-3 bg-red-600 bg-opacity-20 rounded mr-1"></span> Indisponível</span>
            <span class="flex items-center"><span class="w-3 h-3 bg-gray-600 bg-opacity-20 rounded mr-1"></span> Passado</span>
        `;
        timeSlotsContainer.appendChild(legend);
    }
}

// Check if Time Slot is Booked
function isTimeSlotBooked(date, time) {
    const dateStr = date.toDateString();
    const userAppointments = JSON.parse(localStorage.getItem('berhu_appointments') || '[]');
    
    // Check if there's already an appointment for this date and time
    return userAppointments.some(appointment => {
        const appointmentDate = new Date(appointment.date).toDateString();
        return appointmentDate === dateStr && 
               appointment.time === time && 
               appointment.status !== 'cancelled';
    });
}

// Select Time
function selectTime(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected', 'bg-purple-600', 'bg-opacity-50', 'ring-2', 'ring-purple-400');
    });
    
    event.target.classList.add('selected', 'bg-purple-600', 'bg-opacity-50', 'ring-2', 'ring-purple-400');
    
    // Update datetime display
    const dateStr = selectedDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('selected-datetime').innerHTML = `
        <div class="space-y-2">
            <p class="text-sm text-gray-400">Data e horário selecionados:</p>
            <p class="font-semibold">${dateStr}</p>
            <p class="font-semibold text-purple-300">
                <i class="fas fa-clock mr-2"></i>${time}
            </p>
        </div>
    `;
    
    updateAppointmentSummary();
    checkCanConfirm();
}

// Update Appointment Summary
function updateAppointmentSummary() {
    const summary = document.getElementById('appointment-summary');
    const canShow = selectedService && selectedDate && selectedTime;
    
    if (canShow) {
        const service = services[selectedService];
        const dateStr = selectedDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update summary fields
        document.getElementById('summary-service').textContent = service.name;
        document.getElementById('summary-date').textContent = dateStr;
        document.getElementById('summary-time').textContent = selectedTime;
        document.getElementById('summary-duration').textContent = service.duration;
        document.getElementById('summary-price').textContent = `R$ ${service.price}`;
        
        // Show summary
        summary.classList.remove('hidden');
        
        // Hide initial help text
        const helpText = document.querySelector('#selected-datetime .text-gray-400');
        if (helpText) {
            helpText.style.display = 'none';
        }
    } else {
        // Hide summary
        summary.classList.add('hidden');
        
        // Show help text if nothing selected
        if (!selectedService && !selectedDate && !selectedTime) {
            const helpText = document.querySelector('#selected-datetime .text-gray-400');
            if (helpText) {
                helpText.style.display = 'block';
            }
        }
    }
}

// Check if Can Confirm Appointment
function checkCanConfirm() {
    const confirmBtn = document.getElementById('confirm-appointment');
    const canConfirm = selectedService && selectedDate && selectedTime;
    
    confirmBtn.disabled = !canConfirm;
}

// Confirm Appointment
function confirmAppointment() {
    if (!selectedService || !selectedDate || !selectedTime) {
        showNotification('Por favor, selecione serviço, data e horário', 'error');
        return;
    }
    
    // Validate appointment date is not in the past
    const now = new Date();
    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes);
    
    if (appointmentDateTime <= now) {
        showNotification('Não é possível agendar para uma data/horário no passado', 'error');
        return;
    }
    
    // Check if slot is still available
    if (isTimeSlotBooked(selectedDate, selectedTime)) {
        showNotification('Este horário já foi agendado. Por favor, escolha outro.', 'error');
        loadTimeSlots(selectedDate); // Refresh time slots
        return;
    }
    
    const service = services[selectedService];
    const appointment = {
        id: Date.now(),
        service: service.name,
        serviceType: selectedService,
        date: selectedDate.toISOString(),
        time: selectedTime,
        duration: service.duration,
        price: service.price,
        professional: service.professional,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        userId: window.currentUser?.email || 'anonymous'
    };
    
    // Show loading
    const confirmBtn = document.getElementById('confirm-appointment');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Agendando...';
    
    // Simulate API call
    setTimeout(() => {
        // Save appointment
        saveAppointment(appointment);
        
        // Show success modal
        showSuccessModal(appointment);
        
        // Reset selection
        resetSelection();
        
        // Reset button
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
    }, 1500);
}

// Save Appointment
function saveAppointment(appointment) {
    // Get existing appointments
    const existingAppointments = JSON.parse(localStorage.getItem('berhu_appointments') || '[]');
    
    // Add new appointment
    existingAppointments.push(appointment);
    
    // Save to localStorage
    localStorage.setItem('berhu_appointments', JSON.stringify(existingAppointments));
    
    // Update display
    loadMyAppointments();
}

// Show Success Modal
function showSuccessModal(appointment) {
    const modal = document.getElementById('success-modal');
    const date = new Date(appointment.date);
    const dateStr = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update modal content with appointment details
    modal.querySelector('h3').textContent = 'Agendamento Confirmado!';
    modal.querySelector('p').innerHTML = `
        Sua sessão de <strong>${appointment.service}</strong> foi agendada com sucesso!<br><br>
        <strong>Data:</strong> ${dateStr}<br>
        <strong>Horário:</strong> ${appointment.time}<br>
        <strong>Duração:</strong> ${appointment.duration}<br>
        <strong>Valor:</strong> R$ ${appointment.price}<br><br>
        Você receberá um e-mail de confirmação com os detalhes.
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Success Modal
function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Reset Selection
function resetSelection() {
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    
    // Reset UI
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected', 'bg-purple-600', 'bg-opacity-20', 'ring-2', 'ring-purple-400');
    });
    
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected', 'bg-purple-600', 'bg-opacity-50', 'ring-2', 'ring-purple-400');
    });
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected', 'bg-purple-600', 'bg-opacity-50', 'ring-2', 'ring-purple-400');
    });
    
    document.getElementById('selected-service-info').innerHTML = '<p class="text-gray-400">Selecione um serviço para continuar</p>';
    document.getElementById('selected-datetime').innerHTML = `
        <div class="text-gray-400">
            <i class="fas fa-info-circle mr-2"></i>
            Selecione serviço, data e horário para continuar
        </div>
    `;
    
    // Clear date display
    document.getElementById('selected-date-display').innerHTML = '';
    
    // Hide summary
    document.getElementById('appointment-summary').classList.add('hidden');
    
    checkCanConfirm();
}

// Load My Appointments
function loadMyAppointments() {
    const appointmentsContainer = document.getElementById('my-appointments');
    const userAppointments = JSON.parse(localStorage.getItem('berhu_appointments') || '[]');
    
    if (userAppointments.length === 0) {
        appointmentsContainer.innerHTML = '<p class="text-gray-400 text-sm">Nenhum agendamento encontrado</p>';
        return;
    }
    
    appointmentsContainer.innerHTML = '';
    
    // Sort appointments by date
    userAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    userAppointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsContainer.appendChild(appointmentCard);
    });
}

// Create Appointment Card
function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card bg-white bg-opacity-5 rounded-lg p-3 border border-white border-opacity-10';
    
    const date = new Date(appointment.date);
    const dateStr = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const statusColors = {
        confirmed: 'green',
        completed: 'blue',
        cancelled: 'red'
    };
    
    const statusTexts = {
        confirmed: 'Confirmado',
        completed: 'Realizado',
        cancelled: 'Cancelado'
    };
    
    const statusColor = statusColors[appointment.status] || 'gray';
    const statusText = statusTexts[appointment.status] || 'Pendente';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div>
                <h4 class="font-semibold text-sm">${appointment.service}</h4>
                <p class="text-xs text-gray-400">${appointment.professional}</p>
            </div>
            <span class="bg-${statusColor}-600 bg-opacity-20 px-2 py-1 rounded text-${statusColor}-300 text-xs">
                ${statusText}
            </span>
        </div>
        
        <div class="flex items-center justify-between text-xs text-gray-400">
            <span>
                <i class="fas fa-calendar mr-1"></i>${dateStr}
            </span>
            <span>
                <i class="fas fa-clock mr-1"></i>${appointment.time}
            </span>
        </div>
        
        <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-semibold text-purple-300">R$ ${appointment.price}</span>
            ${appointment.status === 'confirmed' ? `
                <button onclick="cancelAppointment(${appointment.id})" 
                        class="text-xs text-red-400 hover:text-red-300 transition">
                    Cancelar
                </button>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Cancel Appointment
function cancelAppointment(appointmentId) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
        return;
    }
    
    // Get appointments
    const appointments = JSON.parse(localStorage.getItem('berhu_appointments') || '[]');
    
    // Find and update appointment
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = 'cancelled';
        
        // Save updated appointments
        localStorage.setItem('berhu_appointments', JSON.stringify(appointments));
        
        // Reload appointments
        loadMyAppointments();
        
        showNotification('Agendamento cancelado com sucesso', 'success');
    }
}

// Calendar Navigation
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Logout
function logout() {
    localStorage.removeItem('berhu_session');
    sessionStorage.removeItem('berhu_session');
    window.location.href = 'auth.html';
}

// Show Notification
function showNotification(message, type = 'info', duration = 5000) {
    if (window.Berhu && window.Berhu.showNotification) {
        window.Berhu.showNotification(message, type, duration);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}
