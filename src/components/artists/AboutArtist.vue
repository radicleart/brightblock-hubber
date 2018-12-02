<template>
  <section id="about-artist" class="grey-light-bg black pt-60 about-artist">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-6">
          <h2 class="h4 mb-40">{{artist.name}}</h2>
        </div>
        <div class="col-sm-6" v-html="artist.description">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AboutArtist',
  props: {
    artist: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
