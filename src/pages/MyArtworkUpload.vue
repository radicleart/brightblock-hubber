<template>
<section class="white-bg black pt-120 pb-120">
  <div class="container wide">
    <div class="row">
      <div class="col-md-12">
        <h1 class="innerpage">Upload Artwork</h1>
        <my-artwork-upload-form/>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import MyArtworkUploadForm from '../components/artworks/MyArtworkUploadForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworkUpload',
  components: {
    MyArtworkUploadForm
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
  }
}
</script>
