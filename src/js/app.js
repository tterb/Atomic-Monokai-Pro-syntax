import SweetScroll from 'sweet-scroll';

/* sweetScroll load */
document.addEventListener("DOMContentLoaded", () => {
  const sweetScroll = new SweetScroll({ trigger: '.scroll-btn' });
}, false);

$(document).ready(() => {
  $('.tooltip').tooltipster({
    animation: 'fade',
    trigger: 'click',
    side: 'bottom',
    delay: 200
  });
  $('.copy-btn').on('click', (e) => {
    e.preventDefault();
    var aux = document.createElement('input');
    aux.setAttribute('value', 'apm install atomic-monokai-pro-syntax');
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  });
});
