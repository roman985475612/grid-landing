// Works

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


// Skills

function moveProgressBar(node, nodeLine, nodeTooltip, speed = 1500) {
    const progressElements = document.querySelectorAll(node)

    progressElements.forEach((elem) => {
        let progress = elem.dataset.progress
        let bar = elem.querySelector(nodeLine)
        let tooltip = elem.querySelector(nodeTooltip)

        bar.style.transitionDuration = (speed / 1000) + 's'
        bar.style.width = progress + '%'

        tooltip.innerHTML = progress + '%'
        setTimeout(() => {
            tooltip.classList.add('d-block')
        }, speed)
    })
}

const skills = document.querySelector('.skills')
let animate = true

window.addEventListener('scroll', () => {
    if (window.pageYOffset + 500 > skills.offsetTop && animate) {
        moveProgressBar('.progress__element', '.progress__bar', '.progress__tooltip', 1500)
        animate = false
    } 
})


