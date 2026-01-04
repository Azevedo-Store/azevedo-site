const swiper = new Swiper(".swiper", {
  spaceBetween: 0,
  slidesPerView: 1, // Mostrar apenas um slide por vez
  loop: true, // Habilitar o loop infinito
  autoplay: {
    delay: 5000, // Intervalo de tempo em milissegundos entre cada slide
    disableOnInteraction: false, // Manter o autoplay mesmo se o usuário interagir
  },
  pagination: {
    el: ".swiper-pagination",
    type: "arrows",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
