<template>
  <section class="container wide mt-5">
    <div class="row">
      <div class="col-sm-12">
        <h5 class="">Search Index Management</h5>
        <p>Index Size: {{ sizeOfIndex }}</p>
        <div class="accordion" id="accordionExample">
          <div class="card">
            <div class="card-header" id="headingZero">
              <h5 class="mb-0">
                <button
                  class="btn btn-link"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseZero"
                  aria-expanded="true"
                  aria-controls="collapseZero"
                >
                  Clear the Index
                </button>
              </h5>
            </div>
            <div
              id="collapseZero"
              class="collapse"
              aria-labelledby="headingZero"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <a href="#" @click="clearDappsIndex()">Clear search index</a>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingOne">
              <h5 class="mb-0">
                <button
                  class="btn btn-link"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Build Search Index by Pages of User Identity
                </button>
              </h5>
            </div>
            <div
              id="collapseOne"
              class="collapse"
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <form>
                  <div class="row">
                    <div class="col-md-5">
                      <input
                        class="form-control"
                        type="number"
                        placeholder="from page"
                        v-model="fromPage"
                      />
                    </div>
                    <div class="col-md-5">
                      <input
                        class="form-control"
                        type="number"
                        placeholder="to page"
                        v-model="toPage"
                      />
                    </div>
                    <div class="col-md-2">
                      <button
                        type="submit"
                        class="btn btn-primary"
                        @click="indexPages"
                      >
                        Build Index
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <!-- end card -->

          <div class="card">
            <div class="card-header" id="headingTwo">
              <h5 class="mb-0">
                <button
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Build The Search Index by User Names
                </button>
              </h5>
            </div>
            <div
              id="collapseTwo"
              class="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <form>
                  <div class="row">
                    <div class="col-md-10">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="comma separated user names"
                        v-model="users"
                      />
                    </div>
                    <div class="col-md-2">
                      <button
                        type="submit"
                        class="btn btn-primary"
                        @click="indexUsers"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
                <p class="pt-2">
                  <small><span v-html="indexUsersResult"></span></small>
                </p>
              </div>
            </div>
          </div>
          <!-- end card -->

          <div class="card">
            <div class="card-header" id="headingThree">
              <h5 class="mb-0">
                <button
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Test Names Search Index
                </button>
              </h5>
            </div>
            <div
              id="collapseThree"
              class="collapse"
              aria-labelledby="headingThree"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <form>
                  <div class="form-row align-items-center">
                    <div class="col-md-4">
                      <label
                        class="mr-sm-2 sr-only"
                        for="inlineFormCustomSelect"
                        >Preference</label
                      >
                      <select
                        class="custom-select mr-sm-2"
                        id="inlineFormCustomSelect"
                        v-model="queryTerm"
                      >
                        <option>name</option>
                        <option>description</option>
                        <option>zonefile</option>
                        <option>apps</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <div class="custom-control custom-input mr-sm-2">
                        <input
                          id="customControlAutosizing"
                          class="form-control"
                          type="text"
                          placeholder="enter query"
                          v-model="queryStringNames"
                        />
                      </div>
                    </div>
                    <div class="col-md-2">
                      <button
                        type="submit"
                        class="btn btn-primary"
                        @click="searchNamesIndex()"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
                <p>
                  <small
                    >Found: {{ namesResults.length }}
                    <button
                      type="submit"
                      class="btn btn-default"
                      @click="fetchAllNamesIndex()"
                    >
                      fetch all
                    </button>
                    <button
                      type="submit"
                      class="btn btn-default"
                      @click="clearNamesIndex()"
                    >
                      clear index
                    </button></small
                  >
                </p>
                <div
                  v-for="(result, index) in namesResults"
                  :key="index"
                  style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc"
                >
                  <div class="row">
                    <div class="col-md-2">name:</div>
                    <div class="col-md-10">{{ result.name }}</div>
                  </div>
                  <div class="row">
                    <div class="col-md-2">description:</div>
                    <div class="col-md-10">{{ result.description }}</div>
                  </div>
                  <div class="row">
                    <div class="col-md-2">apps:</div>
                    <div class="col-md-10">{{ result.apps }}</div>
                  </div>
                  <!--
                <div class="row"><div class="col-md-2">zonefile_hash:</div> <div class="col-md-10">{{ result.zonefile_hash }}</div></div>
                <div class="row"><div class="col-md-2">last_txid:</div> <div class="col-md-10">{{ result.last_txid }}</div></div>
                <div class="row"><div class="col-md-2">status:</div> <div class="col-md-10">{{ result.status }}</div></div>
                <div class="row"><div class="col-md-2">zonefile:</div> <div class="col-md-10">{{ result.zonefile }}</div></div>
                --></div>
              </div>
            </div>
          </div>
          <!-- end card -->

          <div class="card">
            <div class="card-header" id="headingFour">
              <h5 class="mb-0">
                <button
                  class="btn btn-link collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                >
                  Test Dapps Search Index
                </button>
              </h5>
            </div>
            <div
              id="collapseFour"
              class="collapse"
              aria-labelledby="headingFour"
              data-parent="#accordionExample"
            >
              <div class="card-body">
                <form>
                  <div class="form-row align-items-center">
                    <div class="col-md-3">
                      <label
                        class="mr-sm-2 sr-only"
                        for="inlineFormCustomSelect"
                        >Preference</label
                      >
                      <select
                        class="custom-select mr-sm-2"
                        id="inlineFormCustomSelect"
                        v-model="queryTerm"
                      >
                        <option>title</option>
                        <option>description</option>
                        <option>keywords</option>
                        <option>owner</option>
                        <option>domain</option>
                      </select>
                    </div>
                    <div class="col-md-3">
                      <label
                        class="mr-sm-2 sr-only"
                        for="inlineFormCustomSelect"
                        >Object Type</label
                      >
                      <select
                        class="custom-select mr-sm-2"
                        id="inlineFormCustomSelect"
                        v-model="objType"
                      >
                        <option>artwork</option>
                        <option>auction</option>
                      </select>
                    </div>
                    <div class="col-md-5">
                      <div class="custom-control custom-input mr-sm-2">
                        <input
                          id="customControlAutosizing"
                          class="form-control"
                          type="text"
                          placeholder="enter query"
                          v-model="queryStringDapps"
                        />
                      </div>
                    </div>
                    <div class="col-md-1">
                      <button
                        type="submit"
                        class="btn btn-primary"
                        @click="searchDappsIndex()"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
                <p>
                  <small
                    >Found: {{ dappsResults.length }}
                    <button
                      type="submit"
                      class="btn btn-default"
                      @click="fetchAllDappsIndex()"
                    >
                      fetch all
                    </button>
                    <button
                      type="submit"
                      class="btn btn-default"
                      @click="clearDappsIndex()"
                    >
                      clear index
                    </button></small
                  >
                </p>
                <div
                  v-for="(result, index) in dappsResults"
                  :key="index"
                  style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc"
                >
                  <div class="row">
                    <div class="col-md-2">id:</div>
                    <div class="col-md-10">{{ result.id }}</div>
                  </div>
                  <div class="row">
                    <div class="col-md-2">domain:</div>
                    <div class="col-md-10">{{ result.domain }}</div>
                  </div>
                  <div class="row">
                    <div class="col-md-2">title:</div>
                    <div class="col-md-10">{{ result.title }}</div>
                  </div>
                  <div class="row">
                    <div class="col-md-2">description:</div>
                    <div class="col-md-10">{{ result.description }}</div>
                  </div>
                  <div class="row">
                    <div class="col-md-2">owner:</div>
                    <div class="col-md-10">{{ result.owner }}</div>
                  </div>
                  <div class="row">
                    <div class="col-md-2">keywords:</div>
                    <div class="col-md-10">{{ result.keywords }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end card -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import searchIndexService from "@/services/searchIndexService";

export default {
  name: "SearchIndexManager",
  data() {
    return {
      dappsResults: [],
      namesResults: [],
      result: null,
      users: "brightblock.id,mike.personal.id",
      fromPage: null,
      toPage: null,
      sizeOfIndex: null,
      queryStringNames: null,
      queryStringDapps: null,
      objType: "artwork",
      queryTerm: "description",
      indexUsersResult: null
    };
  },
  mounted() {
    searchIndexService
      .sizeOfIndex("names")
      .then(result => {
        this.sizeOfIndex = result;
      })
      .catch(e => {
        console.log("Unable to contact search index.", e);
      });
  },
  methods: {
    indexUsers: function() {
      searchIndexService
        .indexUsers(this.users)
        .then(result => {
          this.indexUsersResult = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    indexPages: function() {
      searchIndexService
        .indexPages(this.fromPage, this.toPage)
        .then(result => {
          this.result = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    searchNamesIndex: function() {
      if (!this.queryStringNames) {
        this.queryStringNames = "*";
      }
      searchIndexService
        .searchNamesIndex(this.queryTerm, this.queryStringNames)
        .then(namesResults => {
          this.namesResults = namesResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    searchDappsIndex: function() {
      if (!this.queryStringDapps) {
        this.queryStringDapps = "*";
      }
      searchIndexService
        .searchDappsIndex(this.objType, this.queryTerm, this.queryStringDapps)
        .then(dappsResults => {
          this.dappsResults = dappsResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    fetchAllNamesIndex: function() {
      searchIndexService
        .fetchAllNamesIndex(this.queryTerm, this.queryString)
        .then(namesResults => {
          this.namesResults = namesResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    fetchAllDappsIndex: function() {
      searchIndexService
        .fetchAllDappsIndex(this.queryTerm, this.queryString)
        .then(dappsResults => {
          this.dappsResults = dappsResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    clearNamesIndex: function() {
      searchIndexService
        .clearNamesIndex()
        .then(dappsResults => {
          console.log(dappsResults);
          this.namesResults = [];
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    clearDappsIndex: function() {
      searchIndexService
        .clearDappsIndex()
        .then(dappsResults => {
          console.log(dappsResults);
          this.dappsResults = [];
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    }
  },
  components: {}
};
</script>
