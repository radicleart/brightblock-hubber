<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-60">
        <h1 class="font-size-48 mb-20">{{$prismic.richTextAsPlain(story.data.title)}}</h1>
        <p class="mb-50">{{publishDate}}</p>
        </div>
        <div class="col-sm-12 pt-50">
          <prismic-image :field="story.data.featured_image" class="img-responsive mb-50"/>
          <prismic-rich-text :field="story.data.content"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Story',
  data () {
    return {
      story: {}
    }
  },
  mounted () {
    const storyId = this.$route.params.storyId

    /**
     * Fetch story by ID
     */
    this.$prismic.client.getByID(storyId)
      .then((document) => {
        this.story = document
      })
  },
  computed: {
    publishDate () {
      return moment(this.story.data.date).format('DD. MMMM YYYY')
    }
  }
}
</script>
