<template>
<section class="white-bg black pt-120 pb-120">
  <div class="container wide">
    <div class="row">
      <div class="col-md-12">
        <h1 class="innerpage">Update Artwork</h1>
        <my-artwork-upload-form :artworkId="artworkId" :mode="'update'"/>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import MyArtworkUploadForm from '../components/artworks/MyArtworkUploadForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworkUpdate',
  components: {
    MyArtworkUploadForm
  },
  data () {
    return {
    }
  },
  created () {
    this.artworkId = Number(this.$route.params.artworkId)
  },
  computed: {
  },
  methods: {
  }
}
</script>
