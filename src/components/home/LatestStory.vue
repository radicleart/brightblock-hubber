<template>
<div class="col-sm-4 mt-5 story-item">
  <router-link :to="url">
    <prismic-image :field="story.data.featured_image.listing" class="img-fluid"/>
    <p>{{$prismic.richTextAsPlain(story.data.title)}}</p>
  </router-link>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LatestStory',
  props: {
    story: {
      type: Object,
      required: true,
    },
  },
  computed: {
    url () {
      return `/stories/${this.story.id}`
    }
  }
}
</script>
<style scoped>
.story-item p {
    font-size: 24px;
    margin-top: 40px;
}
p {
  font-size: 20px;
  margin-bottom: 0;
  color: green;
  font-style: italic;
}
</style>
