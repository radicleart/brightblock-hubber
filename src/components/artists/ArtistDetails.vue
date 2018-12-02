<template>
  <div class="container-fluid footer-bottom">
    <div class="col-md-6">
      <h1 class="font-size-48 m-0">{{artist.name}}</h1>
    </div>
    <div class="col-md-6">
      <div class="row" id="artist-description">
        <div class="col-xs-12">
          <img :src="artist.avatarUrl" :alt="artist.name" class="mb-50"/>
          <p v-html="artist.description" class="artist-description" v-bind:class="{ expanded: showDescription }"></p>
          <p class="mt-50">
            <a v-on:click="toggleReadMore" class="read-more inline-block">Read more</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ArtistDetails',
  props: {
    artist: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showDescription: false
    }
  },
  methods: {
    toggleReadMore: function () {
      this.showDescription = !this.showDescription
    },
  }
}
</script>
