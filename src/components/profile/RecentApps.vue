<template>
  <div>
    <div class="row">
      <div class="col-sm-3 col-xs-12">Recent apps</div>
      <div class="col-sm-3 col-xs-12"><strong>d-app</strong></div>
      <div class="col-sm-6 col-xs-12"><strong>gaia storage location</strong></div>
    </div>
    <div class="row" v-for="(app, index) of apps" :key="index">
      <div class="col-sm-3 col-sm-offset-3 col-xs-12">{{app.appUrl}}</div>
      <div class="col-sm-6 col-xs-12">{{app.gaiaUrl}}</div>
    </div>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'RecentApps',
  props: {
    apps: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
