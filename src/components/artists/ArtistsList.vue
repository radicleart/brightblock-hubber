<template>
  <div class="col-sm-12 p-0 artist-list" id="artist-all-artworks">
    <single-artist v-for="(artist, index) of artists" :key="index" :artist="artist"/>
  </div>
</template>

<script>
import SingleArtist from './SingleArtist'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ArtistsList',
  components: { SingleArtist },
  props: {
    artists: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
