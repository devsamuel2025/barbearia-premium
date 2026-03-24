// Sticky Navbar Effect
window.addEventListener('scroll', function() {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        });
    });
}

// Smooth Scrolling for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Set min date to today for the booking form
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Form Submission with Google Sheets Integration
const form = document.getElementById('booking-form');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK1QFtrta_5tuATcjiXoY_nbjjV2XB45NMFkDecG9Fbp_XnaWEmTDOKTvHSMUYASXI/exec'; // Link FINAL sem o "SIM"!🏆💈

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        
        // Form Data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            client_phone: document.getElementById('client_phone').value, // Novo campo WhatsApp do Cliente
            message: document.getElementById('message').value || "Nenhuma mensagem adicional"
        };
        
        btn.innerText = 'PROCESSANDO...';
        btn.disabled = true;

        // Note: For this to work, the user needs to provide the SCRIPT_URL from Google Apps Script
        if (SCRIPT_URL === 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI') {
            // Local simulation if URL not provided
            setTimeout(() => {
                alert(`SIMULAÇÃO ATIVA:\n\nAgendamento feito para ${formData.name} no dia ${formData.date} às ${formData.time}.\n\nPara o sistema real funcionar, configure o URL do Google Apps Script.`);
                btn.innerText = originalText;
                btn.disabled = false;
                form.reset();
            }, 1000);
            return;
        }

        // Real Submission to Google Sheets (More robust version)
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 
                'Content-Type': 'text/plain;charset=utf-8' 
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            alert(`✅ Sucesso! Agendamento enviado para ${formData.name} no dia ${formData.date} às ${formData.time}.\nVerifique sua planilha e e-mail.`);
            form.reset();
        })
        .catch(error => {
            console.error('Erro no agendamento:', error);
            alert('Ops! Ocorreu um erro ao enviar seu agendamento. Verifique se o Google Apps Script está publicado corretamente.');
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
    });
}
