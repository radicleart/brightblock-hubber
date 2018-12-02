<template>
<ul class="list-unstyled">
  <single-result v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" :width="artworkWidth"/>
</ul>
</template>

<script>
import chunk from 'lodash/chunk'
import SingleResult from './SingleResult'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ResultsList',
  components: { SingleResult },
  props: {
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
