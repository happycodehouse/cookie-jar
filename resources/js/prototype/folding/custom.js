(function () {
    const secPlot = document.getElementById("secPlot");
    const stickyPlot = document.getElementById("stickyPlot");
    const display = document.getElementById("foldEffectPlot");
    const plot = Array.from(document.getElementsByClassName("plot"));
    const contentPlot = Array.from(document.getElementsByClassName("content_plot"))
    const originContentPlot = document.getElementById("originContentPlot");

    let scaleFix = 0.992;

    let state = {
        disposed: false,
        targetScroll: 0,
        scroll: 0
    }

    function lerp(current, target, speed = 0.1, limit = 0.001) {
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
            this.copyContents = [];
        }

        setContent(originContent, createScrollers = true) {
            const folds = this.folds;
            if (!folds) return;

            let scrollers = [];

            for (let i = 0; i < folds.length; i++) {
                const fold = folds[i];
                const copyContent = originContent.cloneNode(true);
                copyContent.id = "";
                this.copyContents.push(copyContent);
                let scroller;

                if (createScrollers) {
                    let sizeFixEle = document.createElement("div");
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

                scroller.children[0].style.transform = `translateY(${scroll}px)`;
            }
        }

        resetCopyContentsTransform() {
            this.copyContents.forEach(content => {
                content.style.transform = "";
            });
        }
    }

    let animationFrameId;
    let insideLyrics;
    const centerFold = plot[Math.floor(plot.length / 2)];

    let tickLyrics = () => {
        if (state.disposed) return;

        secPlot.style.height = insideLyrics.scrollers[0].children[0].clientHeight - centerFold.clientHeight + window.innerHeight + "px";

        state.targetScroll = -(
            document.documentElement.scrollTop - stickyPlot.clientHeight || document.body.scrollTop - window.innerHeight - stickyPlot.clientHeight
        );


        state.scroll += lerp(state.scroll, state.targetScroll, 0.1, 0.0001);

        insideLyrics.updateStyles(state.scroll);

        animationFrameId = requestAnimationFrame(tickLyrics);
    }

    insideLyrics = new FoldedDom(display, plot);
    insideLyrics.setContent(originContentPlot);
    tickLyrics();

    let insideAlbums;

    let tickAlbums = () => {

    }

    const effectPlot = gsap.timeline({
        scrollTrigger: {
            id: "effectPlot",
            start: "top top",
            end: `${secPlot.clientHeight}`,
            markers: true,
            onEnter: () => {
                stickyPlot.classList.add("fixed");
            },
            onLeave: () => {
                console.log("onLeave");
            },
            onLeaveBack: () => {
                console.log("onLeaveBack");
            }
        }
    });

    const secCharacter = document.getElementById("secCharacter");

    const effectCharacter = gsap.timeline({
        scrollTrigger: {
            id: "effectCharacter",
            trigger: secCharacter,
            start: "top 1",
            end: "bottom bottom",
            scrub: 2,
            markers: true,
            onEnter: () => {
                console.log("onEnter");
            },
            onLeaveBack: () => {
                characterTrigger.classList.remove("hidden");
            }
        }
    }).to(".black_cd", {
        duration: 0.75,
        bottom: "-150%",
        transform: "scale(1)",
        onReverseComplete: () => {
            console.log("Aaa")
        }
    });

    const characterTrigger = document.getElementById("characterTrigger");

    characterTrigger.addEventListener("click", function () {
        gsap.to(".black_cd", {
            duration: 0.75,
            transform: "scale(2)",
        });
        characterTrigger.classList.add("hidden");
    });
}());