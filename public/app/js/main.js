const app = Vue.component('app', {
  data: () => ({
    jobs: [],
    overview: [],
    refresh: 60,
    showDetail: false,
    pagenumber: 1,
    showConfirm: false,
    showConfirmRequeue: false,
    showNewJob: false,
    jobData: {},
    deletec: false,
    requeuec: false,
    pagesize: 0,
    createc: false,
    property: '',
    search: '',
    object: '',
    newLimit: null,
    skip: 0,
  }),
  methods: {
    showJobDetail(data){
      this.jobData = data;
      this.showDetail = true;
    },
    confirmDelete(data){
      this.jobData = data;
      this.showConfirm = true;
    },
    confirmRequeue(data){
      this.jobData = data;
      this.showConfirmRequeue = true;
    },
    newJob(data){
      this.jobData = data;
      this.showNewJob = true;
    },
    searchForm(search, property, limit, skip, refresh, object){
        this.search = search,
        this.property = property,
        this.pagesize = parseInt(limit),
        this.skip = skip,
        this.refresh = refresh,
        this.object = object,

        this.fetchData(this.search, this.property, this.pagesize, this.skip, this.refresh, this.object)
    },
    pagechange(action){

      if(action === 'next'){
        this.pagenumber++
      }
      if(action === 'prev'){
        this.pagenumber--
      }
      this.skip = (this.pagenumber-1) * this.pagesize
      this.fetchData(this.search, this.property, this.pagesize, this.skip, this.refresh, this.object)
    },
    fetchData(search = '', property = '', limit = 5, skip = 0, refresh = 60, object){
      this.pagesize = this.pagesize === 0 ? parseInt(limit) : this.pagesize;
      this.refresh = parseFloat(refresh);
      const url = `/api?limit=${limit}&skip=${skip}&property=${property}${object ? '&isObjectId=true' : ""}&q=${search}`;
      return axios.get(url)
        .then(result => result.data)
        .then((data) => {
          console.log("data que viene",data.jobs, data.overview)
          this.jobs = data.jobs;
          this.search = search;
          this.property = property;
          this.object = object;
          this.overview = data.overview;
        })
        .catch(console.log)
    },

    popupmessage(data){
      if(data === 'delete'){
        this.deletec = true
        setTimeout(() => {
          this.deletec = false
        }, 2000);
      }
      if(data === 'requeue'){
        this.requeuec = true
        setTimeout(() => {
          this.requeuec = false
        }, 2000);
      }
      if(data === 'create'){
        this.createc = true
        setTimeout(() => {
          this.createc = false
        }, 2000);
      }
    }
    },
  created() {
    return this.fetchData();
  },
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div class="col-3">
            <a class="navbar-brand col-sm-3 col-md-2 mr-0 tittle"> Agendash 2</a>
          </div>
          <div class="col-push-7 d-none d-sm-block col-2 text-right text-light"><small>Version 2.0.0 / 04-2020</small></div>
        </div>
      </div>
      <div class="row pt-5">
          <div class="col-md-2 d-none d-md-block bg-light sidebar">
            <sidebar  v-on:new-job="newJob" v-bind:overview="overview"></sidebar>
          </div>
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="col-md-12">
              <topbar v-on:search-form="searchForm"></topbar>
            </div>
            <div class="col-md-12">
              {{search}}
              <job-list
                  v-on:confirm-delete="confirmDelete"
                  v-on:confirm-requeue="confirmRequeue"
                  v-on:show-job-detail="showJobDetail"
                  v-on:pagechange="pagechange"
                  :pagesize="pagesize"
                  :pagenumber='pagenumber'
                  :skip="skip"
                  :jobs="jobs">
              </job-list>
            </div>
          </main>
      </div>
      <job-detail v-if="showDetail" v-bind:job="jobData"></job-detail>
      <confirm-delete v-if="showConfirm" v-on:popup-message="popupmessage('delete')" v-on:refresh-data="fetchData" v-bind:job="jobData"></confirm-delete>
      <confirm-requeue v-if="showConfirmRequeue" v-on:popup-message="popupmessage('requeue')" v-on:refresh-data="fetchData" v-bind:job="jobData"></confirm-requeue>
      <popup-message :deletec="deletec" :requeuec="requeuec" :createc="createc"></popup-message>
      <new-job v-if="showNewJob" v-on:popup-message="popupmessage('create')" v-on:refresh-data="fetchData"></new-job>
  </div>
  `
})