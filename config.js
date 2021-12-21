var config = {
	app: {
		name: "Easy Aspataal",
		url: "http://localhost:8060",
		frontendUrl: "http://localhost:8050",
		secret: "55f367154d07d7bd1c50637eb00091b0",
		language: "english",
		publicDir: "assets",
	},
	meta: {
		author:"",
		description: "__metadescription",
		charset: "UTF-8",
	},
	database: {
		name:"easy_aspataal",
		type: "postgres",
		host: "localhost",
		username: "postgres",
		password: "Easy@1234",
		port: "5432",
		charset: "utf8",
		recordlimit: 10,
		ordertype: "DESC"
	},
	mail: {
		username:"",
		password: "",
		senderemail:"",
		sendername:"",
		host: "",
		port: ""
	},
	upload: {
		tempDir: "uploads/temp/",
		import_data: {
			filenameType: "timestamp",
			extensions: "json,csv",
			limit: "10",
			maxFileSize: "3",
			returnFullpath: "false",
			filenamePrefix: "",
			uploadDir: "uploads/files/"
		},
		
		photo: {
			filenameType: "random",
			extensions: "jpg,png,gif,jpeg",
			limit: "1",
			maxFileSize: "3",
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

		policy_doc: {
			filenameType: "random",
			extensions: "docx,doc,xls,xlsx,xml,csv,pdf,xps",
			limit: "3",
			maxFileSize: "100",
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			
		},

		hospital_invoice: {
			filenameType: "random",
			extensions: "docx,doc,xls,xlsx,xml,csv,pdf,xps",
			limit: "1",
			maxFileSize: "3",
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			
		},

	},
	s3: {
		secretAccessKey: "",
		accessKeyId: "",
		region: "",
		bucket: "",
	},
	
	locales: {
		'english': 'English',
	}

}
module.exports = config