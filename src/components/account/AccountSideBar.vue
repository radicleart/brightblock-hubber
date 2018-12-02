<template>
<aside class="menu">
  <p class="menu-label">
    Account
  </p>
  <ul class="menu-list">
    <li>
      <router-link
        to="/account/userData">
        My Data
      </router-link>
    </li>
    <li>
      <router-link
        to="/account/lookup">
        Who's who
      </router-link>
    </li>
  </ul>
</aside>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
