<template>
  <router-link :to="artworkUrl" :class="[artworkWidth]" class="col-xs-12 grid-item">
    <img :src="artwork.image" :alt="artwork.title">
    <!-- TO DO: in design, artwork caption is artist name -->
    <p class="art-title">{{artwork.title}}</p>
    <p class="artwork-caption">{{artwork.description}}</p>
  </router-link>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleArtwork',
  props: {
    artwork: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  computed: {
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    artworkUrl () {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`
    }
  }
}
</script>
