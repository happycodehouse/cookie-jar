function initBanner() {
    const banner = document.querySelector('.rolling_banner');

    if (banner) {
        const knittingWrap = document.getElementsByClassName('knitting_wrap')[0];
        const template = document.getElementsByClassName('knitting')[0];
        const i = 24;

        knittingWrap.id = 'banner01'

        for (let j = 0; j < i; j++) {
            const clone = template.cloneNode(true);
            knittingWrap.appendChild(clone);
        }

        const clonedKnittingWrap = knittingWrap.cloneNode(true);
        clonedKnittingWrap.id = 'banner02'
        knittingWrap.parentNode.appendChild(clonedKnittingWrap);

        knittingWrap.classList.add('original');
        clonedKnittingWrap.classList.add('cloned');
    }
}