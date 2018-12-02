<template>
  <form class="search-form col-md-6 col-md-offset-2 col-sm-12 col-sm-offset-0 col-xs-12" @submit.prevent="submit()">
    <input type="text" class="form-control" placeholder="Search" v-model="queryString">
    <button type="submit"><span class="icon-search"></span></button>
  </form>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SearchForm',
  data () {
    return {
      queryString: null,
    }
  },
  methods: {
    submit () {
      if (this.queryString) {
        // this.$store.dispatch('artworkSearchStore/fetchSearchArtworks', {term: 'title', query: this.queryString}, {root: true})
        this.$emit('submit', this.queryString)
      }
    }
  }
}
</script>
