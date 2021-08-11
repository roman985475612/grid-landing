const worksList = document.querySelector('.works__list')

worksList.addEventListener('focusin', e => {
    if (e.target.classList.contains('works__btn')) {
        e.target.parentElement.parentElement.parentElement.classList.add('works__item--active')
    }
})

worksList.addEventListener('focusout', e => {
    if (e.target.classList.contains('works__btn')) {
        e.target.parentElement.parentElement.parentElement.classList.remove('works__item--active')
    }
})

