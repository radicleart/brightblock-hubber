<template>
<div id="carouselExampleIndicators" class="container-fluid carousel slide  mb-5" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="index" v-for="(sld, index) in slides" :key="index" :class="index === slide ? 'active' : ''"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item" :class="index === slide ? 'active' : ''" v-for="(sld, index) in slides" :key="index">
      <img class="d-block w-100" :src="sld.data.image.url" alt="First slide">
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev" @click="slide--">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next" @click="slide++">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Slider',
  props: {
    slides: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      /**
       * variable holding number of currently displayed slide
       */
      slide: 0,
    }
  },
}
</script>
