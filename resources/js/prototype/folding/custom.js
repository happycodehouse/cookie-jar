(function () {
    const secPlot = document.getElementById("secPlot");
    const stickyPlot = document.getElementById("stickyPlot");
    const displayPlot = document.getElementById("foldEffectPlot");
    const plots = Array.from(document.getElementsByClassName("plot"));
    const originContentPlot = document.getElementById("originContentPlot");

    const secCharacter = document.getElementById("secCharacter");
    const displayCharacter = document.getElementById("foldEffectCharacter");
    const characters = Array.from(document.getElementsByClassName("character"));
    const originContentCharacter = document.getElementById("originContentCharacter");

    let scaleFix = 0.992;

    // let state = {
    //     disposed: false,
    //     targetScroll: 0,
    //     scroll: 0
    // }

    let statePlots = {
        disposed: false,
        targetScroll: 0,
        scroll: 0
    }

    let stateCharacters = {
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

                if (folds === plots) {
                    scroller.children[0].style.transform = `translateY(${scroll}px)`;
                } else if (folds === characters) {
                    scroller.children[0].style.transform = `translateX(${scroll}px)`;
                }

            }
        }

        resetCopyContentsTransform() {
            this.copyContents.forEach(content => {
                content.style.transform = "";
            });
        }
    }

    let animationFrameId;
    let insidePlot;
    const centerFold = plots[Math.floor(plots.length / 2)];

    let tickPlots = () => {
        if (statePlots.disposed) return;

        secPlot.style.height = insidePlot.scrollers[0].children[0].clientHeight - centerFold.clientHeight + window.innerHeight + "px";

        statePlots.targetScroll = -(
            document.documentElement.scrollTop - stickyPlot.clientHeight || document.body.scrollTop - window.innerHeight - stickyPlot.clientHeight
        );


        statePlots.scroll += lerp(statePlots.scroll, statePlots.targetScroll, 0.1, 0.0001);

        insidePlot.updateStyles(statePlots.scroll);

        animationFrameId = requestAnimationFrame(tickPlots);
    }

    insidePlot = new FoldedDom(displayPlot, plots);
    insidePlot.setContent(originContentPlot);
    tickPlots();

    let insideCharacters;
    const mainFold = characters[characters.length - 1];

    let tickCharacters = () => {
        if (stateCharacters.disposed) return;

        stateCharacters.targetScroll = Math.max(
            -insideCharacters.scrollers[0].children[0].clientWidth + mainFold.clientWidth
        );

        stateCharacters.scroll += lerp(stateCharacters.scroll, stateCharacters.targetScroll, 0.1, 0.0001);

        insideCharacters.updateStyles(stateCharacters.scroll);

        requestAnimationFrame(tickCharacters);
    }

    insideCharacters = new FoldedDom(displayCharacter, characters);
    insideCharacters.setContent(originContentCharacter);

    const effectPlot = gsap.timeline({
        scrollTrigger: {
            id: "effectPlot",
            start: "top top",
            end: `${secPlot.clientHeight}`,
            markers: false,
            onEnter: () => {
                stickyPlot.classList.add("fixed");
            },
            onLeave: () => {
                triggerCharacter.classList.remove("hidden");

                gsap.to(".display_character", {
                    alpha: 0,
                    visibility: "hidden",
                });
            },
        }
    });

    const sec3 = gsap.timeline({
        scrollTrigger: {
            id: "sec3",
            trigger: secCharacter,
            start: "1 1",
            end: "1 bottom",
            scrub: 1,
            markers: false,
            onEnter: () => {
                console.log("onEnter");
            },
            onLeaveBack: () => {
            }
        }
    }).to(".circle", {
        delay: 0.5,
        duration: 1,
        bottom: "-150%",
        transform: "scale(1)",
        onReverseComplete: () => {
        }
    });

    const triggerCharacter = document.getElementById("triggerCharacter");

    triggerCharacter.addEventListener("click", function () {
        gsap.to(".circle", {
            duration: 0.75,
            transform: "scale(2)",
        });

        triggerCharacter.classList.add("hidden");

        gsap.to(".display_character", {
            delay: 0.5,
            duration: 0.75,
            alpha: 1,
            visibility: "visible",
        });
    });

    const effectCharacter = gsap.timeline({
        scrollTrigger: {
            id: "effectCharacter",
            trigger: displayCharacter,
            start: "1 1",
            end: "1 bottom",
            markers: true,
            onEnter: () => {

            },
            onLeave: () => {
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa")
            }
        }
    });
}());