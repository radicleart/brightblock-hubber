<template>
  <section class="black blockchain-settings">
    <div class="container wide pt-75">
      <div class="row">
        <div class="col-md-8 col-md-offset-2 col-sm-12">
          <h1 class="title strong">Yikes! Don’t worry, it’s not a 404 error.</h1>
          <p class="title strong">We don’t like those either.</p>
          <p class="subtext">In order to experience the amazing technology that gives you access to a truly decentralized network, take a minute to install <a href="https://metamask.io/" target="_blank">Meta Mask</a> and <a href="https://blockstack.org/" target="_blank">Blockstack</a>.</p>
          <p>Think of Meta Mask  as your online wallet where you keep your cryptocurrency.</p>
          <p>We admit it takes some time to figure it out, but promise it’s easier than you think. Besides, all the cool kids are doing it!</p>
          <p>Blockstack is a piece of next generation internet - one that allows you to be in full control of your own data. With this technology, you will never have to worry about becoming someone’s product - no ads and no user information gathering. We at Open Art Market believe that all internet should be like this.</p>
          <p>Know only some of these words? Don’t worry - people in 1990 felt the same way about the internet!</p>
          <button class="btn btn-block yellow-bg text-uppercase" v-on:click="$emit('continue-onward')">Click here to continue!</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'SettingsBlockchain',
  props: ['metamask'],
  data: () => {
    return {
    }
  },
  mounted () {
    console.log(this.metamask)
  },
  methods: {
    onward: function (event) {
      event.preventDefault()
      this.$emit('continue-onward')
    },
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main-page {
  margin: 50px 100px;
}
</style>
