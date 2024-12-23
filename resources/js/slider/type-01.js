(function () {
    const paginationNameArray = ["Joy", "Sadness", "Anger", "Disgust", "Fear", "Bing Bong", "Riley", "Mom and Dad"];
    const swiperPagination = document.querySelector(".swiper-pagination-custom");
    let isAutoplayStopped = false;

    const insideOutSwiper = new Swiper(".swiper", {
        direction: "vertical",
        pagination: {
            el: swiperPagination,
            clickable: true,
            renderBullet: function (idx, className) {
                return '<span class="' + className + '">' + paginationNameArray[idx] + '</span>';
            }
        },
    });
})();