<template>
<section class="grey-light-bg black pt-60 about-artwork">
  <div class="container wide">
    <div class="row">
      <div class="col-sm-12">
        <div v-for="(registration, index) in registrations" :key="index">
          <p>{{index}} : {{registration}}</p>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  computed: {
    registrations () {
      return this.$store.getters['ethStore/getBlockchainItems']
    },
  },
  methods: {
  },
  components: {
  }
}
</script>
