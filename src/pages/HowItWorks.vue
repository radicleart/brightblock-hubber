<template>
  <!-- Content -->
  <div>
    <section class="light-gray-bg black">
      <div class="container wide">
        <div class="row">
            <div class="col-xs-12 col-sm-10 pt-75">
                <h1 class="h3 m-0">{{$prismic.richTextAsPlain(content.data.title)}}</h1>
          </div>
        </div>
      </div>
    </section>
  <section class="white-bg black">
      <div class="container wide">
        <div class="row">
          <div class="col-sm-12 pt-60">
            <p class="font-size-24">{{$prismic.richTextAsPlain(content.data.content)}}</p>
            </div>
        </div>
      </div>
    </section>
  </div>
  <!-- /Content-->
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'HowItWorks',
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
    this.$prismic.client.getSingle('how_it_works')
      .then((document) => {
        this.content = document
      })
  }
}
</script>
