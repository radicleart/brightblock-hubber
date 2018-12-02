<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-60">
          <h1 class="font-size-48">Privacy policy</h1>
        </div>
        <div class="col-sm-12 pt-50">
          <prismic-rich-text :field="content.data.content"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Privacy',
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
    this.$prismic.client.getSingle('privacy_policy')
      .then((document) => {
        this.content = document
      })
  }
}
</script>
