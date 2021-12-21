var ListPageMixin = {
	props: {
		paginate : {
			type : Boolean,
			default : __paginate,
		},
		searchfield : {
			type : Boolean,
			default : __searchfield,
		},
		addbutton : {
			type : Boolean,
			default : __addbutton,
		},
		editbutton : {
			type : Boolean,
			default : __editbutton,
		},
		deletebutton : {
			type : Boolean,
			default : __deletebutton,
		},
		reload : {
			type : Boolean,
			default : __reloadonnavigated,
		},
		exportbutton : {
			type : Boolean,
			default : __exportbutton,
		},
		importbutton : {
			type : Boolean,
			default : __importbutton,
		},
		viewbutton : {
			type : Boolean,
			default : __viewbutton,
		},
		tablestyle : {
			type : String,
			default : '__tablestyle',
		},
		listsequence : {
			type : Boolean,
			default : __listsequence,
		},
		multicheckbox : {
			type : Boolean,
			default : __multicheckbox,
		},
		emptyrecordmsg : {
			type : String,
			default : '__emptyrecordmsg',
		},
		promptmessagebeforedelete : {
			type : String,
			default : '__promptdeletemessage',
		},
		msgafterdelete : {
			type : String,
			default : '__msgafterdelete',
		},
		resetgrid : {
			type : Boolean,
			default : false,
		},
		page : {
			type : Number,
			default : 1,
		},
		search : {
			type : String,
			default : '',
		},
		fieldname : {
			type : String,
			default : '',
		},
		fieldvalue : {
			type : String,
			default : '',
		},
		sortby : {
			type : String,
			default : '',
		},
		sorttype : {
			type : String,
			default : '', //desc or asc
		},
		backbutton : {
			type : Boolean,
			default : true,
		},
		showheader : {
			type : Boolean,
			default : true,
		},
		showfooter: {
			type : Boolean,
			default : true,
		},
		
	},
	data: function () {
		return {
			loading : false,
			ready: false,
			loadcompleted : false,
			selected:[],
			allSelected: false,
			totalrecords :1,
			records : [],
			includeFilters : true,
			filterParams:{},
			deleting : null,
			currentpage : 1,
			orderby : '',
			ordertype : '',
			filterby : '',
			filterText : '',
			filtervalue : '',
			filterMsgs : [],
			searchtext : '',
			errorMsg : '',
			modalComponentName: '',
			modalComponentProps: '',
			popoverTarget : '',
			showError: false,
		}
	},
	computed: {
		apiUrl: function() {
			var path = this.apipath;
			if(this.filterby){
				path = path + '/' + encodeURIComponent(this.filterby) + '/' + encodeURIComponent(this.filtervalue);
			}
			var query = {
				page : this.currentpage,
				limit : this.pagelimit,
				orderby : this.orderby,
				ordertype : this.ordertype,
				search : this.searchtext,
			};
			if(this.includeFilters == true){
				query =  extend(query , this.filterParams);
			}
			var url = setApiUrl(path , query);
			return url;
		},
		shouldLoad: function(){
			if(this.$route.name != this.routename){
				return false;
			}
			else{
				if(this.loading || this.loadcompleted || !this.paginate){
					return false;
				}
				else{
					return true;
				}
			}
		},
		currentItemsCount: function(){
			return this.records.length;
		},
		setGridSize: function(){
			if(this.resetgrid){
				return 'col-sm-12 col-md-12 col-lg-12';
			}
		},
	},
	watch : {
		'$route': function(route){
			if(route.name == this.routename ){
				this.SetPageTitle( this.pageTitle );
				var query = route.query;
				if(query.sortby || query.sorttype){
					if(query.sortby){
						this.orderby = query.sortby;
					}
					if(query.sorttype){
						this.ordertype = query.sorttype;
					}
					this.records = [];
					this.loadcompleted = false;
					this.load();
				}
				else{
					//reload page when navigated to
					if(this.reload){
						this.load();
					}
				}
			}
		},
		fieldvalue: function(){
			this.records = [];
			this.loadcompleted = false;
			this.filterby = this.fieldname;
			this.filtervalue = this.fieldvalue;
			this.load();
		},
		filterGroupChange: function(){
			this.filterGroup();
		}
	},
	methods:{
		sort: function(fieldname){
			this.orderby = fieldname;
			if(this.ordertype == 'desc'){
				this.ordertype = 'asc'
			}
			else{
				this.ordertype = 'desc'
			}
			this.records = [];
			this.load();
		},
		limitChanged: function(num){
			this.pagelimit = num;
			this.load();
		},
		changepage: function(page){
			this.currentpage = page;
			this.load();
		},
		removeFilter: function(field, index){
			this[field] = '';
			this.filterGroup();
			this.filterMsgs.splice(index,1);
		},
		dosearch: function(){
			if(this.searchtext){
				this.filterMsgs = [ {label: 'Search', value: this.searchtext, field: 'searchtext'} ];
			}
			else{
				this.filterMsgs = [];
			}
			this.includeFilters = false;
			this.records = [];
			this.load();
			this.includeFilters = true;
		},
		
		filter: function(filter){
			this.records = [];
			this.loadcompleted = false;
			this.filterParams = filter;
			this.load();
		},
		showPageModal: function(compProps){
			this.$root.$emit('showPageModal' , compProps);
		},
		deleteRecord : function(recid , index){
			var recids = recid || this.selected.toString();
			if(recids){
				var prompt = this.promptmessagebeforedelete;
				
				if (prompt != ""){
					if(!confirm(prompt)){
						return;
					}
				}
				var url = setApiUrl(this.pagename + '/delete/' + recids);
				this.deleting = recid;
				this.$http.get(url).then(function (response) {
					if(index){
						this.deleting = null;
						this.records.splice(index,1);
						if(this.msgafterdelete){
							this.$root.$emit('requestCompleted' , this.msgafterdelete);
						}
					}
					else{
						this.load();
					}
				},
				function (response) {
					this.deleting = null;
					this.$root.$emit('requestError' , response);
				});
			}
		},
		exportRecord : function(){
			this.exportPage(this.$refs.datatable.innerHTML, this.pageTitle);
		},
	},
	mounted : function() {
		this.showError = false;
		this.filterby = this.fieldname;
		this.filtervalue = this.fieldvalue;
		this.pagelimit = this.limit;
		this.page = this.page;
		
		if(this.$route.query.sortby){
			this.orderby = this.$route.query.sortby;
		}
		else{
			this.orderby = this.sortby;
		}
		
		if(this.$route.query.sorttype){
			this.ordertype = this.$route.query.sorttype;
		}
		else{
			this.ordertype = this.sorttype;
		}

		this.searchtext = this.search;
		this.load();
	},

	created: function(){
		var vm = this;
		bus.$on('refresh' , function(){
			vm.load();
		});
	},
}

