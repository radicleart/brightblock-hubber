<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-60">
          <p>{{publishDate}}</p>
          <h1 class="font-size-48">{{$prismic.richTextAsPlain(content.data.title)}}</h1>
        </div>
        <div class="col-sm-12 pt-50">
          <prismic-image :field="content.data.image" class="img-responsive mb-50"/>
          <prismic-rich-text :field="content.data.content"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Competition',
  data () {
    return {
      content: {
        data: {}
      }
    }
  },
  mounted () {
    /**
     * Fetch content from prismic CMS
     */
    this.$prismic.client.getSingle('competition')
      .then((document) => {
        this.content = document
      })
  },
  computed: {
    publishDate () {
      return moment(this.content.last_publication_date).format('DD. MMMM YYYY')
    }
  }
}
</script>
