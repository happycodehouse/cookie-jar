(function () {
    const remoteBtn = Array.from(document.querySelectorAll(".remote li"));
    const productContent = document.getElementsByClassName("content");
    const contentBg = document.querySelectorAll(".product .bg");
    const contentObject = document.getElementsByClassName("object");
    let currentTimeline; // 현재 애니메이션 타임라인 저장

    productContent[0].classList.add("active");

    remoteBtn.forEach(function (btn, index) {
        btn.addEventListener("click", function () {
            // 현재 버튼에 'active' 클래스를 추가하고 나머지 버튼에서 제거
            remoteBtn.forEach(function (b) {
                b.classList.toggle("active", b === btn);
            });

            // 모든 콘텐츠에서 'active' 클래스를 제거하고 초기 상태로 되돌리기
            Array.from(productContent).forEach(function (content, i) {
                if (i !== index) {
                    content.classList.remove("active");
                    contentBg[i].style.cssText = '';
                    gsap.set(contentBg[i], { width: 0, height: 0 ,alpha: 0 });
                    gsap.set(contentObject[i], { transform: "scale(0)" });
                } else {
                    content.classList.add("active");
                }
            });

            // 이전 애니메이션이 존재하면 종료
            if (currentTimeline) {
                currentTimeline.kill();
            }

            currentTimeline = gsap.timeline();
            currentTimeline
                .to(contentBg[index], {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    alpha: 0.5,
                    duration: 1
                }, "productGSAP")
                .to(contentObject[index], {
                    scale: 1,
                    // rotation: 360,
                    duration: 0.5,
                    ease: "power1.out"
                }, "productGSAP");
        });
    });
})();
