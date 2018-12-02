<template>
  <uiv-carousel :indicators="false" :controls="false" :interval="8000" ref="carousel" class="slider" :value="imageNum"
                @change="imageChanged($event)">
    <uiv-slide v-for="(slide, index) in images" :key="index">
      <div style="width: 100%;height: 500px; background-size:cover"
           :style="{backgroundImage: 'url(' + slide + ')'}"></div>
    </uiv-slide>
  </uiv-carousel>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ArtworkSlider',
  props: {
    images: {
      type: Array,
      default () {
        return []
      }
    },
    imageNum: {
      type: Number,
      default: 0,
    }
  },
  methods: {
    imageChanged (imageIndex) {
      this.$emit('change', imageIndex)
    }
  }
}
</script>
