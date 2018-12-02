<template>
<section>
  <div class="columns">
    <div class="column">
      <h1 class="title">
        Profile Information
      </h1>
      <h2 class="subtitle">
        {{ this.username }}
      </h2>
      <section class="content" v-if="error.hasError">
        <p v-bind:class="error.myClass">{{ error.errorMessage }}</p>
      </section>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info"></p>
    </div>
    <div class="column">
      <p class="is-size-7">Note: This information is the public profile of the lookup user obtained by calling blockstack.lookupProfile(name)</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Name</p>
    </div>
    <div class="column">
      <p class="is-info">{{ account.name }}</p>
    </div>
  </div>
  <div class="columns is-multiline">
    <div class="column is-2">
      <p class="is-info">Description</p>
    </div>
    <div class="column" v-for="image in account.image" :key="image.contentUrl">
      <p><img style="max-width: 100px;" :alt="image.name" :src="image.contentUrl"/></p>
    </div>
    <div class="column">
      <span>{{ account.description }}</span>
    </div>
  </div>

  <div class="columns is-multiline">
    <div class="column is-2">
      <p class="is-info">Recent Apps</p>
    </div>
    <div class="column">
      <div class="columns is-multiline">
        <div class="column is-4">
          <p class="is-info"><b>d-app</b></p>
        </div>
        <div class="column">
          <div >
              <p class="is-info"><b>gaia storage location</b></p>
          </div>
        </div>
      </div>
      <div class="columns is-multiline" v-for="(gaiaUrl,appUrl) in account.apps" v-bind:key="appUrl">
        <div class="column is-4">
          <p class="is-info">{{ appUrl }}</p>
        </div>
        <div class="column is-8">
          <div >
              <p class="is-info">{{ gaiaUrl }}</p>
          </div>
        </div>
        <!--
        <div class="column">
          <div class="field is-grouped">
            <div class="control">
              <div class="control">
                <input
                  v-model="filename"
                  class="input"
                  type="text"
                  placeholder="enter name of file to look up here.">
                  <button class="button is-link" v-on:click="fetchFiles(appUrl, gaiaUrl)">Find</button>
              </div>
            </div>
          </div>
        </div>
        -->
      </div>
    </div>
  </div>

  <section class=" content">
    <div class="columns is-multiline" v-if="account.account">
      <div class="column dropdown" v-bind:class="{ 'is-active': isActive2 }" @click="isActive2 = ! isActive2">
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu2">
            <span>Account Info</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu2" role="menu">
          <div class="dropdown-content" v-for="account in account.account" :key="account.role">
            <div class="dropdown-item">
              <p>role: {{ account.role }}</p>
              <p>service: {{ account.service }}</p>
              <p>identifier: {{ account.identifier }}</p>
            </div>
            <hr class="dropdown-divider">
          </div>
        </div>
      </div>
    </div>
  </section>
</section>
</template>

<script>

export default {
  name: 'AccountProfile',
  props: [ 'username', 'account', 'filename', 'error' ],
  data () {
    return {
      isActive2: false,
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style>
</style>
