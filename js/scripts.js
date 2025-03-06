// Navbar collapse when clicked off menu
document.addEventListener('click', function (event) {
    const navbar = document.querySelector('.navbar-collapse');
    const toggleButton = document.querySelector('.navbar-toggler');

    if (!navbar.contains(event.target) && !toggleButton.contains(event.target)) {
        // Close the navbar if clicked outside
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

document.getElementById('age').textContent = age;

