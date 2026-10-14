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

const makeSkillIcon = (skill, key, size = skill.iconSize) => {
    const icon = document.createElement('i');
    icon.classList.add(...skill.iconClass.split(/\s+/), size);
    icon.setAttribute('aria-hidden', 'true');
    icon.title = skill.label;
    icon.dataset.skill = key;
    return icon;
};

const renderProfileSkills = (projectsData) => {
    const container = document.querySelector('[data-profile-skills]');
    if (!container) return;

    projectsData.profileSkills.forEach((key) => {
        const skill = projectsData.skills[key];
        if (!skill) return;

        const item = document.createElement('div');
        item.className = 'd-flex justify-content-between align-items-center';
        item.append(makeSkillIcon(skill, key));

        const label = document.createElement('span');
        label.textContent = skill.label;
        item.append(label);
        container.append(item);
    });
};

const addProjectLink = (container, href, label, className) => {
    if (!href) return;

    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    link.setAttribute('aria-label', label);
    Object.assign(link.style, {
        position: 'relative',
        zIndex: '1',
        color: '#ffffff',
        fontSize: '0.75rem',
        textDecoration: 'underline'
    });
    if (className) link.className = className;
    container.append(link);
};

const getProjectImages = (project) => {
    const images = Array.isArray(project.images) ? project.images : [project.images];
    const validImages = images.filter((imagePath) => typeof imagePath === 'string' && imagePath.trim());
    return validImages.length ? validImages : (project.image ? [project.image] : []);
};

const initializeProjectCard = (card, project, skills) => {
    let image;
    let overlay;
    const imagePath = getProjectImages(project)[0] || '';

    if (imagePath) {
        image = document.createElement('img');
        image.src = imagePath;
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
        card.append(image, overlay);
        card.style.overflow = 'hidden';
    }

    const title = document.createElement('span');
    title.textContent = project.title;
    Object.assign(title.style, {
        position: 'relative',
        zIndex: '1',
        color: '#ffffff'
    });
    card.append(title);

    const technologyRow = document.createElement('div');
    technologyRow.className = 'position-absolute bottom-0 start-0 p-1 d-flex gap-1';
    technologyRow.style.zIndex = '1';
    project.skills.forEach((key) => {
        const skill = skills[key];
        if (skill) {
            const icon = makeSkillIcon(skill, key, skill.projectIconSize);
            icon.style.lineHeight = '1';
            technologyRow.append(icon);
        }
    });
    card.append(technologyRow);

    const links = document.createElement('div');
    links.className = 'position-absolute bottom-0 end-0 p-1 d-flex gap-2';
    links.style.zIndex = '1';
    addProjectLink(links, project.pagesUrl, 'Demo', 'project-demo-link');
    addProjectLink(links, project.repositoryUrl, 'Code', 'project-repository-link');
    card.append(links);

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (event) => event.stopPropagation());
    });

    const openProjectModal = () => {
        const modalEl = document.getElementById('projectModal');
        if (!modalEl) return;

        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        const modalTitle = document.getElementById('projectModalTitle');
        modalTitle.textContent = project.title;

        const resizeModalTitle = () => {
            const availableWidth = modalTitle.clientWidth;
            const maxFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) * 1.5;
            if (!availableWidth) return;

            const titleLength = [...modalTitle.textContent].length;
            const fontSize = titleLength
                ? Math.min(maxFontSize, (availableWidth * 0.8) / titleLength)
                : maxFontSize;
            modalTitle.style.fontSize = `${fontSize}px`;
        };

        const handleModalShown = () => {
            resizeModalTitle();
            window.addEventListener('resize', resizeModalTitle);
        };
        const handleModalHidden = () => window.removeEventListener('resize', resizeModalTitle);
        modalEl.addEventListener('shown.bs.modal', handleModalShown, { once: true });
        modalEl.addEventListener('hidden.bs.modal', handleModalHidden, { once: true });

        const modalImages = document.getElementById('projectModalImages');
        const imagePaths = getProjectImages(project);
        modalImages.replaceChildren();
        modalImages.hidden = imagePaths.length === 0;
        imagePaths.forEach((imagePath, index) => {
            const modalImage = document.createElement('img');
            modalImage.src = imagePath;
            modalImage.alt = `${project.title} image ${index + 1}`;
            modalImages.append(modalImage);
        });

        document.getElementById('projectModalDescription').textContent =
            project.description || 'No description available yet.';

        const modalLinks = document.getElementById('projectModalLinks');
        modalLinks.replaceChildren();
        addModalProjectLink(modalLinks, project.pagesUrl, 'Live Demo');
        addModalProjectLink(modalLinks, project.repositoryUrl, 'View Code');

        modal.show();
    };

    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', openProjectModal);
    card.addEventListener('keydown', (event) => {
        if (event.target.closest('a')) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProjectModal();
        }
    });

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
    card.addEventListener('focusin', showHover);
    card.addEventListener('focusout', (event) => {
        if (!card.contains(event.relatedTarget)) hideHover();
    });
};

const addModalProjectLink = (container, href, label) => {
    if (!href) return;

    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    link.className = 'btn btn-sm project-modal-link';
    container.append(link);
};

const getProjectColumnCount = (projectCount) => {
    if (projectCount <= 3) return Math.max(projectCount, 1);

    const layouts = [3, 4].map((columns) => ({
        columns,
        emptySlots: Math.ceil(projectCount / columns) * columns - projectCount
    }));

    return layouts.reduce((best, current) => {
        if (current.emptySlots < best.emptySlots) return current;
        if (current.emptySlots === best.emptySlots && current.columns > best.columns) return current;
        return best;
    }).columns;
};

const renderProjects = (projectsData) => {
    const container = document.querySelector('[data-project-grid]');
    if (!container) return;

    container.style.setProperty('--project-columns', getProjectColumnCount(projectsData.projects.length));

    projectsData.projects.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'btn pr-button';
        card.dataset.projectId = project.id;
        card.setAttribute('aria-label', project.title);
        initializeProjectCard(card, project, projectsData.skills);
        container.append(card);
    });
};

const loadPortfolioData = async () => {
    try {
        const response = await fetch('./list_of_projects.json');
        if (!response.ok) throw new Error(`Project data request failed: ${response.status}`);

        const projectsData = await response.json();
        renderProfileSkills(projectsData);
        renderProjects(projectsData);
    } catch (error) {
        console.error('Could not load portfolio project data.', error);
    }
};

void loadPortfolioData();
