<template>
  <prismic-link :field="resource.data.file" class="col-sm-2 col-xs-1 grid-item">
    <prismic-image :field="resource.data.image"/>
    <p class="artwork-caption mt-30">{{$prismic.richTextAsPlain(resource.data.title)}}</p>
    <p class="artwork-caption mt-0">
      Published date: {{ publishDate }}
    </p>
    <p class="artwork-caption mt-0">Version: {{ resource.data.version }}</p>
  </prismic-link>
</template>

<script>
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Resource',
  props: {
    resource: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    publishDate () {
      return moment(this.resource.last_publication_date).format('YYYY-MM-DD')
    }
  }
}
</script>
