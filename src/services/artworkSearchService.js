import searchIndexService from '@/services/searchIndexService'
import store from '@/storage/store'
import _ from 'lodash'
import utils from './utils'
import {
  getFile,
} from 'blockstack'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const artworkSearchService = {

  findArtworks: function (query, success, failure) {
    searchIndexService.searchDappsIndex('artwork', query.term, query.query)
      .then(function (results) {
        if (!results || results.length === 0) {
          success()
        } else {
          let users = []
          _.forEach(results, function (searchIndexData) {
            try {
              let index = _.findIndex(users, function (username) { return username === searchIndexData.owner })
              if (index === -1) {
                artworkSearchService.userArtworks(searchIndexData.owner, success, failure)
                users.push(searchIndexData.owner)
              }
            } catch (error) {
              failure({error: 2, message: 'wrong id format.'})
            }
          })
        }
      }).catch(function (e) {
        failure({error: 2, message: 'no artworks found'})
      })
  },

  userArtworks: function (username, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName
    getFile(artworkRootFileName, {decrypt: false, username: username}).then(function (file) {
      if (!file) {
        success()
      } else {
        let userRootFile = JSON.parse(file)
        _.forEach(userRootFile.records, function (indexData) {
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.uploader}, {root: true})
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.owner}, {root: true})
          artworkSearchService.fetchProvenanceFile(indexData, username, success, failure)
        })
      }
    }).catch(function (e) {
      failure({ERR_CODE: 101, message: 'Error fetching blockstack root file!'})
    })
  },

  userArtwork: function (artworkId, username, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName
    getFile(artworkRootFileName, {decrypt: false, username: username}).then(function (file) {
      if (!file) {
        success()
      } else {
        let userRootFile = JSON.parse(file)
        let index = _.findIndex(userRootFile.records, function (o) { return o.id === artworkId })
        if (index > -1) {
          let indexData = userRootFile.records[index]
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.uploader}, {root: true})
          store.dispatch('userProfilesStore/fetchUserProfile', {username: indexData.owner}, {root: true})
          artworkSearchService.fetchProvenanceFile(indexData, username, success, failure)
        } else {
          failure({ERR_CODE: 101, message: 'Error no record for artwork id: ' + artworkId})
        }
      }
    }).catch(function (e) {
      failure({ERR_CODE: 101, message: 'Error fetching blockstack root file!'})
    })
  },

  fetchProvenanceFile: function (indexData, username, success, failure) {
    let gaiaFileName = store.state.constants.gaiaFileName
    let fileToFetch = gaiaFileName + indexData.id + '.json'
    getFile(fileToFetch, {decrypt: false, username: username}).then(function (file) {
      if (file) {
        try {
          let provData = JSON.parse(file)
          provData.id = indexData.id
          success(utils.convertFromBlockstack({indexData: indexData, provData: provData}))
        } catch (err) {
          console.error('Corrupt json file - skipping! file: ' + file, err)
        }
      } else {
        failure({ERR_CODE: 1, message: 'no provenance file found'})
      }
    }).catch(function (e) {
      failure({ERR_CODE: 2, message: 'Error fetching provenance file found: ', exception: e})
    })
  },
}
export default artworkSearchService
