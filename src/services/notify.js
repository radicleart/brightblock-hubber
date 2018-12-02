import Vue from 'vue'
import store from '@/storage/store'

const notify = {
  debug (note) {
    if (store.getters['isDebugMode']) {
      Vue.notify({duration: 6000, type: 'warn', group: 'artwork-actions', title: note.title, text: note.text})
    }
  },
  info (note) {
    Vue.notify({duration: 6000, type: 'success', group: 'artwork-actions', title: note.title, text: note.text})
  },
  warn (note) {
    Vue.notify({duration: 6000, type: 'warn', group: 'artwork-actions', title: note.title, text: note.text})
  },
  error (note) {
    Vue.notify({duration: 6000, type: 'error', group: 'artwork-actions', title: note.title, text: note.text})
  },
}

export default notify
