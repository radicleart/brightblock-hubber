<template>
<div class="col-sm-6 pt-1">
  <router-link :to="artworkUrl">
    <img :src="artwork.image" :alt="artwork.title" class="img-fluid">
    <h5 class="pt-2"><small>{{artwork.title}}</small></h5>
    <p><small>{{artwork.description}}</small></p>
    <p class="art-title" v-if="debugMode">{{artwork.bcitem.itemIndex}}</p>
    <p class="art-title" v-if="debugMode">Artist: {{artwork.artist}}</p>
    <p class="art-title" v-if="debugMode">Owner: {{artwork.owner}}</p>
  </router-link>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LastArtwork',
  props: {
    artwork: {
      type: Object,
      required: true,
    }
  },
  computed: {
    artworkUrl () {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`
    },
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
  }
}
</script>
