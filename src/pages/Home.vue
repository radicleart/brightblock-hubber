<template>
<section>
  <div class="container wide mx-5">
    <div class="row pt-5">
      <div class="col-sm-8">
        <h1 class="section-title">Artworks</h1>
        <last-artworks :artworks="artworks" class=""/>
      </div>
      <div class="col-sm-4">
        <h1 class="section-title">Auctions</h1>
        <ul class="list-unstyled">
          <single-auction class="row" v-for="(auction, index) of auctions" :key="index" :auction="auction"/>
        </ul>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import LastArtworks from '../components/home/LastArtworks'
import SingleAuction from '../components/auctions/SingleAuction'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Home',
  components: { SingleAuction, LastArtworks },
  data () {
    return {
      stories: [],
      slides: []
    }
  },
  mounted () {
    this.fetchStories()
    this.fetchSlides()
    this.$store.dispatch('onlineAuctionsStore/fetchOnlineAuctions').then((auctions) => {
      // loading online auctions
    })
  },
  computed: {
    artworks () {
      return this.$store.getters['artworkSearchStore/getHomePageArtworks']
    },
    auctionsSize () {
      return this.$store.getters['onlineAuctionsStore/onlineAuctions'].length
    },
    auctions () {
      return this.$store.getters['onlineAuctionsStore/onlineAuctions']
    },
  },
  methods: {

    /**
     * Fetch 3 stories from prismic CMS
     */
    fetchStories () {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'stories'),
        { orderings: '[document.last_publication_date desc]', pageSize: 3 }
      ).then((response) => {
        this.stories = response.results
      })
    },

    /**
     * Fetch 10 slides from prismic CMS
     */
    fetchSlides () {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'slides'),
        { orderings: '[document.last_publication_date desc]', pageSize: 10 }
      ).then((response) => {
        this.slides = response.results
      })
    }
  },
}
</script>
