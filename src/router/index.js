import Vue from 'vue'
import Router from 'vue-router'
import myAccountService from '@/services/myAccountService'
import Home from '../pages/Home'
import Admin from '../components/admin/Admin'
import AdminSettings from '../components/admin/AdminSettings'
import AdminRegistrations from '../components/admin/AdminRegistrations'
import GaiaSettings from '../components/admin/GaiaSettings'
// import LightningNodes from '@/components/lightning/LightningNodes'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true },
      component: Admin,
      children: [
        {
          path: '/admin/settings',
          name: 'adminSettings',
          component: AdminSettings
        }, {
          path: '/admin/registrations',
          name: 'adminRegistrations',
          component: AdminRegistrations
        }, {
          path: '/admin/gaia-config',
          name: 'gaiaSettings',
          component: GaiaSettings
        }
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!myAccountService.myProfile().loggedIn) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
