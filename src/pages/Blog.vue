<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-60">
          <h1 class="font-size-48">Blog</h1>
        </div>
        <div class="col-sm-12 pt-50">
          <single-blog-post v-for="(post, index) of posts" :key="index" :post="post"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SingleBlogPost from '../components/blog/SingleBlogPost'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Competition',
  components: { SingleBlogPost },
  data () {
    return {
      posts: []
    }
  },
  methods: {
    fetchPosts () {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'blog'),
        { orderings: '[document.last_publication_date desc]' }
      ).then((response) => {
        // response is the response object, response.results holds the documents
        this.posts = response.results
      })
    }
  },
  mounted () {
    /**
     * Fetch content from prismic CMS
     */
    this.fetchPosts()
  },
}
</script>
