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
		Kanban._currentprojectid = 0;
		Kanban._currentprojectname = "";
		Kanban._projectcategories = [];
		Kanban._statues = null;
		Kanban._resolutions = null;
		Kanban._severities = null;
		Kanban._priorities = null;
		Kanban._projectusers = [];
		Kanban._projectcustomfields = [];
		Kanban._accesslevels = [];
		Kanban._userprojects = [];
		Kanban._defaultaccesslevelforuserenum = 10;
		Kanban._tags = [];
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
		Kanban.LoadTagsAsync();
		Kanban.LoadSeveritiesAsync();
		Kanban.LoadResolutionsAsync();
	},	
	
	set DefaultFilterID(value) {
		Kanban._defaultfilterid = value;
	},
 
	get DefaultFilterID() {
		return Kanban._defaultfilterid;  
	},
	
	set ClosedIssuesFilterID(value) {
		Kanban._closedissuesfilterid = value;
    },
    
	get ClosedIssuesFilterID() {
		return Kanban._closedissuesfilterid;  
	},
	
	get UserProjects() {
		if(Kanban._userprojects.length == 0) {
			Kanban._userprojects = Kanban.ProjectsGetUserAccessible();
		}
		return Kanban._userprojects;
	},

	get AccessLevels() {
		if(Kanban._accesslevels.length == 0) {
			Kanban._accesslevels = Kanban.EnumAccessLevels();
		}
		return Kanban._accesslevels;
	},

	get Priorities () {
		if(Kanban._priorities == null) {
			Kanban._priorities = Kanban.EnumPriority();
		}
		return Kanban._priorities;
	},
	
	get Statuses() {
		if(Kanban._statues == null) {
			Kanban._statues = Kanban.EnumStatus(null);  
		}
		
		return Kanban._statues;
	},

	get Tags() {
		if(Kanban._tags == null || Kanban._tags.length == 0) {
			Kanban._tags = Kanban.TagGetAll(0,9999);
		}
		return Kanban._tags;
	},

	LoadTagsAsync : function() {
		Kanban.TagGetAll(0,9999, function(retObj) {
			Kanban._tags = retObj.results;
		});
	},

	LoadResolutionsAsync : function() {
		Kanban.EnumResolutions(function(retObject) {
			Kanban._resolutions = retObject;
		});
	},

	LoadSeveritiesAsync : function() {
		Kanban.EnumSeverities(function(retObject) {
			Kanban._severities = retObject;
		});
	},

	LoadTagsSync : function() {
		Kanban._tags = Kanban.TagGetAll(0,9999).results;
	},
	
	get ProjectCategories() {
		if(Kanban._projectcategories.length == 0) {
			Kanban._projectcategories = Kanban.ProjectGetCategories();
		}
	  return Kanban._projectcategories;  
	},
	
	get ProjectUsers() {
		if(Kanban._projectusers.length == 0) {
			Kanban._projectusers = Kanban.ProjectGetUsers(Kanban._defaultaccesslevelforuserenum);
		}
		return Kanban._projectusers;
	},

	get ProjectCustomFields() {
		if(Kanban._projectcustomfields.length == 0) {
			Kanban._projectcustomfields = Kanban.ProjectGetCustomFields(Kanban.CurrentProjectID);
		}
		return Kanban._projectcustomfields;
	},

	get  Resolutions() {
		if(Kanban._resolutions == null) {
			Kanban._resolutions = Kanban.EnumResolutions();
		}
		return Kanban._resolutions;
	},

	get  Severities() {
		if(Kanban._severities == null) {
			Kanban._severities = Kanban.EnumSeverities();
		}
		return Kanban._severities;
	},
	
	get CurrentProjectID() {
		return Kanban._currentprojectid;
	},
	
	set CurrentProjectID(value) {

		if(Kanban._currentprojectid != value) {
			///Clear the project specific stuff
			Kanban._projectusers = [];
			Kanban._projectcustomfields = [];
			Kanban._projectcategories = [];
		}

		Kanban._currentprojectid = value;
	},

	get CurrentProjectName() {
		return Kanban._currentprojectname;
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
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			},
		},
		
		EnumPriority :{
			Name : "mc_enum_priorities",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},
		
		EnumResolutions : {
			Name : "mc_enum_resolutions",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},

		EnumSeverities : {
			Name : "mc_enum_severities",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},
		
		EnumGet :  {
			Name : "mc_enum_get",
			BuildParams : function(enumeration) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.Enumeration, enumeration);
				return pl;
			}
		},

		EnumAccessLevels : {
			Name : "mc_enum_access_levels",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		} ,

		Login : {
			Name: "mc_login",
			BuildParams : function(username, password) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, username);
				pl.add(Kanban.Params.Password, password);
				return pl;
			}
		},
		
		FilterGetIssues : {
			Name : "mc_filter_get_issues",
			BuildParams : function(projectid, filterid, pagenumber, perpage) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.ProjectID, projectid);
				pl.add(Kanban.Params.FilterID, filterid);
				pl.add(Kanban.Params.PageNumber, pagenumber);
				pl.add(Kanban.Params.PerPage, perpage);
				return pl;
			}
		},

		FilterGet : {

			Name: "mc_filter_get",
			BuildParams : function(projectid) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.ProjectID, projectid);
				return pl;
			}
		},
		
		ProjectGetCategories : {
		  Name : "mc_project_get_categories",
		  BuildParams : function(projectid) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.ProjectID, projectid);
				return pl;
		  }
		},

		ProjectGetUsers :  {
			Name : "mc_project_get_users",
			BuildParams : function(access) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.ProjectID, Kanban.CurrentProjectID);
				pl.add(Kanban.Params.Access, access);
				return pl;
			}
		},
		
		ProjectsGetUserAccessible : {
			Name: "mc_projects_get_user_accessible",
			BuildParams : function() {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				return pl;
			}
		},
		
		ProjectGetIssues : {
			Name : "mc_project_get_issues",
			BuildParams : function(projectid, pagenumber, perpage) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.ProjectID, projectid);
				pl.add(Kanban.Params.PageNumber, pagenumber);
				pl.add(Kanban.Params.PerPage, perpage);
				return pl;
			}
		},

		ProjectGetCustomFields : {
			Name : "mc_project_get_custom_fields",
			BuildParams : function(projectid) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.ProjectID, projectid);
				return pl;
			}
		},
		
		IssueAdd : {
			Name : "mc_issue_add",
			BuildParams : function(issue) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.Issue, issue);
				return pl;
			}
			
		},

		TagAdd :  {
			Name : "mc_tag_add",
			BuildParams : function(tag) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.Tag, tag);
				return pl;
			}
		},

		IssueAttachmentAdd : {
			Name : "mc_issue_attachment_add",
			BuildParams : function(issueID, fileName, fileType, fileContent) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueID, issueID);
				pl.add(Kanban.Params.Name, fileName);
				pl.add(Kanban.Params.FileType, fileType);
				pl.add(Kanban.Params.Content, fileContent)
				return pl;
			}
		},

		IssueAttachmentDelete : {
			Name : "mc_issue_attachment_delete",
			BuildParams : function(issueAttachmentID) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueAttachmentID, issueAttachmentID);
				return pl;
			}
		},

		IssueSetTags : {
			Name : "mc_issue_set_tags",
			BuildParams : function(issueid, tagsDataArray) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueID, issueid);
				pl.add(Kanban.Params.Tags, tagsDataArray);
				return pl;
			}
		},

		TagGetAll :  {
			Name : "mc_tag_get_all",
			BuildParams : function(pageNumber, perPage) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.PageNumber, pageNumber);
				pl.add(Kanban.Params.PerPage, perPage);
				return pl;
			}
		},

		IssueDelete : {
			Name : "mc_issue_delete",
			BuildParams : function(issueid) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueID, issueid);
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

				Kanban.RemoveNullCustomFieldsFromIssue(issue);

				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueID_Caps, issueid);
				pl.add(Kanban.Params.Issue, issue);
				return pl;
			}
		},
		
		IssueNoteAdd : {
			Name : "mc_issue_note_add",
			BuildParams : function (issueid, noteobject) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueID, issueid);
				pl.add(Kanban.Params.Note, noteobject);
				return pl;
			}
		},
		
		IssueAttachmentGet : {
			Name : "mc_issue_attachment_get",
			BuildParams : function(issueattachmentid) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueAttachmentID, issueattachmentid);
				return pl;
			}

		},


		IssueGet : {
			Name : "mc_issue_get",
			BuildParams : function(issueid) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueID, issueid);
				return pl;
			}
		},

		IssueGetHistory : {
			Name : "mc_issue_get_history",
			BuildParams : function(issueid) {
				var pl = new SOAPClientParameters();
				pl.add(Kanban.Params.UserName, Kanban.CurrentUser.UserName);
				pl.add(Kanban.Params.Password, Kanban.CurrentUser.Password);
				pl.add(Kanban.Params.IssueID, issueid);
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
					for(var fi = 0; fi < Kanban.ProjectCustomFields.length; fi++) {
						if(Kanban.ProjectCustomFields[fi].field.name == fieldname) {
							fieldID = Kanban.ProjectCustomFields[fi].field.id;
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

				Kanban.RemoveNullCustomFieldsFromIssue(issue);

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
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.FilterGet.Name, Kanban.Methods.FilterGet.BuildParams(ProjectID), hascallback, callBack);
	},
	
	FilterGetIssues : function(ProjectID, FilterID, PageNumber, PerPage, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.FilterGetIssues.Name, Kanban.Methods.FilterGetIssues.BuildParams(ProjectID, FilterID, PageNumber, PerPage), hascallback, callBack);
	},

	IssueAdd : function(Issue, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueAdd.Name, Kanban.Methods.IssueAdd.BuildParams(Issue), hascallback, callBack);
	},
	
	IssueGet : function(IssueID, callBack) {
		hascallback = callBack == null || callBack == undefined ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueGet.Name, Kanban.Methods.IssueGet.BuildParams(IssueID), hascallback, callBack);
	},

	IssueGetHistory : function(IssueID, callBack) {
		hascallback = callBack == null || callBack == undefined ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueGetHistory.Name, Kanban.Methods.IssueGetHistory.BuildParams(IssueID), hascallback, callBack);
	},

	IssueAttachmentAdd : function(IssueID, FileName, FileType, FileContent, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  
			Kanban.Methods.IssueAttachmentAdd.Name, 
			Kanban.Methods.IssueAttachmentAdd.BuildParams(IssueID, FileName, FileType, FileContent), 
			hascallback, callBack);
    },
    
	IssueAttachmentDelete : function(IssueAttachmentID, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  
			Kanban.Methods.IssueAttachmentDelete.Name, 
			Kanban.Methods.IssueAttachmentDelete.BuildParams(IssueAttachmentID), 
			hascallback, callBack);

    
        },
    
        IssueAttachmentGet : function(IssueAttachmentID, ContentType, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueAttachmentGet.Name, Kanban.Methods.IssueAttachmentGet.BuildParams(IssueAttachmentID), hascallback, function(returnData) { callBack(returnData, IssueAttachmentID, ContentType); });
	},

	TagAdd : function(Tag, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL, Kanban.Methods.TagAdd.Name, Kanban.Methods.TagAdd.BuildParams(Tag), hascallback, callBack);
	},

	IssueNoteAdd : function(IssueID, Note, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueNoteAdd.Name, Kanban.Methods.IssueNoteAdd.BuildParams(IssueID, Note), hascallback, callBack);
	},

	IssueSetTags : function(IssueID, IssueTagsArray, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueSetTags.Name, Kanban.Methods.IssueSetTags.BuildParams(IssueID, IssueTagsArray), hascallback, callBack);
	},

	IssueDelete : function(IssueID, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueDelete.Name, Kanban.Methods.IssueDelete.BuildParams(IssueID), hascallback, callBack);
	},
	
	IssueUpdate : function(IssueID, Issue, callBack) {
		hascallback = callBack == null ? false : true;
		
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.IssueUpdate.Name, Kanban.Methods.IssueUpdate.BuildParams(IssueID, Issue), hascallback, callBack);
	},

	TagGetAll : function(PageNumber, PerPage, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.TagGetAll.Name, Kanban.Methods.TagGetAll.BuildParams(PageNumber, PerPage), hascallback, callBack);

	},	

	Login : function(UserName, Password) {
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.Login.Name, Kanban.Methods.Login.BuildParams(UserName, Password), false, null);
	},
	
	ProjectGetCategories :  function(callBack){
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.ProjectGetCategories.Name, Kanban.Methods.ProjectGetCategories.BuildParams(Kanban.CurrentProjectID), hascallback, callBack);
	},
	
	ProjectGetIssues : function(ProjectID, PageNumber, PerPage, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.ProjectGetIssues.Name, Kanban.Methods.ProjectGetIssues.BuildParams(ProjectID, PageNumber, PerPage), hascallback, callBack);
	},

	ProjectGetUsers : function(Access, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL, Kanban.Methods.ProjectGetUsers.Name, Kanban.Methods.ProjectGetUsers.BuildParams(Access), hascallback, callBack);
	},
	
	ProjectsGetUserAccessible :  function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL, Kanban.Methods.ProjectsGetUserAccessible.Name, Kanban.Methods.ProjectsGetUserAccessible.BuildParams(), hascallback, callBack);
	},

	ProjectGetCustomFields : function (ProjectID, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL, Kanban.Methods.ProjectGetCustomFields.Name, Kanban.Methods.ProjectGetCustomFields.BuildParams(ProjectID), hascallback, callBack);
	},
	
	EnumGet : function(Enumeration, callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.EnumGet.Name, Kanban.Methods.EnumGet.BuildParams(Enumeration), hascallback, callBack);
	},

	EnumAccessLevels : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.EnumAccessLevels.Name, Kanban.Methods.EnumAccessLevels.BuildParams(), hascallback, callBack);
	},

	EnumResolutions : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.EnumResolutions.Name, Kanban.Methods.EnumResolutions.BuildParams(), hascallback, callBack);
	},
	
	EnumSeverities : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.EnumSeverities.Name, Kanban.Methods.EnumSeverities.BuildParams(), hascallback, callBack);
	},
	
	EnumPriority : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.EnumPriority.Name, Kanban.Methods.EnumPriority.BuildParams(), hascallback, callBack);
	},
	
	EnumStatus : function(callBack) {
		hascallback = callBack == null ? false : true;
		return SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.EnumStatus.Name, Kanban.Methods.EnumStatus.BuildParams(), hascallback, callBack);
	},
	
	Version : function(callBack) {
		

		hascallback = callBack == null ? false : true;

		if(Kanban._version != null && !hascallback) return Kanban._version;
		Kanban._version = SOAPClient.invoke(Kanban.ConnectURL,  Kanban.Methods.Version.Name, Kanban.Methods.Version.BuildParams(), hascallback, callBack);
		return Kanban._version;
	}    
}
