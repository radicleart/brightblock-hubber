<template>
  <section class="light-gray-bg black">
    <div class="container wide pt-120">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="h4">Artists at Open Art Market</h2>
        </div>
        <div class="col-sm-12 pt-75 pt-30m">
          <artists-list :artists="artists"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArtistsList from '../components/artists/ArtistsList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artists',
  components: { ArtistsList },
  data () {
    return {
    }
  },

  mounted () {
  },
  computed: {
    artists () {
      return this.$store.getters['userProfilesStore/getProfiles']
      // return this.$store.getters['artworkSearchStore/getArtistsPage']
    },
  },
  methods: {
    updateFilters (filters) {
      this.filters = filters
    },
    loadMore () {
      //
    }
  }
}
</script>
