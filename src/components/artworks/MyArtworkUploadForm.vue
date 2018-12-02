<template>
<div class="innerpage mt-50 col-md-12">

  <wait-for-it-modal/>

  <form class="form-horizontal">
    <p v-if="errors.length" :key="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(error, index) in errors" :key="index" v-bind:error="error">{{ error }}</li>
      </ul>
    </p>
    <div class="form-group">
      <label>Title</label>
      <input class="form-control" type="text" placeholder="Title of your item" v-model="artwork.title">
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea class="form-control" placeholder="What inspired you to create this?" v-model="artwork.description"></textarea>
    </div>

    <div class="form-group">
      <label>Keywords</label>
      <textarea class="form-control" placeholder="keywords" v-model="artwork.keywords"></textarea>
    </div>

    <div class="form-group">
      <label>Editions</label>
      <input class="form-control" type="number" placeholder="How many editions would you like" v-model="artwork.editions">
    </div>

    <div class="form-group">
      <label>Owner (Blockstack Id)</label>
      <input class="form-control" type="text" placeholder="Id of the owner." v-model="artwork.owner">
    </div>

    <div class="form-group">
      <label>Artist (Blockstack Id)</label>
      <input class="form-control" type="text" placeholder="Id of the artist." v-model="artwork.artist">
    </div>

    <h4>Artwork Images</h4>
    <hr/>
    <div class="radio-inline">
      <label>
        <input type="radio" name="artwork.itemType" value="physart" v-model="artwork.itemType">
        Physical Artwork
      </label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" name="artwork.itemType" value="digiart" v-model="artwork.itemType" checked>
        Digital Artwork
      </label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" name="artwork.itemType" value="photoart" v-model="artwork.itemType">
        Photographic work
      </label>
    </div>
    <div class="form-group" v-if="artwork.itemType == 'digiart' || artwork.itemType == 'photoart'">
      <div id="load-artwork">
        <div class="drop_area" @drop.prevent="loadArtwork" @dragover.prevent>
          Drop your artwork file here!
        </div>
      </div>
      <div class="row">
        <hr/>
      </div>
      <div class="row">
        <div class="col-sm-4"><h5>Image / File</h5></div>
        <div class="col-sm-8"><h5>File Information</h5></div>
      </div>
      <div class="row">
        <hr/>
      </div>
      <my-artwork-manage-image v-for="(file, index) in artwork.artwork" :key="index" :file="file"/>
      <div class="form-group pull-right" v-if="artwork.artwork.length > 0">
        <button type="submit" class="btn btn-default" @click.prevent="deleteArtwork()">Restart Artwork</button>
      </div>
    </div>

    <h4>Other Images</h4>
    <hr/>
    <div class="form-group">
      <div id="load-artwork">
        <div class="drop_area" @drop.prevent="loadImageFiles" @dragover.prevent>
          Drop your images of your art here!
        </div>
      </div>
      <div class="row">
        <hr/>
      </div>
      <div class="row">
        <div class="col-sm-4"><h5>Image / File</h5></div>
        <div class="col-sm-8"><h5>File Information</h5></div>
      </div>
      <div class="row">
        <hr/>
      </div>
      <my-artwork-manage-image v-for="(file, index) in artwork.images" :key="index" :file="file"/>
      <div class="form-group pull-right" v-if="artwork.images.length > 0">
        <button type="submit" class="btn btn-default" @click.prevent="deleteImages()">Restart Images</button>
      </div>
    </div>

    <h4>Supporting Documents</h4>
    <hr/>
    <div class="form-group">
      <div id="load-artwork">
        <div class="drop_area" @drop.prevent="loadSupportingFiles" @dragover.prevent>
          Drop supporting documents here!
        </div>
      </div>
      <div class="row">
        <hr/>
      </div>
      <div class="row">
        <div class="col-sm-4"><h5>Image / File</h5></div>
        <div class="col-sm-8"><h5>File Information</h5></div>
      </div>
      <div class="row">
        <hr/>
      </div>
      <my-artwork-manage-image v-for="(file, index) in artwork.supportingDocuments" :key="index" :file="file"/>
      <div class="form-group pull-right" v-if="artwork.supportingDocuments.length > 0">
        <button type="submit" class="btn btn-default" @click.prevent="deleteDocuments()">Restart Documents</button>
      </div>
    </div>

    <div class="form-group">
      <button type="submit" class="btn btn-primary" v-on:click.prevent="upload">Submit</button>
    </div>
  </form>
