<template>
<section class="page">
  <div class="columns">
    <div class="column is-one-fifth">
      <account-side-bar />
    </div>
    <div class="column is-four-fifths">
      <router-view>
      </router-view>
    </div>
  </div>
</section>
</template>

<script>
import AccountSideBar from './AccountSideBar'

export default {
  data: () => ({
  }),
  components: {
    AccountSideBar
  }
}
</script>

<style>
</style>
