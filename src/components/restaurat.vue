<template>
  <router-view />
  <div class="michilans-app">
    <!-- Sección Hero -->
    <section class="hero-section">
      <h1 class="main-title">The Neko Sushi Experience</h1>
    </section>

    <!-- Sección Intro con imagen a la derecha -->
    <section class="intro-section">
      <div class="intro-container">
        <div class="intro-text-content">
          <p class="intro-text">
            En Michilans, creemos que comer es más que una simple comida: es un viaje. Nuestros chefs seleccionan meticulosamente los ingredientes más frescos y de la más alta calidad de todo el mundo, garantizando que cada plato refleje la máxima calidad. Con cada bocado, descubrirá el delicado equilibrio de sabores, texturas y aromas que define la verdadera excelencia culinaria.
          </p>
          <p class="intro-text">
            Nuestro menú es una celebración de creaciones tanto tradicionales como innovadoras. Desde carnes perfectamente sazonadas hasta platos elaborados con maestría, cada plato se prepara con sumo cuidado y atención al detalle. Ya sea que disfrute de nuestro menú degustación exclusivo o elija sus favoritos a la carta, puede confiar en que cada plato representa nuestro compromiso con la perfección culinaria.
          </p>
        </div>
        <img 
          src="https://img.freepik.com/fotos-premium/prato-de-sushi-hd-8k-papel-de-parede-banco-de-imagem-fotografica_915071-32470.jpg" 
          class="intro-image"
        >
      </div>
    </section>

    <!-- Galería -->
    <section class="gallery-section">
      <h2 class="section-title">Explora nuestra galería</h2>
      <p class="gallery-text">
        En Michilans, cada plato es una obra de arte, elaborado meticulosamente para deleitar la vista y el paladar. Nuestra galería ofrece un vistazo al vasto mundo de la alta cocina, donde la artesanía se fusiona con el arte culinario.
      </p>
      
      <div class="image-gallery">
        <img src="https://glovo.dhmedia.io/image/stores-glovo/stores/c02d09fc79174f8d47607e5527e17172dc65160705b24fee5200f6d635008ef0?t=W3siYXV0byI6eyJxIjoibG93In19LHsicmVzaXplIjp7Im1vZGUiOiJmaWxsIiwiYmciOiJ0cmFuc3BhcmVudCIsIndpZHRoIjo1ODgsImhlaWdodCI6MzIwfX1d" alt="Fine dining presentation">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format" alt="Chef preparing food">
        <img src="https://bernarditacocina.com/wp-content/uploads/2022/03/taller-de-gyozas-y-pan-bao-900x600-1.jpg" alt="Restaurant interior">
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format" alt="Gourmet dish">
        <img src="https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/JLYGWDUSXFDI7ITQECOXNAG674.jpg" alt="Artistic plating">
        <img src="https://ohsushi.es/img/11452-500x500.webp" alt="Elegant dining">
      </div>
      
      <p class="gallery-text">
        Desde los vibrantes colores de nuestros ingredientes de temporada hasta la elaborada presentación de nuestros platos estrella, cada imagen captura la esencia de la experiencia Michilans. Deja que las imágenes inspiren tu próxima visita, donde experimentarás la perfecta armonía de sabores y estética que te espera.
      </p>
    </section>

    <!-- Secciones adicionales -->
    <section class="feature-section">
      <h2 class="section-title">Una atmósfera refinada</h2>
      <p class="feature-text">
        En Michilans, hemos diseñado un espacio que complementa la excepcional experiencia gastronómica que ofrecemos. Nuestro elegante y moderno interior combina líneas limpias con toques cálidos para crear un ambiente sofisticado y acogedor. Ya sea una cena íntima o una celebración especial, nuestro personal se asegurará de que su tiempo con nosotros sea tan excepcional e inolvidable como la propia gastronomía.
      </p>
    </section>

    <section class="feature-section">
      <h2 class="section-title">Artesanía incomparable</h2>
      <p class="feature-text">
        Nuestros chefs están capacitados en las técnicas tradicionales de la alta cocina, incorporando a la vez innovación moderna. Cada plato refleja su habilidad y creatividad, combinando métodos tradicionales con un toque contemporáneo. Desde la selección de ingredientes hasta la delicada presentación, cada detalle de su comida se elabora con arte y pasión.
      </p>
    </section>

    <section class="feature-section last-section">
      <h2 class="section-title">Sabores Exquisitos</h2>
      <p class="feature-text">
        Nuestro restaurante es un santuario para quienes buscan la mejor experiencia gastronómica, preparada con precisión y servida con una atención excepcional al detalle. Desde su llegada hasta su salida, se sumergirá en un ambiente de elegancia y tranquilidad, donde cada detalle está diseñado para brindarle una experiencia inolvidable.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MichilansExperience'
}
</script>

<style scoped>
.michilans-app {
  font-family: 'Georgia', serif;
  color: #333;
  line-height: 1.6;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 0 40px;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 40px;
}

.main-title {
  font-size: 2.8rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #222;
  margin-bottom: 20px;
}

/* Estilos para la sección intro con imagen */
.intro-section {
  margin-bottom: 60px;
}

.intro-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.intro-text-content {
  flex: 1;
}

.intro-image {
  width: 40%;
  max-width: 450px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 10px;
}

.intro-text {
  font-size: 1.1rem;
  margin-bottom: 25px;
  text-align: justify;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 300;
  text-align: center;
  margin: 50px 0 30px;
  color: #222;
  letter-spacing: 1px;
}

.gallery-text {
  font-size: 1.1rem;
  margin: 0 auto 40px;
  max-width: 800px;
  text-align: center;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0 60px;
}

.image-gallery img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-gallery img:hover {
  transform: scale(1.02);
}

.feature-section {
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #eaeaea;
}

.feature-section.last-section {
  border-bottom: none;
}

.feature-text {
  font-size: 1.1rem;
  text-align: justify;
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .image-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .intro-text, .gallery-text, .feature-text {
    font-size: 1rem;
  }

  /* Responsive para la sección intro */
  .intro-container {
    flex-direction: column;
  }

  .intro-image {
    width: 100%;
    max-width: 100%;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .image-gallery {
    grid-template-columns: 1fr;
  }
  
  .hero-section {
    padding: 40px 0 30px;
  }
}
</style>