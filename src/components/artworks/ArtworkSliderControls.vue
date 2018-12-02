<template>
  <div class="pull-right slider-controls">
    <span class="image-count">{{displayed + 1}}/{{images.length}} images</span>
    <span class="slider-arrows">
        <a href="#" @click.prevent="previous()" class="slider-prev">
            <span class="icon-arrow-left"></span>
        </a>
        <a href="#" @click.prevent="next()" class="slider-next">
            <span class="icon-arrow-right"></span>
        </a>
    </span>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ArtworkSliderControls',
  props: {
    images: {
      type: Array,
      default () {
        return []
      }
    },
    imageDisplayed: {
      type: Number,
      default: 0,
    }
  },
  data () {
    return {
      displayed: 0
    }
  },
  methods: {
    previous () {
      if (this.displayed === 0) {
        this.displayed = this.images.length - 1
      } else {
        this.displayed = this.displayed - 1
      }

      this.$emit('change', this.displayed)
    },

    next () {
      if (this.displayed === this.images.length - 1) {
        this.displayed = 0
      } else {
        this.displayed = this.displayed + 1
      }

      this.$emit('change', this.displayed)
    }
  },
  watch: {
    imageDisplayed (to) {
      this.displayed = to
    }
  }
}
</script>
