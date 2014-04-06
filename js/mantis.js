var Mantis = {
	_currentprojectid : 0,
	_projectcategories : [],
	_statues : null,
	_severities : null,
	_projectusers : [],
	_projectcustomfields : [],
	_accesslevels : [],
	_userprojects : [],
	_priorities : null,
	_tags : [],
	_defaultaccesslevelforuserenum : 10,
	_defaultfilterid : null,
	_closedissuesfilterid : null,
	_version : null,

	ConnectURL : location.protocol + "//" + document.location.hostname + "/api/soap/mantisconnect.php",
	
	ClearForLogout : function() {
		Mantis._currentprojectid = 0;
		Mantis._currentprojectname = "";
		Mantis._projectcategories = [];
		Mantis._statues = null;
		Mantis._resolutions = null;
		Mantis._severities = null;
		Mantis._priorities = null;
		Mantis._projectusers = [];
		Mantis._projectcustomfields = [];
		Mantis._accesslevels = [];
		Mantis._userprojects = [];
		Mantis._defaultaccesslevelforuserenum = 10;
		Mantis._tags = [];
	},

	HistoryUpdateTypes : [
		"NORMAL_TYPE",
		"NEW_BUG",
		"BUGNOTE_ADDED",
		"BUGNOTE_UPDATED",
		"BUGNOTE_DELETED",
		"",
		"DESCRIPTION_UPDATED",
		"ADDITIONAL_INFO_UPDATED",
		"STEP_TO_REPRODUCE_UPDATED",
		"FILE_ADDED",
		"FILE_DELETED",
		"BUGNOTE_STATE_CHANGED",
		"BUG_MONITOR",
		"BUG_UNMONITOR",
		"BUG_DELETED",
		"BUG_ADD_SPONSORSHIP",
		"BUG_UPDATE_SPONSORSHIP",
		"BUG_DELETE_SPONSORSHIP",
		"BUG_ADD_RELATIONSHIP",
		"BUG_DEL_RELATIONSHIP",
		"BUG_CLONED_TO", 
		"BUG_CREATED_FROM",
		"CHECKIN",
		"BUG_REPLACE_RELATIONSHIP",
		"BUG_PAID_SPONSORSHIP", 
		"TAG_ATTACHED",
		"TAG_DETACHED",
		"TAG_RENAMED"
		//		100: "PLUGIN_HISTORY"
	],

	Preload : function() {
		Mantis.LoadTagsAsync();
		Mantis.LoadSeveritiesAsync();
		Mantis.LoadResolutionsAsync();
	},	
	
	set DefaultFilterID(value) {
		Mantis._defaultfilterid = value;
	},
 
	get DefaultFilterID() {
		return Mantis._defaultfilterid;  
	},
	
	set ClosedIssuesFilterID(value) {
		Mantis._closedissuesfilterid = value;
	},
	get ClosedIssuesFilterID() {
		return Mantis._closedissuesfilterid;  
	},
	
	get UserProjects() {
		if(Mantis._userprojects.length == 0) {
			Mantis._userprojects = Mantis.ProjectsGetUserAccessible();
		}
		return Mantis._userprojects;
	},

	get AccessLevels() {
		if(Mantis._accesslevels.length == 0) {
			Mantis._accesslevels = Mantis.EnumAccessLevels();
		}
		return Mantis._accesslevels;
	},

	get Priorities () {
		if(Mantis._priorities == null) {
			Mantis._priorities = Mantis.EnumPriority();
		}
		return Mantis._priorities;
	},
	
	get Statuses() {
		if(Mantis._statues == null) {
			Mantis._statues = Mantis.EnumStatus(null);  
		}
		
		return Mantis._statues;
	},

	get Tags() {
		if(Mantis._tags == null || Mantis._tags.length == 0) {
			Mantis._tags = Mantis.TagGetAll(0,9999);
		}
		return Mantis._tags;
	},

	LoadTagsAsync : function() {
		Mantis.TagGetAll(0,9999, function(retObj) {
			Mantis._tags = retObj.results;
		});
	},

	LoadResolutionsAsync : function() {
		Mantis.EnumResolutions(function(retObject) {
			Mantis._resolutions = retObject;
		});
	},

	LoadSeveritiesAsync : function() {
		Mantis.EnumSeverities(function(retObject) {
			Mantis._severities = retObject;
		});
	},

	LoadTagsSync : function() {
		Mantis._tags = Mantis.TagGetAll(0,9999).results;
	},
	
	get ProjectCategories() {
		if(Mantis._projectcategories.length == 0) {
			Mantis._projectcategories = Mantis.ProjectGetCategories();
		}
	  return Mantis._projectcategories;  
	},
	
	get ProjectUsers() {
		if(Mantis._projectusers.length == 0) {
			Mantis._projectusers = Mantis.ProjectGetUsers(Mantis._defaultaccesslevelforuserenum);
		}
		return Mantis._projectusers;
	},

	get ProjectCustomFields() {
		if(Mantis._projectcustomfields.length == 0) {
			Mantis._projectcustomfields = Mantis.ProjectGetCustomFields(Mantis.CurrentProjectID);
		}
		return Mantis._projectcustomfields;
	},

	get  Resolutions() {
		if(Mantis._resolutions == null) {
			Mantis._resolutions = Mantis.EnumResolutions(Kanban.CurrentUser.UserName, Kanban.CurrentUser.Password, null);
		}
		return Mantis._resolutions;
	},

	get  Severities() {
		if(Mantis._severities == null) {
			Mantis._severities = Mantis.EnumSeverities(Kanban.CurrentUser.UserName, Kanban.CurrentUser.Password, null);
		}
		return Mantis._severities;
	},
	
	get CurrentProjectID() {
		return Mantis._currentprojectid;
	},
	
	set CurrentProjectID(value) {

		if(Mantis._currentprojectid != value) {
			///Clear the project specific stuff
			Mantis._projectusers = [];
			Mantis._projectcustomfields = [];
			Mantis._projectcategories = [];
		}

		Mantis._currentprojectid = value;
	},

	get CurrentProjectName() {
		return Mantis._currentprojectname;
	},

	Params : {
		Access : "access",
		Content : "content",
		Enumeration: "enumeration",
		FileType : "file_type",
		FilterID : "filter_id",
		IssueID : "issue_id",
		IssueID_Caps : "issueId",
		Issue : "issue",
		Name : "name",
		Note : "note",
		Password : "password",
		PageNumber : "page_number",
		PerPage : "per_page",
		ProjectID : "project_id",
		Tag : "tag",
		Tags : "tags",
		UserName : "username",
		IssueAttachmentID : "issue_attachment_id",
	},

	RemoveNullCustomFieldsFromIssue : function(issue) {
		if(issue.custom_fields === undefined) return;

		/// Remove custom fields if they have no value.  This way mantis will leave them alone and keep them null.
		var removeNullCustomFields = new Array();
		for(var fi =0 ; fi < issue.custom_fields.length; fi++) {
			if(issue.custom_fields[fi].value === null) {
				removeNullCustomFields.push(fi);
			}
		}

		for(var removeIndex = 0; removeIndex < removeNullCustomFields.length; removeIndex++) {
			issue.custom_fields.splice(removeNullCustomFields[removeIndex] - removeIndex, 1);
		}
	},
	
	Methods : {
		
		Version : {
			Name: "mc_version",
			BuildParams : function() {
				return new SOAPClientParameters();
			}
		},
		
		EnumStatus : {
			Name: "mc_enum_status",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			},
		},
		
		EnumPriority :{
			Name : "mc_enum_priorities",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},
		
		EnumResolutions : {
			Name : "mc_enum_resolutions",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},

		EnumSeverities : {
			Name : "mc_enum_severities",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},
		
		EnumGet :  {
			Name : "mc_enum_get",
			BuildParams : function(enumeration) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.Enumeration, enumeration);
				return pl;
			}
		},

		EnumAccessLevels : {
			Name : "mc_enum_access_levels",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		} ,

		Login : {
			Name: "mc_login",
			BuildParams : function(username, password) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, username);
				pl.add(Mantis.Params.Password, password);
				return pl;
			}
		},
		
		FilterGetIssues : {
			Name : "mc_filter_get_issues",
			BuildParams : function(projectid, filterid, pagenumber, perpage) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.ProjectID, projectid);
				pl.add(Mantis.Params.FilterID, filterid);
				pl.add(Mantis.Params.PageNumber, pagenumber);
				pl.add(Mantis.Params.PerPage, perpage);
				return pl;
			}
		},

		FilterGet : {

			Name: "mc_filter_get",
			BuildParams : function(projectid) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.ProjectID, projectid);
				return pl;
			}
		},
		
		ProjectGetCategories : {
		  Name : "mc_project_get_categories",
		  BuildParams : function(projectid) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.ProjectID, projectid);
				return pl;
		  }
		},

		ProjectGetUsers :  {
			Name : "mc_project_get_users",
			BuildParams : function(access) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.ProjectID, Mantis.CurrentProjectID);
				pl.add(Mantis.Params.Access, access);
				return pl;
			}
		},
		
		ProjectsGetUserAccessible : {
			Name: "mc_projects_get_user_accessible",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},
		
		ProjectGetIssues : {
			Name : "mc_project_get_issues",
			BuildParams : function(projectid, pagenumber, perpage) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.ProjectID, projectid);
				pl.add(Mantis.Params.PageNumber, pagenumber);
				pl.add(Mantis.Params.PerPage, perpage);
				return pl;
			}
		},

		ProjectGetCustomFields : {
			Name : "mc_project_get_custom_fields",
			BuildParams : function(projectid) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.ProjectID, projectid);
				return pl;
			}
		},
		
		IssueAdd : {
			Name : "mc_issue_add",
			BuildParams : function(issue) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.Issue, issue);
				return pl;
			}
			
		},

		TagAdd :  {
			Name : "mc_tag_add",
			BuildParams : function(tag) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.Tag, tag);
				return pl;
			}
		},

		IssueAttachmentAdd : {
			Name : "mc_issue_attachment_add",
			BuildParams : function(issueID, fileName, fileType, fileContent) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueID, issueID);
				pl.add(Mantis.Params.Name, fileName);
				pl.add(Mantis.Params.FileType, fileType);
				pl.add(Mantis.Params.Content, fileContent)
				return pl;
			}
		},

		IssueAttachmentDelete : {
			Name : "mc_issue_attachment_delete",
			BuildParams : function(issueAttachmentID) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueAttachmentID, issueAttachmentID);
				return pl;
			}
		},

		IssueSetTags : {
			Name : "mc_issue_set_tags",
			BuildParams : function(issueid, tagsDataArray) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueID, issueid);
				pl.add(Mantis.Params.Tags, tagsDataArray);
				return pl;
			}
		},

		TagGetAll :  {
			Name : "mc_tag_get_all",
			BuildParams : function(pageNumber, perPage) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.PageNumber, pageNumber);
				pl.add(Mantis.Params.PerPage, perPage);
				return pl;
			}
		},

		IssueDelete : {
			Name : "mc_issue_delete",
			BuildParams : function(issueid) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueID, issueid);
				return pl;
			}

		},
		
		IssueUpdate : {
			Name : "mc_issue_update",
			BuildParams : function(issueid, issue) {
				try {
					delete issue.notes;
					delete issue.last_updated;
					delete issue.due_date;
					delete issue.pl;
					delete issue.monitors;
					delete issue.sticky;

				} catch (e) { }

				Mantis.RemoveNullCustomFieldsFromIssue(issue);

				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueID_Caps, issueid);
				pl.add(Mantis.Params.Issue, issue);
				return pl;
			}
		},
		
		IssueNoteAdd : {
			Name : "mc_issue_note_add",
			BuildParams : function (issueid, noteobject) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueID, issueid);
				pl.add(Mantis.Params.Note, noteobject);
				return pl;
			}
		},
		
		IssueAttachmentGet : {
			Name : "mc_issue_attachment_get",
			BuildParams : function(issueattachmentid) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueAttachmentID, issueattachmentid);
				return pl;
			}

		},


		IssueGet : {
			Name : "mc_issue_get",
			BuildParams : function(issueid) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueID, issueid);
				return pl;
			}
		},

		IssueGetHistory : {
			Name : "mc_issue_get_history",
			BuildParams : function(issueid) {
				var pl = new SOAPClientParameters();
				pl.add(Mantis.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Mantis.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Mantis.Params.IssueID, issueid);
				return pl;				
			}
		}
		
	},
	
	UpdateStructureMethods : {
		Issue : {
			UpdateStatus : function(issue, statusid, statusname) {
				issue.status.name = statusname;
				issue.status.id = statusid;
				return issue;
			},
			
			UpdateCustomField : function(issue, fieldname, fieldvalue) {
				var fieldID = "";
				if(issue.custom_fields === undefined) {
					for(var fi = 0; fi < Mantis.ProjectCustomFields.length; fi++) {
						if(Mantis.ProjectCustomFields[fi].field.name == fieldname) {
							fieldID = Mantis.ProjectCustomFields[fi].field.id;
						}
					}
					
					issue["custom_fields"] = [{
						"field" : {
							"name" : fieldname,
							"id" : fieldID
						},
						"value" : fieldvalue
					}];
					
				} else {
					for(var counter in issue.custom_fields) {
						var customfield = issue.custom_fields[counter];
						if(customfield.field.name == fieldname) {
							customfield.value = fieldvalue;
						}
					}
				}

				Mantis.RemoveNullCustomFieldsFromIssue(issue);

				return issue;
			},
			
			NewIssue : function(summary, description, projectid, handlerid, reporterid, statusid, priorityid, category) {
				var newIssue = {
					"id" : "",
					"summary" : summary,
					"description" : description,
					"status" : { "id" : statusid },
					"project" : { "id" : projectid },
					"reporter" : { "id" : reporterid },
					"category" : category
				};
				
				if(priorityid !== undefined && priorityid !== null) newIssue["priority"] = { "id" : priorityid };
				if(handlerid !== undefined && handlerid !== null) {
					newIssue["handler"] = { "id" : handlerid };
				} else {
					newIssue["handler"] = { "id" : null };
				}
				return newIssue;   
			}
		},
		Tag :  {

			NewTag : function(name, description) {
				return  {"name":name, "description":description};
			}
		},

		Note : {
			NewNote : function(notetext) {
				return {
					"reporter" : {
						"id" : Kanban.CurrentUser.ID,
						"name" : Kanban.CurrentUser.Name
					},
					"date_submitted" : new Date(),
					"text" : notetext
				};
			}
		},
		Task :  {
			NewTask : function(taskstatus, taskdescription) {
				return {
					"Status" : taskstatus,
					"Description" : taskdescription
				};
			}
		}
	},

	FilterGet: function(ProjectID, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.FilterGet.Name, Mantis.Methods.FilterGet.BuildParams(ProjectID), hascallback, callBack);
	},
	
	FilterGetIssues : function(ProjectID, FilterID, PageNumber, PerPage, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.FilterGetIssues.Name, Mantis.Methods.FilterGetIssues.BuildParams(ProjectID, FilterID, PageNumber, PerPage), hascallback, callBack);
	},

	IssueAdd : function(Issue, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueAdd.Name, Mantis.Methods.IssueAdd.BuildParams(Issue), hascallback, callBack);
	},
	
	IssueGet : function(IssueID, callBack) {
		hascallback = callBack == null || callBack == undefined ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueGet.Name, Mantis.Methods.IssueGet.BuildParams(IssueID), hascallback, callBack);
	},

	IssueGetHistory : function(IssueID, callBack) {
		// <xsd:element name="date" type="xsd:integer"/>
		// <xsd:element name="userid" type="xsd:integer"/>
		// <xsd:element name="username" type="xsd:string"/>
		// <xsd:element name="field" type="xsd:string"/>
		// <xsd:element name="type" type="xsd:integer"/>
		// <xsd:element name="old_value" type="xsd:string"/>
		// <xsd:element name="new_value" type="xsd:string"

		hascallback = callBack == null || callBack == undefined ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueGetHistory.Name, Mantis.Methods.IssueGetHistory.BuildParams(IssueID), hascallback, callBack);
	},

	IssueAttachmentAdd : function(IssueID, FileName, FileType, FileContent, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  
			Mantis.Methods.IssueAttachmentAdd.Name, 
			Mantis.Methods.IssueAttachmentAdd.BuildParams(IssueID, FileName, FileType, FileContent), 
			hascallback, callBack);
	},
	IssueAttachmentDelete : function(IssueAttachmentID, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  
			Mantis.Methods.IssueAttachmentDelete.Name, 
			Mantis.Methods.IssueAttachmentDelete.BuildParams(IssueAttachmentID), 
			hascallback, callBack);

	},
	IssueAttachmentGet : function(IssueAttachmentID, ContentType, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueAttachmentGet.Name, Mantis.Methods.IssueAttachmentGet.BuildParams(IssueAttachmentID), hascallback, function(returnData) { callBack(returnData, IssueAttachmentID, ContentType); });
	},

	TagAdd : function(Tag, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL, Mantis.Methods.TagAdd.Name, Mantis.Methods.TagAdd.BuildParams(Tag), hascallback, callBack);
	},

	IssueNoteAdd : function(IssueID, Note, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueNoteAdd.Name, Mantis.Methods.IssueNoteAdd.BuildParams(IssueID, Note), hascallback, callBack);
	},

	IssueSetTags : function(IssueID, IssueTagsArray, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueSetTags.Name, Mantis.Methods.IssueSetTags.BuildParams(IssueID, IssueTagsArray), hascallback, callBack);
	},

	IssueDelete : function(IssueID, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueDelete.Name, Mantis.Methods.IssueDelete.BuildParams(IssueID), hascallback, callBack);
	},
	
	IssueUpdate : function(IssueID, Issue, callBack) {
		hascallback = callBack == null ? false : true;
		//var updateIssue = jQuery.extend(true, {}, Issue);
		//delete updateIssue.notes;
		
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.IssueUpdate.Name, Mantis.Methods.IssueUpdate.BuildParams(IssueID, Issue), hascallback, callBack);
	},

	TagGetAll : function(PageNumber, PerPage, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.TagGetAll.Name, Mantis.Methods.TagGetAll.BuildParams(PageNumber, PerPage), hascallback, callBack);

	},
