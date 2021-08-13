class ScrollSpy {
	constructor(menu) {
		this.menu = document.querySelector(menu)
		this.links = this.menu.querySelectorAll('.menu__link')

		window.addEventListener('scroll', () => {
			this.onScroll()
		})
	
		this.menu.addEventListener('click', (e) => {
			let link = e.target;
	
			if (link.classList.contains('menu__link')) {
				e.preventDefault()
				this.setActiveClass(link)
				this.scrollToTarget(link.hash)
			}
		});	
	}
	
    onScroll() {
		let pos = window.pageYOffset;
		for (let i = this.links.length - 1; i >= 0; i--) {
			let link = this.links[i];
			let target = document.querySelector(link.hash);
			
			if ((pos + window.innerHeight / 2) > target.offsetTop) {
                this.setActiveClass(link)				
                break
			}
		}
	}

    setActiveClass(link) {
        let active = this.menu.querySelector('.menu__link--active')
		if (active) {
			active.classList.remove('menu__link--active')
			link.classList.add('menu__link--active')
		}
    }

    scrollToTarget(id) {
		let target = document.querySelector(id)

		if (target !== null) {
			let pos = target.offsetTop - 64
			window.scrollTo({top: pos, behavior: 'smooth'})
		}
	}
}

const menuHeader = new ScrollSpy('.header__menu')
const menuFooter = new ScrollSpy('.footer__menu')
