(() => {
    'use strict';

    const modal = document.getElementById('js-modal');
    const openModalButtons = document.querySelectorAll('.js-open-modal');
    const closeModalButton = document.querySelector('.js-close-modal');

    openModalButtons.forEach(button => {
        button.addEventListener('click', event => {
            modal.style.display = "block";
            event.preventDefault();
        }, false);
    });

    closeModalButton.addEventListener('click', event => {
        modal.style.display = "none";
        event.preventDefault();
    }, false);

    window.onclick = event => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
})();
