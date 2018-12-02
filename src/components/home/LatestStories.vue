<template>
  <section id="stories" class="pb-150">
    <div class="container pt-5 pb-5">
      <div class="row">
        <div class="col-xs-12">
          <h2>Open Art Market Stories</h2>
        </div>
        <div class="spacer-small"></div>
      </div>
      <div class="row">
        <latest-story v-for="(story, index) in stories" :story="story" :key="index"/>
      </div>
    </div>
  </section>
  <!-- /#stories-->
</template>

<script>
import LatestStory from './LatestStory'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LatestStories',
  components: { LatestStory },
  props: {
    stories: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
<style>
</style>
