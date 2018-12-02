<template>
  <div id="about-us">
  <!-- Content -->

  <!-- Intro Section -->
  <section class="black-bg white pt-75">
    <div class="container wide">
      <div class="row">
        <div class="col-lg-5 col-md-12">
        <h1>
            {{$prismic.richTextAsPlain(content.data.intro_title)}}
        </h1>
        </div>
        <div class="col-lg-6 col-lg-offset-1 col-md-12">
         <p>{{$prismic.richTextAsPlain(content.data.into_content)}}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Image -->
   <section>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-12 p-0">
         <prismic-image :field="content.data.featured_image" class="img-responsive"/>
        </div>
      </div>
    </div>
    </section>

  <!-- Main Content -->
  <section class="white-bg black">
      <div class="container wide">
        <div class="row pt-60" v-for="(item, index) in content.data.main_content" :key="'main-content-' + index" >
          <div class="col-lg-6">
            <h2>{{$prismic.richTextAsPlain(item.title)}}</h2>
          </div>
          <div class="col-lg-6">
            <prismic-rich-text :field="item.content"/>
          </div>
        </div>
     </div>
    </section>

    <!-- Team Members List -->
    <section class="team-members-list">
      <div class="container wide">
        <div class="row">
          <div class="col-md-4 team-member-item" v-for="(item, index) in content.data.team_members" :key="'team-member-' + index">
            <prismic-image :field="item.profile_image" class="img-responsive"/>
            <p class="name">{{$prismic.richTextAsPlain(item.first_last_name)}}</p>
            <p class="about">{{$prismic.richTextAsPlain(item.about)}}</p>
          </div>
        </div>
      </div>
    </section>

  <!-- /Content-->
   </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'About',
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
    this.$prismic.client.getSingle('about_us')
      .then((document) => {
        this.content = document
        //  this.fields.main_content = document.data.main_content
      })
  }
}
</script>
