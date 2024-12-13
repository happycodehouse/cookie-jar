(function () {
    const wrapper = document.getElementById("fold-effect-horizontal");
    const folds = Array.from(document.getElementsByClassName("fold-horizontal"));
    const baseContent = document.getElementById("base-content-horizontal");

    // console.log(wrapper, folds, baseContent);

    let state = {
        disposed: false,
        targetScroll: 0,
        scroll: 0
    }

    function lerp(current, target, speed = 1, limit = 0.001) {
        let change = (target - current) * speed;

        if (Math.abs(change) < limit) {
            change = target - current;
        }
        return change;
    }

    let scaleFix = 0.992;

    class FoldedDom {
        constructor(wrapper, folds = null, scrollers = null) {
            this.wrapper = wrapper;
            this.folds = folds;
            this.scrollers = [];
        }

        setContent(baseContent, createScrollers = true) {
            const folds = this.folds;

            if (!folds) return;

            let scrollers = [];

            for (let i = 0; i < folds.length; i++) {
                const fold = folds[i];
                const copyContent = baseContent.cloneNode(true);
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

                // Scroller fixed so its aligned
                // scroller.style.transform = `translateY(${100 * -i}%)`;
                // And the content is the one that scrolls

                scroller.children[0].style.transform = `translateX(${scroll}px)`;
            }
        }
    }

    let insideFold;

    const mainFold = folds[folds.length - 1];

    let tick = () => {
        if (state.disposed) return;

        // Calculate the scroll based of how much the content is outside the mainFold

        // state.targetScroll = -(
        //   document.documentElement.scrollLeft || document.body.scrollLeft
        // );

        state.targetScroll = Math.max(
            Math.min(0, state.targetScroll),
            -insideFold.scrollers[0].children[0].clientWidth + mainFold.clientWidth
        );

        state.scroll += lerp(state.scroll, state.targetScroll, 0.1, 0.0001);

        insideFold.updateStyles(state.scroll);

        requestAnimationFrame(tick);
    }

    /* ATTACH SCROLL EVENT */
    let lastClientX = null;
    let isDown = false;

    let onDown = event => {
        console.log(
            Math.max(
                state.targetScroll,
                -insideFold.scrollers[0].children[0].clientWidth + mainFold.clientWidth
            )
        );

        console.log(
            "s",
            -insideFold.scrollers[0].children[0].clientWidth + mainFold.clientWidth
        );

        isDown = true;
        lastClientX = event.touches[0].clientX;
    }

    let onUp = event => {
        isDown = false;
        lastClientX = null;
    }

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseout", event => {
        var from = event.relatedTarget || event.toElement;
        if (!from || from.nodeName == "HTML") {
            // stop your drag event here
            // for now we can just use an alert
            isDown = false;
        }
    });

    window.addEventListener("mousemove", event => {
        if (lastClientX && isDown) {
            state.targetScroll += event.clientX - lastClientX;
        }

        lastClientX = event.clientX;

        // console.log("is mousemove?");
    });

    window.addEventListener("touchstart", onDown);
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchcancel", onUp);

    window.addEventListener("touchmove", event => {
        if (isDown && event.touches.length > 0) {
            let touch = event.touches[0]; // 첫 번째 터치 포인트
            if (lastClientX !== null) {
                state.targetScroll += touch.clientX - lastClientX;
            }
            lastClientX = touch.clientX; // clientX를 touch.clientX로 변경
        }
    }, { passive: false });

    window.addEventListener("wheel", event => {
        state.targetScroll += -Math.sign(event.deltaY) * 30;
    });

    insideFold = new FoldedDom(wrapper, folds);
    insideFold.setContent(baseContent);
    tick();
})();
