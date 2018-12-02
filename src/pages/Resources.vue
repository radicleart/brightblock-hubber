<template>
  <section class="light-gray-bg black">
    <div class="container wide pt-120">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="h4">Resources</h2>
        </div>
        <div class="col-sm-12 pt-75 pt-30m">
          <div class="col-sm-12 p-0 artist-list" id="artist-all-artworks">
            <div class="row">
              <resource v-for="(resource, index) of resources" :key="index" :resource="resource"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Resource from '../components/resources/Resource'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Resources',
  components: { Resource },
  data () {
    return {
      resources: []
    }
  },
  methods: {
    fetchResources () {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.type', 'resources'),
        { orderings: '[document.last_publication_date desc]' }
      ).then((response) => {
        // response is the response object, response.results holds the documents
        console.log('prismic', response.results)
        this.resources = response.results
      })
    }
  },
  mounted () {
    this.fetchResources()
  }
}
</script>
