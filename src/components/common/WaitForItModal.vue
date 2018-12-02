<template>
<div id="waitForItModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Updating Data</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Please wait - we are updating the information.</p>
      </div>
      <div class="modal-footer">
      </div>
    </div>
  </div>
</div>
</template>

<script>
import JQuery from 'jquery'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'WaitForItModal',
  data () {
    return {
      message: 'Please wait - we are updating the price of your item on the blockchain.',
    }
  },
  methods: {
    closeModal () {
      JQuery('#waitForItModal').modal('hide')
    }
  }
}
</script>
