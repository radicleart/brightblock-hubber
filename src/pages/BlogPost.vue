<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-60">
          <p>{{publishDate}}</p>
          <h1 class="font-size-48">{{$prismic.richTextAsPlain(post.data.title)}}</h1>
        </div>
        <div class="col-sm-12 pt-50">
          <prismic-image :field="post.data.image.blog" class="img-responsive mb-50"/>
          <prismic-rich-text :field="post.data.content"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'BlogPost',
  data () {
    return {
      post: {}
    }
  },
  mounted () {
    const postId = this.$route.params.postId

    /**
     * Fetch post by ID
     */
    this.$prismic.client.getByID(postId)
      .then((document) => {
        this.post = document
      })
  },
  computed: {
    publishDate () {
      return moment(this.post.last_publication_date).format('DD. MMMM YYYY')
    }
  }
}
</script>
