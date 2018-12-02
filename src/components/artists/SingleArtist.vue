<template>
  <router-link :to="url" class="grid-item">
    <img :src="artist.avatarUrl" :alt="artist.name">
    <p class="artwork-caption mt-30">{{artist.name}}</p>
  </router-link>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleArtist',
  props: {
    artist: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    url () {
      return '/artists/' + this.artist.username
    }
  }
}
</script>
