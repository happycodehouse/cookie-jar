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
    const dragCharacter = document.getElementById("dragCharacter");

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
                let scroller;

                copyContent.id = "";

                if (createScrollers) {
                    let sizeFixEle = document.createElement("div");
                    sizeFixEle.classList.add("fold-size-fix");

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

        updateStyles(scroll) {
            const folds = this.folds;
            const scrollers = this.scrollers;

            for (let i = 0; i < folds.length; i++) {
                const scroller = scrollers[i];

                if (this.folds === plots) {
                    scroller.children[0].style.transform = `translateY(${scroll}px)`;
                } else if (this.folds === characters) {
                    scroller.children[0].style.transform = `translateX(${scroll}px)`;
                }

            }
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

    let insideCharacter;
    const mainFold = characters[characters.length - 1];

    let tickCharacters = () => {
        if (stateCharacters.disposed) return;

        // Calculate targetScroll
        stateCharacters.targetScroll = Math.max(
            Math.min(0, stateCharacters.targetScroll),
            -insideCharacter.scrollers[0].children[0].clientWidth + mainFold.clientWidth,
            stateCharacters.targetScroll // maintain previous set targetScroll
        );

        stateCharacters.scroll += lerp(stateCharacters.scroll, stateCharacters.targetScroll, 0.1, 0.0001);

        insideCharacter.updateStyles(stateCharacters.scroll);

        requestAnimationFrame(tickCharacters);
    }

    let lastClientX = null;
    let isDown = false;
    let onDown = event => {
        isDown = true;
    }
    let onUp = event => {
        isDown = false;
        lastClientX = null;
    }

    insideCharacter = new FoldedDom(displayCharacter, characters);
    insideCharacter.setContent(originContentCharacter);
    tickCharacters();

    const effectPlot = gsap.timeline({
        scrollTrigger: {
            id: "effectPlot",
            start: "top bottom",
            end: `${secPlot.clientHeight}`,
            markers: false,
            onEnter: () => {
                stickyPlot.classList.add("fixed");
                tickPlots();
            },
            onLeave: () => {
                gsap.to(".circle", {
                    bottom: "-200%"
                })
                gsap.to(".circle", {
                    transform: "translateX(-50%) scale(1)",
                });
                gsap.to("#triggerCharacter", {
                    alpha: 1
                });
                gsap.to(".drag_character, .display_character", {
                    alpha: 0,
                    visibility: "hidden"
                });

                lastClientX = null;
                stateCharacters.scroll = 0;
                stateCharacters.targetScroll = 0;
            },

        }
    });

    const sec3 = gsap.timeline({
        scrollTrigger: {
            id: "sec3",
            trigger: secCharacter,
            start: "top top",
            end: "bottom bottom",
            markers: false,
            onEnter: () => {
                gsap.to(".circle", {
                    duration: 0.75,
                    bottom: "-150%"
                });
                gsap.to(".circle", {
                    delay: 0.75,
                    duration: 0.75,
                    transform: "translateX(-50%) scale(2)",
                });
                gsap.to("#triggerCharacter", {
                    delay: 1.45,
                    duration: 0.75,
                    alpha: 0
                });
                gsap.to(".drag_character, .display_character", {
                    delay: 2.2,
                    duration: 1.25,
                    alpha: 1,
                    visibility: "visible",
                    onComplete: () => {
                        dragCharacter.addEventListener("mousedown", onDown);
                        dragCharacter.addEventListener("mouseup", onUp);
                        dragCharacter.addEventListener("mouseout", event => {
                            var from = event.relatedTarget || event.toElement;
                            if (!from || from.nodeName === "HTML") {
                                isDown = false;
                            }
                        });
                        dragCharacter.addEventListener("mousemove", event => {
                            if (lastClientX && isDown) {
                                stateCharacters.targetScroll += event.clientX - lastClientX;
                                // console.log("New targetScroll:", stateCharacters.targetScroll);
                            }
                            lastClientX = event.clientX;
                        });
                    }
                });
            },
        }
    });
}());