// <message name="mc_tag_get_allRequest">
//   <part name="username" type="xsd:string" />
//   <part name="password" type="xsd:string" />
//   <part name="page_number" type="xsd:integer" />
//   <part name="per_page" type="xsd:integer" /></message>
// <message name="mc_tag_get_allResponse">
//   <part name="return" type="tns:TagDataSearchResult" /></message>
// <message name="mc_tag_addRequest">
//   <part name="username" type="xsd:string" />
//   <part name="password" type="xsd:string" />
//   <part name="tag" type="tns:TagData" /></message>
// <message name="mc_tag_addResponse">
//   <part name="return" type="xsd:integer" /></message>
// <message name="mc_tag_deleteRequest">
//   <part name="username" type="xsd:string" />
//   <part name="password" type="xsd:string" />
//   <part name="tag_id" type="xsd:integer" /></message>
// <message name="mc_tag_deleteResponse">
//   <part name="return" type="xsd:boolean" /></message>	

	Login : function(UserName, Password) {
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.Login.Name, Mantis.Methods.Login.BuildParams(UserName, Password), false, null);
	},
	
	ProjectGetCategories :  function(callBack){
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.ProjectGetCategories.Name, Mantis.Methods.ProjectGetCategories.BuildParams(Mantis.CurrentProjectID), hascallback, callBack);
	},
	
	ProjectGetIssues : function(ProjectID, PageNumber, PerPage, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.ProjectGetIssues.Name, Mantis.Methods.ProjectGetIssues.BuildParams(ProjectID, PageNumber, PerPage), hascallback, callBack);
	},

	/**
	* This function assumes that you want to enumerate the users on the current project
	* @param {int} Access           This is the access level that you want to filter the users by
	* @param {function} callBack    This is the callback method that will be called if its passed in.   If its null then it will by call synchronously
	* @returns {array}              Array of the users that were collected
	*/
	ProjectGetUsers : function(Access, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL, Mantis.Methods.ProjectGetUsers.Name, Mantis.Methods.ProjectGetUsers.BuildParams(Access), hascallback, callBack);
	},
	
	ProjectsGetUserAccessible :  function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL, Mantis.Methods.ProjectsGetUserAccessible.Name, Mantis.Methods.ProjectsGetUserAccessible.BuildParams(), hascallback, callBack);
	},

	ProjectGetCustomFields : function (ProjectID, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL, Mantis.Methods.ProjectGetCustomFields.Name, Mantis.Methods.ProjectGetCustomFields.BuildParams(ProjectID), hascallback, callBack);
	},
	
	EnumGet : function(Enumeration, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.EnumGet.Name, Mantis.Methods.EnumGet.BuildParams(Enumeration), hascallback, callBack);
	},

	EnumAccessLevels : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.EnumAccessLevels.Name, Mantis.Methods.EnumAccessLevels.BuildParams(), hascallback, callBack);
	},

	EnumResolutions : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.EnumResolutions.Name, Mantis.Methods.EnumResolutions.BuildParams(), hascallback, callBack);
	},
	
	EnumSeverities : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.EnumSeverities.Name, Mantis.Methods.EnumSeverities.BuildParams(), hascallback, callBack);
	},
	
	EnumPriority : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.EnumPriority.Name, Mantis.Methods.EnumPriority.BuildParams(), hascallback, callBack);
	},
	
	EnumStatus : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.EnumStatus.Name, Mantis.Methods.EnumStatus.BuildParams(), hascallback, callBack);
	},
	
	Version : function(callBack) {
		

		hascallback = callBack == null ? false : true;

		if(Mantis._version != null && !hascallback) return Mantis._version;
		Mantis._version = SOAPClient.invoke(Mantis.ConnectURL,  Mantis.Methods.Version.Name, Mantis.Methods.Version.BuildParams(), hascallback, callBack);
		return Mantis._version;
	}    
}
/*
 *<xsd:element name="id" type="xsd:integer" minOccurs="0"/>
 *<xsd:element name="view_state" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="last_updated" type="xsd:dateTime" minOccurs="0"/>
 *<xsd:element name="project" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="category" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="priority" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="severity" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="status" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="reporter" type="tns:AccountData" minOccurs="0"/>
 *<xsd:element name="summary" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="version" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="build" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="platform" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="os" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="os_build" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="reproducibility" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="date_submitted" type="xsd:dateTime" minOccurs="0"/>
 *<xsd:element name="sponsorship_total" type="xsd:integer" minOccurs="0"/>
 *<xsd:element name="handler" type="tns:AccountData" minOccurs="0"/>
 *<xsd:element name="projection" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="eta" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="resolution" type="tns:ObjectRef" minOccurs="0"/>
 *<xsd:element name="fixed_in_version" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="target_version" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="description" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="steps_to_reproduce" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="additional_information" type="xsd:string" minOccurs="0"/>
 *<xsd:element name="attachments" type="tns:AttachmentDataArray" minOccurs="0"/>
 *<xsd:element name="relationships" type="tns:RelationshipDataArray" minOccurs="0"/>
 *<xsd:element name="notes" type="tns:IssueNoteDataArray" minOccurs="0"/>
 *<xsd:element name="custom_fields" type="tns:CustomFieldValueForIssueDataArray" minOccurs="0"/>
 *<xsd:element name="due_date" type="xsd:dateTime" minOccurs="0"/>
 *<xsd:element name="monitors" type="tns:AccountDataArray" minOccurs="0"/>
 *<xsd:element name="sticky" type="xsd:boolean" minOccurs="0"/>
 *<xsd:element name="tags" type="tns:ObjectRefArray" minOccurs="0"/>
 **/