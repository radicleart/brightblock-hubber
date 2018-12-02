<template>
  <div id="filter-art">
    <ul>
      <li data-type-filter="all" class="active">All Types</li>
      <li data-type-filter="photography">Photography</li>
      <li data-type-filter="illustration">Illustration</li>
      <li data-type-filter="3d">3D</li>
      <li data-type-filter="2d">2D</li>
      <li data-type-filter="film">Film & Video</li>
      <li data-type-filter="mix-media">Mix-media</li>
    </ul>
    <div class="hr-spacer"></div>
    <div id="auction-container">
      <input type="checkbox" id="auction" name="auction" :value="filters.auction" @change="updateFilter()" />
      <label for="auction">Auction</label>
    </div>
    <div class="hr-spacer"></div>
    <div id="priceRange">
      <span class="left">Price</span>
      <span class="right">€ {{ filters.price }}-50.000 </span>
      <input type="range" min="50" max="50000" class="slider" @change="updateFilter()" v-model="filters.price">  <!-- :value="filters.price" -->
    </div>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Filters',
  data () {
    return {
      filters: {
        type: null,
        auction: false,
        price: 0
      },
    }
  },
  methods: {
    updateFilter () {
      this.$emit('update', this.filters)
    }
  }
}
</script>
