<template>
  <div>
    <span class="grey">Join our mailing list</span>
    <form class="form-inline newsletter-form" @submit.prevent="submit()">
      <input type="email" placeholder="Your email address" class="form-control input-lg grey" v-model="email">
      <button class="btn btn-lg black" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'NewsletterForm',
  data () {
    return {
      email: null,
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.email)
    }
  }
}
</script>
<style>
.newsletter-form {
  padding-top: 15px;
  padding-bottom: 15px;
  button {
    width: 186px;
    text-transform: uppercase;
    background: $grey;
   // height: 82px;
    box-sizing: border-box;
    padding: 32px 50px 24px 50px;
    @media all and (max-width: 768px) {
      width: 100%;
      max-width: 400px;
    }
  }
  input.form-control {
    width: calc(100% - (186px + 20px));
    line-height: 82px;
    box-sizing: border-box;
    margin-right: 15px;
    padding: 42px 15px 38px 15px;
    @media all and (max-width: 768px) {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }

    @include placeholder {
      padding: 42px 15px 38px 0px;
    }
  }
}
</style>
