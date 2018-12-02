<template>
<!-- Footer -->
<footer class="page-footer font-small blue pt-4 bg-dark">
  <!-- Footer Links -->
  <div class="container-fluid text-center text-md-left">
    <div class="row">
      <hr class="clearfix w-100 d-md-none pb-3">
      <div class="col-md-5 col-sm-4 text-left text-uppercase">
      <!--
        <ul class="nav">
          <li class="nav-item"><router-link class="nav-link text-white" to="/about">About</router-link></li>
          <li class="nav-item"><router-link class="nav-link text-white" to="/resources">Resources</router-link></li>
          <li class="nav-item"><router-link class="nav-link text-white" to="/how-it-works">How it works</router-link></li>
        </ul>
      -->
      </div>
      <div class="col-md-7 col-sm-8 text-left">
        <newsletter-form @submit="submitNewsletterEmail($event)"/>
      </div>
    </div>
  </div>
  <!-- Footer Links -->

  <!-- Copyright -->
  <div class="text-center py-3">
    <div class="row footer-bottom clearfix">
      <div class="col-md-7 col-sm-6">
        <ul class="list-inline">
          <li class="text-uppercase "><span class="copy">&copy;</span>2018 Open Art Market</li>
          <li><router-link to="/privacy">Privacy Policy</router-link></li>
          <li>Brighton, Platf9rm</li>
        </ul>
      </div>
      <div class="col-md-5 col-sm-6 social">
        <ul class="list-inline ">
          <li class="text-uppercase">Join the conversation</li>
          <li><a href="#"><span class="icon-email"></span></a></li>
          <li><a href="#"><span class="icon-m_social"></span></a></li>
          <li><a href="#"><span class="icon-instagram"></span></a></li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Copyright -->
</footer>
<!-- Footer --></template>

<script>
import NewsletterForm from './NewsletterForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AppFooter',
  components: { NewsletterForm },
  methods: {
    submitNewsletterEmail (email) {
      console.log(email)
      // TODO submit email to newsletter service
    }
  }
}
</script>
<style>
</style>
