(function () {
    const sec2 = document.getElementById("sec2");
    const stickySec2 = document.getElementById("stickySec2");
    const display = document.getElementById("fold-effect-lyrics");
    const lyrics = Array.from(document.getElementsByClassName("lyrics"));
    const lyricsContent = Array.from(document.getElementsByClassName("lyrics_content"))
    const originContentLyrics = document.getElementById("origin-content-lyrics");

    let scaleFix = 0.992;

    let state = {
        disposed: false,
        targetScroll: 0,
        scroll: 0
    }

    function lerp(current, target, speed= 0.05, limit= 0.001) {
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
    const centerFold = lyrics[Math.floor(lyrics.length / 2)];

    let tickLyrics = () => {
        if (state.disposed) return;

        sec2.style.height = insideLyrics.scrollers[0].children[0].clientHeight - centerFold.clientHeight + window.innerHeight + "px";

        state.targetScroll = -(
            document.documentElement.scrollTop - stickySec2.clientHeight || document.body.scrollTop - window.innerHeight - stickySec2.clientHeight
        );


        state.scroll += lerp(state.scroll, state.targetScroll, 0.05, 0.0001);

        insideLyrics.updateStyles(state.scroll);

        animationFrameId = requestAnimationFrame(tickLyrics);
    }

    insideLyrics = new FoldedDom(display, lyrics);
    insideLyrics.setContent(originContentLyrics);
    tickLyrics();

    let insideAlbums;

    let tickAlbums = () => {

    }

    const effectLyrics = gsap.timeline({
        scrollTrigger: {
            id: "sticky",
            trigger: stickySec2,
            start: "top top",
            end: "top top",
            markers: true,
            onEnter: () => {
                stickySec2.classList.add("fixed");
            },
            onLeaveBack: () => {
                stickySec2.classList.remove("fixed");
                cancelAnimationFrame(animationFrameId);
                sec2.style.height = "";
                console.log("leaveBack")
            },
            onLeave: () => {
                console.log("leave")
            }
        }
    });

    const effectAlbums = gsap.timeline({
        scrollTrigger: {

        }
    });
}());