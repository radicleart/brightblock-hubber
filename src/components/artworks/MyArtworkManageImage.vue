<template>
<div class="row">
  <div class="col-sm-4"><img :src=file.dataUrl alt="none"/></div>
  <div class="col-sm-8">
    <p>
      {{ file.name }} ({{ file.size }}) type: {{ file.type }}
    </p>
    <p>
      Last Changed: {{ file.lastModifiedDate }}
    </p>
  </div>
</div>
</template>

<script>

export default {
  props: ['file'],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
  components: {
  }
}
</script>

<style scoped>
#item-images {
  width: 100px;
  height: 40px;
  border: 1pt dashed #ccc;
}
#drop_area {
  width: 100%;
  height: 50px;
  background-color: #00f3f3;
  text-align: center;
  padding: 20px;
  padding: 5px;
  border: 1pt dashed #3366dd;
}

</style>
