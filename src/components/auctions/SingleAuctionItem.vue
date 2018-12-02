<template>
<li class="media my-3">
  <img :src="artwork.image" :alt="artwork.title" class="mr-3 img-fluid" style="width: 150px;">
  <div class="media-body">
    <h4 class="media-heading">{{artwork.title}}</h4>
    {{artwork.description}}
  </div>
</li>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleAuctionItem',
  components: { },
  props: {
    auctionId: null,
    item: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  methods: {
  },
  computed: {
    artwork () {
      return this.$store.getters['artworkSearchStore/getArtwork'](this.item.itemId)
    },
  }
}
</script>
