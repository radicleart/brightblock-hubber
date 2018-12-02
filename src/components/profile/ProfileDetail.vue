<template>
  <div class="row">
    <div class="col-sm-3 col-xs-12">{{label}}</div>
    <div class="col-sm-9 col-xs-12">{{value}}</div>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProfileDetail',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  }
}
</script>
