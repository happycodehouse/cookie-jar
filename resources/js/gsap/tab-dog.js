(function () {
    // 1. click the remote > li.
    // 2. change the things: content(bg/object transition delay), circle color.

    const remoteBtn = Array.from(document.querySelectorAll(".remote li"));
    const productContent = document.getElementsByClassName("content");
    const contentBg = document.querySelectorAll(".product .bg");
    const contentObject = document.getElementsByClassName("object");

    console.log(contentBg);

    remoteBtn.forEach(function (btn, index) {
        btn.addEventListener("click", function () {
            // 현재 버튼에 'active' 클래스를 추가하고 나머지 버튼에서 제거
            remoteBtn.forEach(function (b) {
                b.classList.toggle("active", b === btn);
            });

            Array.from(productContent).forEach(function (content, i) {
                content.classList.toggle("active", i === index);
            });

            const tl = gsap.timeline();
            tl.to(contentBg[index], {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                height: "100%",
                duration: 1,
            });
        });
    });
})();
