<template>
  <section id="about-artwork" class="grey-light-bg black pt-60 about-artwork">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-6">
          <h2 class="h4 mb-40">About artwork</h2>
          <p>
            {{aboutArtwork.title}}, {{aboutArtwork.year}}<br />
            Edition 1/1, {{aboutArtwork.description}}
          </p>
          <div v-html="aboutArtwork.description"></div>
          <p>
            Artist: {{aboutArtwork.artist.name}}<br />
            Owner: {{aboutArtwork.owner.name}}
          </p>
          <p class="keywords">Keywords ︱ {{aboutArtwork.keywords}}</p>
        </div>
        <div class="col-sm-6">
          <img class="img-responsive" :src="aboutArtwork.image">
        </div>
      </div>

    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AboutArtwork',
  props: {
    aboutArtwork: {},
  },
  computed: {
  }
}
</script>
