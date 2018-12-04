<template>
  <section class="container wide mt-5">
    <div class="row">
      <div class="col-sm-2"><admin-actions /></div>
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
import AdminActions from "@/components/admin/AdminActions";

export default {
  data() {
    return {};
  },
  mounted() {},
  components: {
    AdminActions
  }
};
</script>
