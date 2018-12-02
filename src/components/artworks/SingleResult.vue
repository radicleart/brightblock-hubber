<template>
<li class="media my-3">
  <router-link :to="url"><img :src="artwork.image" :alt="artwork.title" class="mr-3 img-fluid" style="width: 250px;"></router-link>
  <div class="media-body row">
    <div class="col-sm-7">
      <h5 class="mt-0 mb-1">{{artwork.title}}</h5>
      <p class="artwork-caption">{{artwork.description}}</p>
      <p class="artwork-caption">Artist: {{artwork.artist}}</p>
    </div>
    <selling-options :artwork="artwork"/>
  </div>
</li>
</template>

<script>
import SellingOptions from './SellingOptions'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleResult',
  components: { SellingOptions },
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
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
    url () {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`
    },
  }
}
</script>
