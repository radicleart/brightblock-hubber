<template>
  <div>
    <section class="white-bg black">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 pt-120">
            <artist-details :artist="artist"/>
          </div>
        </div>
      </div>
    </section>
    <div class="divider"></div>
    <section>
      <div class="container wide pt-60">
        <div class="row">
          <div class="col-sm-12">
            <h2 class="h4 mb-50">All artworks by {{artist.name}}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12" id="artist-all-artworks">
            <artworks-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ArtistDetails from '../components/artists/ArtistDetails'
import SingleArtwork from '../components/artworks/SingleArtwork'
import ArtworksList from '../components/artworks/ArtworksList'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artist',
  components: { ArtworksList, SingleArtwork, ArtistDetails },
  data () {
    return {
    }
  },
  created () {
    this.username = this.$route.params.artistId
  },
  mounted () {
  },
  computed: {
    artist () {
      return this.$store.getters['userProfilesStore/getProfile'](this.username)
    },
    artworks () {
      return this.$store.getters['artworkSearchStore/getArtworksByArtist'](this.username)
    },
  },
  methods: {
  }
}
</script>
