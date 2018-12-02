<template>
<section>
  <div class="columns">
    <div class="column">
      <h1 class="title">
        Profile Information
      </h1>
      <h2 class="subtitle">
        {{ userData.username }}
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
      <p class="is-size-7">Note: This information belongs to the local logged in user (you) and is obtained by calling blockstack.getUserData()</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Name</p>
    </div>
    <div class="column">
      <p class="is-info">{{ userData.name }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Username</p>
    </div>
    <div class="column">
      <p class="is-info">{{ userData.username }}</p>
    </div>
  </div>

  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Description</p>
    </div>
    <div class="column">
      <p class="is-info">{{ userData.description }}</p>
    </div>
  </div>

  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">Avatar Url</p>
    </div>
    <div class="column">
      <p class="is-info">{{ userData.avatarUrl }}</p>
    </div>
  </div>
  <div class="columns is-mobile">
    <div class="column is-2">
      <p class="is-info">hubUrl</p>
    </div>
    <div class="column">
      <p class="is-info">{{ userData.hubUrl }}</p>
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
      <div class="columns is-multiline" v-for="(gaiaUrl,appUrl) in userData.apps" v-bind:key="appUrl">
        <div class="column is-4">
          <p class="is-info">{{ appUrl }}</p>
        </div>
        <div class="column is-8">
          <div >
              <p class="is-info">{{ gaiaUrl }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class=" content">
    <div class="columns is-multiline" v-if="userData.account">
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
          <div class="dropdown-content">
            <div class="dropdown-item">
              <p>role: {{ userData.role }}</p>
              <p>service: {{ userData.service }}</p>
              <p>identifier: {{ userData.identifier }}</p>
            </div>
            <hr class="dropdown-divider">
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-multiline">
      <div class="column" v-for="image in userData.image" :key="image.contentUrl">
        <p><img style="max-width: 250px;" :alt="image.name" :src="image.contentUrl"/></p>
      </div>
    </div>
  </section>
</section>
</template>

<script>
import authorization from '../../services/authorization'

export default {
  name: 'AccountProfile',
  data () {
    return {
      error: {
        errorMessage: '',
        hasError: false,
        myClass: '',
      },
      userData: {},
    }
  },
  mounted () {
    authorization.getUserData().then((userData) => {
      this.userData = userData
    })
  },
  components: {
  }
}
</script>

<style>
</style>
