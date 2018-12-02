<template>
  <div>
    <div class="grid innerpage-artworks mt-50">
      <div class="grid-sizer"></div>
      <div class="row" v-for="(chunkedArtwork, index) of chunkedArtworks" :key="index">
        <single-artwork v-for="(artwork, index) of chunkedArtwork" :key="index" :artwork="artwork"
                        :width="artworkWidth"/>
      </div>
    </div>
    <div class="hr-spacer"></div>
    <button v-if="showLoadButton" class="button btn btn-load" id="load-more" @click.prevent="loadMore()">
      Load more
    </button>
  </div>
</template>

<script>
import chunk from 'lodash/chunk'
import SingleArtwork from './SingleArtwork'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ArtworksList',
  components: { SingleArtwork },
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
