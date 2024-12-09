window.addEventListener('load', function() {
  let allElements = document.querySelectorAll('[data-include-path]');

  allElements.forEach(function(el) {
    let includePath = el.dataset.includePath;

    if (includePath) {
      let xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            el.innerHTML = this.responseText;

            if (typeof initBanner === 'function') {
              initBanner();
            }
          } else {
            console.error('Error loading:', includePath, 'Status:', this.status);
          }
        }
      };

      xhttp.onerror = function() {
        console.error('Request failed with status:', this.status);
      };

      xhttp.open('GET', includePath, true);
      xhttp.send();
    }
  });
});