</div>
</template>

<script>
import WaitForItModal from '@/components/common/WaitForItModal'
import MyArtworkManageImage from '@/components/artworks/MyArtworkManageImage'
import JQuery from 'jquery'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyArtworkUploadForm',
  components: { MyArtworkManageImage, WaitForItModal },
  props: ['artworkId', 'mode'],
  data () {
    return {
      errors: [],
      artwork: {
        itemType: 'digiart',
        keywords: 'Photography,Illustration.3D,2D,Film & Video,Mix-media',
        owner: 'unknown',
        editions: 1,
        images: [],
        supportingDocuments: [],
        artwork: []
      },
    }
  },
  mounted () {
    if (this.mode === 'update') {
      // try to fetch it from the store - but if the user has just hard reload this page the store
      // may not have fetched it.
      let artwork = this.$store.getters['myArtworksStore/myArtwork'](this.artworkId)
      if (!artwork || !artwork.id) {
        this.$store.dispatch('myArtworksStore/fetchMyArtwork', this.artworkId)
          .then((artwork) => {
            this.artwork = artwork
          })
      } else {
        this.artwork = artwork
      }
    } else {
      let uploader = this.$store.getters['myAccountStore/getMyProfile'].username
      this.artwork.uploader = uploader
      this.artwork.owner = uploader
      this.artwork.artist = uploader
    }
  },
  methods: {
    upload: function () {
      if (this.validate()) {
        this.openModal()
        if (this.mode === 'update') {
          this.$store.dispatch('myArtworksStore/updateArtwork', this.artwork).then((artwork) => {
            this.artwork = artwork
            this.closeModal()
            this.$router.push('/my-artworks')
          })
        } else {
          this.$store.dispatch('myArtworksStore/uploadArtwork', this.artwork).then((artwork) => {
            this.artwork = artwork
            this.closeModal()
            this.$router.push('/my-artworks')
          })
        }
      }
    },
    openModal () {
      JQuery('#waitForItModal').modal('show')
    },
    closeModal () {
      JQuery('#waitForItModal').modal('hide')
    },
    validate: function () {
      this.errors = []
      if (!this.artwork.title) {
        this.errors.push('title required.')
      }
      if (!this.artwork.description) {
        this.errors.push('description required.')
      }
      if (!this.artwork.itemType) {
        this.errors.push('item type required.')
      }
      if (!this.artwork.keywords) {
        this.errors.push('keywords required.')
      }
      if (this.artwork.editions < 1 || this.artwork.editions > 10) {
        this.errors.push('Editions between 1 and 10.')
      }
      if (this.artwork.itemType !== 'physart' && this.artwork.artwork && this.artwork.artwork.length === 0) {
        this.errors.push('Please attach an artwork.')
      }
      if (this.errors.length > 0) {
        return false
      } else {
        return true
      }
    },
    deleteImages: function (e) {
      this.artwork.images = []
    },
    deleteArtwork: function (e) {
      this.artwork.artwork = []
    },
    deleteDocuments: function (e) {
      this.artwork.supportingDocuments = []
    },
    loadArtwork: function (e) {
      this.load(e, this.artwork.artwork, 1)
    },
    loadSupportingFiles: function (e) {
      this.load(e, this.artwork.supportingDocuments, 5)
    },
    loadImageFiles: function (e) {
      this.load(e, this.artwork.images, 3)
    },
    load: function (e, arrayToLoad, limit) {
      let userFiles = e.dataTransfer.files
      let fileObject = null
      for (let i = 0; i < userFiles.length; i++) {
        if (i === limit) {
          break
        }
        fileObject = userFiles[i]
        let thisFile = {
          lastModified: fileObject.lastModified,
          lastModifiedDate: fileObject.lastModifiedDate,
          name: fileObject.name,
          size: fileObject.size,
          type: fileObject.type
        }
        var reader = new FileReader()
        reader.onload = function (e) {
          thisFile.dataUrl = e.target.result
          arrayToLoad.push(thisFile)
        }
        reader.readAsDataURL(fileObject)
      }
    }
  }
}
</script>
<style>
#load-artwork {
  height: 90px;
  width: 100%;
  background: antiquewhite;
  text-align: center;
  padding-top: 20px;
  font-size: 30px;
  margin: 5px;
  border: 2pt solid green;
}
</style>
