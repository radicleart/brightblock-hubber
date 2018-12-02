<template>
  <div class="mb-50">
    <p>{{publishDate}}</p>
    <h2 class="h4">
      <router-link :to="'/blog/' + post.id">{{$prismic.richTextAsPlain(post.data.title)}}</router-link>
    </h2>
    <router-link :to="'/blog/' + post.id">
      <prismic-image :field="post.data.image.blog" class="img-responsive"/>
    </router-link>
  </div>
</template>

<script>
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleBlogPost',
  props: {
    post: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    publishDate () {
      return moment(this.post.last_publication_date).format('DD. MMMM YYYY')
    }
  }
}
</script>
