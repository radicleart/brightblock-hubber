<template>
<div class="row">
  <last-artwork v-for="(artwork, index) in artworks" :key="index" :artwork="artwork"/>
</div>
</template>

<script>
import chunk from 'lodash/chunk'
import LastArtwork from './LastArtwork'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LastArtworks',
  components: { LastArtwork },
  props: {
    artworks: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    artworksChunked () {
      return chunk(this.artworks, 3)
    }
  }
}
</script>
