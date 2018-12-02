<template>
<ul class="list-unstyled">
  <my-single-artwork v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" :width="artworkWidth" :sold="sold"/>
</ul>
</template>

<script>
import chunk from 'lodash/chunk'
import MySingleArtwork from './MySingleArtwork'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworksList',
  components: { MySingleArtwork },
  props: {
    sold: false,
    artworks: {
      type: Array,
      default () {
        return []
      }
    },
    chunks: {
      type: Number,
      default: 3
    },
    showLoadButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    loadMore () {
      this.$emit('load-more')
    }
  },
  computed: {
    chunkedArtworks () {
      return chunk(this.artworks, this.chunks)
    },
    artworkWidth () {
      return 12 / this.chunks
    }
  }
}
</script>