var ViewPageMixin = {
	props: {
		id : {
			type : String,
			default : '',
		},
		fieldname : {
			type : String,
			default : '',
		},
		fieldvalue : {
			type : String,
			default : '',
		},
		editbutton : {
			type : Boolean,
			default : __editbutton,
		},
		deletebutton : {
			type : Boolean,
			default : __deletebutton,
		},
		exportbutton : {
			type : Boolean,
			default : __exportbutton,
		},
		promptmessagebeforedelete : {
			type : String,
			default : '__promptdeletemessage',
		},
		msgafterdelete : {
			type : String,
			default : '__msgafterdelete',
		},
		isModal : {
			type : Boolean,
			default : false,
		},
		backbutton : {
			type : Boolean,
			default : true,
		},
		showheader : {
			type : Boolean,
			default : true,
		},
		showfooter: {
			type : Boolean,
			default : true,
		},
	},
	data : function() {
		return {
			filterby : '',
			filtervalue : '',
			ready : false,
			loading : false,
			showError: false,
			errorMsg : '',
		}
	},
	computed: {
		setGridSize: function(){
			if(this.resetgrid){
				return 'col-sm-12 col-md-12 col-lg-12';
			}
		},
		apiUrl: function() {
			var path = this.apipath;
			if(this.filterby){
				path = path + '/' + this.filterby + '/' + this.filtervalue;
			}
			else{
				path = path + '/' + this.id
			}
			var url = setApiUrl(path);
			return url;
		},
	},
	methods :{
		load : function(){
			this.resetData();
			this.loading = true;
			this.showError = false;
			this.ready = false;
			this.$http.get(this.apiUrl).then(function (response) {
				this.loading = false;
				this.ready = true;
				if(response.body){
					this.data = response.body;
				}
				else{
					this.$root.$emit('requestError' , response);
				}
				
			},
			function (response) {
				this.loading = false;
				this.$root.$emit('requestError' , response);
			});
		},
		deleteRecord : function(recid){
			var recid = this.id;
			var prompt = this.promptmessagebeforedelete;
			if (prompt != ""){
				if(!confirm(prompt)){
					return;
				}
			}
			var url = setApiUrl( this.pagename + '/delete/' + recid);
			this.$http.get(url).then(function (response) {
				if(this.msgafterdelete){
					this.$root.$emit('requestCompleted' , this.msgafterdelete);
					router.push({ path: '/' + this.pagename });
				}
			},
			function (response) {
				this.$root.$emit('requestError' , response);
			});
		},
		showPageModal: function(compProps){
			this.$root.$emit('showPageModal' , compProps);
		},
		exportRecord : function(){
			this.exportPage(this.$refs.datatable.innerHTML, this.pageTitle);
		}
	},
	watch : {
		id : function(){
			if(this.id){
				this.load();
			}
		},
		fieldname : function(){
			this.filterby = this.fieldname;
			this.filtervalue = this.fieldvalue;
			this.load();
		},
		fieldvalue : function(){
			this.filterby = this.fieldname;
			this.filtervalue = this.fieldvalue;
			this.load();
		},
		'$route': function(route){
			if(route.name == this.routename ){
				this.SetPageTitle( this.pageTitle );
			}
		},
	},
	created: function(){
		var vm = this;
		bus.$on('refresh' , function(){
			/* vm.records = [];
			vm.load(); */
		});
	},
	mounted : function() {
		this.filterby = this.fieldname;
		this.filtervalue = this.fieldvalue;
		this.load();
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
}

var AddPageMixin = {
	props:{
		submitbuttontext : {
			type : String,
			default : '__submitbuttontextadd',
		},
		msgaftersave : {
			type : String,
			default : '__msgaftersave',
		},
		resetgrid : {
			type : Boolean,
			default : false,
		},
		showheader : {
			type : Boolean,
			default : true,
		},
		
		submitAction : {
			type : String,
			default : 'submit',
		},
		informwizard : {
			type : Boolean,
			default : false,
		},
		
		modelBind: {
			type: Object,
			default: function () { return {} }
		}
	},
	data : function() {
		return {
			saving : false,
			ready : false,
			errorMsg : '',
			showError: false,
		}
	},
	computed: {
		setGridSize: function(){
			if(this.resetgrid){
				return 'col-sm-12 col-md-12 col-lg-12';
			}
		}
	},
	watch: {
		'$route': function(route){
			//change page browser title
			if(route.name == this.routename ){
				this.SetPageTitle( this.pageTitle );
			}
		},
		modelBind: function(){
			for(key in this.modelBind){
				this.data[key]= this.modelBind[key];
			}
		}
	},
	methods : {
		save : function(e){
			//prevent default event
			e.preventDefault();
			var self = this;
			this.$validator.validateAll().then( function(result) {
				if (result) {
					var payload = self.data;
					var url = setApiUrl(self.apipath);
					var submitAction = self.submitAction;
					if(submitAction == 'submit'){
						self.saving = true;
						self.$http.post( url , payload , {emulateJSON:true} ).then(function (response) {
							if(response.body){
								self.id = response.body
								self.saving = false
								self.resetForm();
								self.actionAfterSave(response); //show flash message | redirect to page
							}
							else{
								self.$root.$emit('requestError' , response);
							}
						},
						function (response) {
							self.saving = false;
							self.$root.$emit('requestError' , response);
						});
					}
					else{
						//this get called if the form is added to a form wizard
						//pass back the form data to the form wizard after validation has completed successfully
						bus.$emit('movewizard' , [payload, url, submitAction]);
					}
					self.errors.clear();
				}
			});
			return;
		},
		uploadcompleted : function(arg){
			this.data[arg.field]= arg.result;
		}
	},
	created: function(){
		
	},
	mounted : function() {
		this.showError = false;
		this.ready = true;
	},
}

var EditPageMixin = {
	props: {
		id : {
			type : String,
			default : '',
		},
		submitbuttontext : {
			type : String,
			default : '__submitbuttontextedit',
		},
		msgafterupdate : {
			type : String,
			default : '__msgafterupdate',
		},
		resetgrid : {
			type : Boolean,
			default : false,
		},
		showheader : {
			type : Boolean,
			default : true,
		},
		informwizard : {
			type : Boolean,
			default : false,
		},
		submitAction : {
			type : String,
			default : 'submit',
		},
		backbutton : {
			type : Boolean,
			default : true,
		},
		ismodal : {
			type : Boolean,
			default : false,
		},
		modelBind: {
			type: Object,
			default: function () { return {} }
		}
	},
	data: function() {
		return {
			errorMsg : '',
			showError: false,
			loading : false,
			ready: false,
			saving : false,
		}
	},
	computed: {
		setGridSize: function(){
			if(this.resetgrid){
				return 'col-sm-12 col-md-12 col-lg-12';
			}
		}
	},
	methods: {
		load: function(){
			var url = setApiUrl(this.apipath + '/' + this.id);
			this.loading = true;
			this.showError = false;
			this.ready = false;
			this.$http.get( url ).then(
				function (response) {
					this.loading = false
					this.ready = true
					if(response.body){
						this.data = response.body;
					}
					else{
						this.$root.$emit('requestError' , response);
					}
				},
				function (response) {
					this.loading = false;
					this.$root.$emit('requestError' , response);
				}
			);
		},
		
		update:function(){
			var self = this;
			var submitAction = self.submitAction;
			this.$validator.validateAll().then( function(result) {
				if (result) {
					var payload = self.data;
					var url = setApiUrl(self.apipath + '/' + self.id);
					if(submitAction == 'submit'){
						self.saving = true;
						self.$http.post( url , payload , {emulateJSON:true} ).then(function (response) {
								self.saving = false
								self.actionAfterUpdate(response);
							},
							function (response) {
								self.saving = false;
								self.$root.$emit('requestError' , response);
							}
						);
					}
					else{
						//this get called if the form is added to a form wizard
						//pass back the form data to the form wizard after validation has completed successfully
						bus.$emit('movewizard' , [payload, url, submitAction]);
					}
				}
			});
		},
		uploadcompleted : function(arg){
			this.data[arg.field]= arg.result;
		},
	},
	watch: {
		id: function(newVal, oldVal) {
			if(this.id){
				this.load();
			}
		},
		'$route': function(route){
			if(route.name == this.routename ){
				this.SetPageTitle( this.pageTitle );
			}
		},
	},
	created: function(){

	},
	mounted: function() {
		this.load();
	},
}

