<template>
<section class="content">
  <div class="columns">
    <div class="column">
      <h2 class="subtitle">Zonefile Information</h2>
    </div>
  </div>
  <div class="content" v-if="error.hasError">
    <p v-bind:class="error.myClass">{{ error.errorMessage }}</p>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info"></p>
    </div>
    <div class="column">
      <p class="is-size-7">Note: This information is obtained by calling GET('https://core.brightblock.org/v1/names/' + name) where name is the current lookup user.</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Address</p>
    </div>
    <div class="column">
      <p class="is-info">{{ zonefile.address }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">blockchain</p>
    </div>
    <div class="column">
      <p class="is-info">{{ zonefile.blockchain }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">expire_block</p>
    </div>
    <div class="column">
      <p class="is-info">{{ zonefile.expire_block }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">last_txid</p>
    </div>
    <div class="column">
      <p class="is-info">{{ zonefile.last_txid }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">status</p>
    </div>
    <div class="column">
      <p class="is-info">{{ zonefile.status }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">zonefile</p>
    </div>
    <div class="column">
      <div class="field">
        <div class="control">
          <textarea
            v-model="zonefile.zonefile"
            class="textarea"
            placeholder="">
          </textarea>
        </div>
      </div>
      <p class="is-info">{{ zonefile.zonefile }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">zonefile_hash</p>
    </div>
    <div class="column">
      <p class="is-info">{{ zonefile.zonefile_hash }}</p>
    </div>
  </div>
</section>
</template>

<script>

export default {
  name: 'AccountZonefile',
  props: [ 'username', 'zonefile', 'error' ],
  data () {
    return {
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    updateZonefile: function () {
      console.log(this.account)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
