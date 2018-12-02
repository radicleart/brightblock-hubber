<template>
<aside class="menu">
  <h3 class="menu-label">
    Nodes
  </h3>
  <ul class="menu-list">
    <li>
      <router-link
        :to="`/lightning/nodes/${node}/listNodes`">
        List Nodes
      </router-link>
    </li>
    <!--
    <li>
      <router-link
        :to="`/lightning/nodes/${node}/getNodeInfo`">
        Get Node Info
      </router-link>
    </li>
    <li>
      <router-link
        :to="`/lightning/nodes/${node}/getInfo`">
        Get Info
      </router-link>
    </li>
    -->
    <li>
      <a href="#" @click="describeGraph()">
        Describe Graph
      </a>
    </li>
  </ul>
</aside>
</template>

<script>

export default {
  data () {
    return {
      node: 'bob'
    }
  },
  components: {
  }
}
</script>

<style lang="scss">
</style>
