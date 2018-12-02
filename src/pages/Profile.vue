<template>
  <section class="white-bg black">
    <div class="container wide">
      <div class="row">
        <div class="col-sm-12 pt-60">
          <h1 class="font-size-48">Profile Information</h1>
        </div>
        <div class="col-sm-12 pt-50 my-profile">
          <profile-detail label="Name" :value="userData.name"/>
          <profile-detail label="Username" :value="userData.username"/>
          <profile-detail label="Description" :value="userData.description"/>
          <profile-detail label="Avatar URL" :value="userData.avatarUrl"/>
          <profile-detail label="Hub URL" :value="userData.hubUrl"/>
          <recent-apps :apps="userData.apps"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import myAccountService from '@/services/myAccountService'
import ProfileDetail from '../components/profile/ProfileDetail'
import RecentApps from '../components/profile/RecentApps'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Profile',
  components: { RecentApps, ProfileDetail },
  data () {
    return {
      error: {
        errorMessage: '',
        hasError: false,
        myClass: '',
      },
      userData: {},
    }
  },
  mounted () {
    this.userData = myAccountService.myProfile()
  },
}
</script>
