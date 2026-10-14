// Navbar collapse when clicked off menu
document.addEventListener('click', function (event) {
    const navbar = document.querySelector('.navbar-collapse');
    const toggleButton = document.querySelector('.navbar-toggler');

    if (!navbar || !toggleButton) return;

    if (!navbar.contains(event.target) && !toggleButton.contains(event.target)) {
        if (navbar.classList.contains('show')) {
            const collapse = new bootstrap.Collapse(navbar, {
                toggle: false
            });
            collapse.hide();
        }
    }
});

// id: age updater
const birthdate = new Date('2002-02-22');
const currentDate = new Date();

let age = currentDate.getFullYear() - birthdate.getFullYear();
const month = currentDate.getMonth();
const day = currentDate.getDate();

if (month < birthdate.getMonth() || (month === birthdate.getMonth() && day < birthdate.getDate())) {
    age--;
}

const ageEl = document.getElementById('age');
if (ageEl) ageEl.textContent = age;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = currentDate.getFullYear();

document.querySelectorAll('.pr-button').forEach((card) => {
    const imageUrl = card.dataset.projectImage?.trim();
    let image;
    let overlay;

    if (imageUrl) {
        image = document.createElement('img');
        image.src = imageUrl;
        image.alt = '';
        image.setAttribute('aria-hidden', 'true');
        Object.assign(image.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            borderRadius: '0',
            objectFit: 'cover',
            opacity: '0.48',
            filter: 'blur(1px)',
            transform: 'scale(1.06)',
            transition: 'opacity 220ms ease, filter 220ms ease, transform 220ms ease',
            pointerEvents: 'none'
        });

        overlay = document.createElement('span');
        Object.assign(overlay.style, {
            position: 'absolute',
            inset: '0',
            backgroundColor: 'rgba(13, 19, 27, 0.48)',
            transition: 'background-color 220ms ease',
            pointerEvents: 'none'
        });

        card.prepend(image, overlay);
        const title = card.querySelector(':scope > div:first-of-type');
        const technologies = card.querySelector(':scope > div:last-of-type');
        if (title) Object.assign(title.style, { position: 'relative', zIndex: '1' });
        if (technologies) technologies.style.zIndex = '1';
        card.style.overflow = 'hidden';
    }

    card.style.transition = 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease';

    const showHover = () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 18px rgba(0, 0, 0, 0.35)';
        card.style.borderColor = '#66c0f4';
        if (image) {
            card.style.backgroundColor = 'transparent';
            image.style.opacity = '0.72';
            image.style.filter = 'blur(0.5px)';
            overlay.style.backgroundColor = 'rgba(13, 19, 27, 0.24)';
        }
    };

    const hideHover = () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = '';
        if (image) {
            card.style.backgroundColor = 'transparent';
            image.style.opacity = '0.48';
            image.style.filter = 'blur(1px)';
            overlay.style.backgroundColor = 'rgba(13, 19, 27, 0.48)';
        }
    };

    card.addEventListener('mouseenter', showHover);
    card.addEventListener('mouseleave', hideHover);
    card.addEventListener('focus', showHover);
    card.addEventListener('blur', hideHover);
});
