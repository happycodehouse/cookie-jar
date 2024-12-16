document.addEventListener("DOMContentLoaded", function() {
    const inner = document.getElementById("fold-effect-lyrics");
    const lyrics = Array.from(document.getElementsByClassName("lyrics"));
    const originContentLyrics = document.getElementById("origin-content-lyrics");

    const secLyrics = document.getElementsByClassName("sec2");
    const displayLyrics = document.getElementsByClassName("display");

    let scaleFix = 0.992;

    function lerp(current, target, speed= 0.1, limit= 0.001) {
        let change = (target - current) * speed;

        if (Math.abs(change) < limit) {
            change = target - current;
        }

        return change;
    }

    class FoldedDom {
        constructor(wrapper, folds = null, scrollers = null) {
            this.wrapper = wrapper;
            this.folds = folds;
            this.scrollers = [];
        }

        setContent(originContent, createScrollers = true) {
            const folds = this.folds;
            if (!folds) return;

            let scrollers = [];

            for (let i = 0; i < folds.length; i++) {
                const fold = folds[i];
                const copyContent = originContent.cloneNode(true);
                copyContent.id = "";
                let scroller;

                if (createScrollers) {
                    let sizeFixEle =  document.createElement("div");
                    sizeFixEle.classList.add("fold-size-fix");
                    // sizeFixEle.style.transform = `scaleY(${scaleFix})`;

                    scroller = document.createElement("div");
                    scroller.classList.add("fold-scroller");
                    sizeFixEle.append(scroller);
                    fold.append(sizeFixEle);
                } else {
                    scroller = this.scrollers[i];
                }

                scroller.append(copyContent);
                scrollers[i] = scroller;
            }
            this.scrollers = scrollers;
        }

        updateStyles(scroll, skewAmp, rotationAmp) {
            const folds = this.folds;
            const scrollers = this.scrollers;

            for (let i = 0; i < folds.length; i++) {
                const scroller = scrollers[i];

                // Scroller fixed so its aligned
                // scroller.style.transform = `translateY(${100 * -i}%)`;
                // And the content is the one that scrolls

                scroller.children[0].style.transform = `translateY(${scroll}px)`;
            }
        }
    }

    let insideLyrics;

    let tickLyrics = () => {
        if (state.disposed) return;

        // Calculate the scroll based on how much the content is outside the centerFold
        document.body.style.height = insideFold.scrollers[0].children[0].clientHeight - centerFold.clientHeight + window.innerHeight + "px";

        state.targetScroll = -(
            document.documentElement.scrollTop || document.body.scrollTop
        );

        state.scroll += lerp(state.scroll, state.targetScroll, 0.1, 0.0001);

        insideFold.updateStyles(state.scroll);
        // setScrollStyles(state.currentY);

        requestAnimationFrame(tickLyrics);
    }

    insideLyrics = new FoldedDom(inner, lyrics);
    insideLyrics.setContent(originContentLyrics);

    let insideAlbums;

    let tickAlbums = () => {

    }

    const effectLyrics = gsap.timeline({
        scrollTrigger: {
            id: "effectLyrics",
            trigger: secLyrics[0],
            start: "top 1",
            end: "bottom bottom",
            markers: false,
            onEnter: () => {
                displayLyrics[0].classList.add("fixed");
            },
            onLeaveBack: () => {
                displayLyrics[0].classList.remove("fixed");
            }
        }
    });
});