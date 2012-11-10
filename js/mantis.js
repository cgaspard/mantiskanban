var mantisConnectURL = "http://bugz.mygait.net/api/soap/mantisconnect.php";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var Mantis = {
    _currentprojectid : 0,
    _projectcategories : [],
    _statues : null,
    _severities : null,
    _projectusers : [],
    _projectcustomfields : [],
    _accesslevels : [],
    _userprojects : [],
    _defaultaccesslevelforuserenum : 10,
    _defaultfilterid : "22",
    _closedissuesfilterid : "23",
    
    ClearForLogout : function() {
        Mantis._currentprojectid = 0;
        Mantis._projectcategories = [];
        Mantis._statues = null;
        Mantis._severities = null;
        Mantis._priorities = [];
        Mantis._projectusers = [];
        Mantis._projectcustomfields = [];
        Mantis._accesslevels = [];
        Mantis._userprojects = [];
        Mantis._defaultaccesslevelforuserenum = 10;
    },
    
    CurrentUser : {
        UserName : "",
        Password : "",
        get MantisUser() {
            for(var i = 0; i < Mantis.ProjectUsers.length; i++) {
                if(Mantis.ProjectUsers[i].name == Mantis.CurrentUser.UserName) {
                    return Mantis.ProjectUsers[i];
                }
            }
            return null;
        }
    },
    
    get DefaultFilterID() {
        return Mantis._defaultfilterid;  
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

    get  Serverities() {
        if(Mantis._severities == null) {
            Mantis._severities = Mantis.EnumServerities(Mantis.CurrentUser.UserName, Mantis.CurrentUser.Password, null);
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

    Params : {
        Access : "access",
        Enumeration: "enumeration",
        FilterID : "filter_id",
        IssueID : "issue_id",
        Issue : "issue",
        Note : "note",
        Password : "password",
        PageNumber : "page_number",
        PerPage : "per_page",
        ProjectID : "project_id",
        UserName : "username"
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
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            },
        },
        
        EnumPriority :{
            Name : "mc_enum_priorities",
            BuildParams : function() {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            }
        },
        
        EnumServerities : {
            Name : "mc_enum_severities",
            BuildParams : function() {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            }
        },
        
        EnumGet :  {
            Name : "mc_enum_get",
            BuildParams : function(enumeration) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.Enumeration, enumeration);
                return pl;
            }
        },

        EnumAccessLevels : {
            Name : "mc_enum_access_levels",
            BuildParams : function() {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            }
        } ,
        
        FilterGetIssues : {
            Name : "mc_filter_get_issues",
            BuildParams : function(projectid, filterid, pagenumber, perpage) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.ProjectID, projectid);
                pl.add(Mantis.Params.FilterID, filterid);
                pl.add(Mantis.Params.PageNumber, pagenumber);
                pl.add(Mantis.Params.PerPage, perpage);
                return pl;
            }
        },
        
        ProjectGetCategories : {
          Name : "mc_project_get_categories",
          BuildParams : function(projectid) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.ProjectID, projectid);
                return pl;
          }
        },

        ProjectGetUsers :  {
            Name : "mc_project_get_users",
            BuildParams : function(access) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.ProjectID, Mantis.CurrentProjectID);
                pl.add(Mantis.Params.Access, access);
                return pl;
            }
        },
        
        ProjectsGetUserAccessible : {
            Name: "mc_projects_get_user_accessible",
            BuildParams : function() {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            }
        },
        
        ProjectGetIssues : {
            Name : "mc_project_get_issues",
            BuildParams : function(projectid, pagenumber, perpage) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
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
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.ProjectID, projectid);
                return pl;
            }
        },
        
        IssueAdd : {
            Name : "mc_issue_add",
            BuildParams : function(issue) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.Issue, issue);
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
                } catch (e) { }
                //delete issue.due_date;
                //delete issue.monitors;
                
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.IssueID, issueid);
                pl.add(Mantis.Params.Issue, issue);
                return pl;
            }
        },
        
        IssueNoteAdd : {
            Name : "mc_issue_note_add",
            BuildParams : function (issueid, noteobject) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.IssueID, issueid);
                pl.add(Mantis.Params.Note, noteobject);
                return pl;
            }
        },
        
        IssueGet : {
            Name : "mc_issue_get",
            BuildParams : function(issueid) {
                var pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
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
                return issue;
            },
            
            NewIssue : function(summary, description, projectid, handlerid, statusid, priorityid, category) {
                var newIssue = {
                    "id" : "",
                    "summary" : summary,
                    "description" : description,
                    "status" : { "id" : statusid },
                    "project" : { "id" : projectid },
                    "reporter" : { "id" : Mantis.CurrentUser.MantisUser.id },
                    "category" : category
                };
                
                if(priorityid !== undefined && priorityid !== null) newIssue["priority"] = { "id" : priorityid };
                if(handlerid !== undefined && handlerid !== null) newIssue["handler"] = { "id" : handlerid };
                return newIssue;   
            }
        },
        Note : {
            NewNote : function(notetext) {
                return {
                    "reporter" : {
                        "id" : Mantis.CurrentUser.MantisUser.id,
                        "name" : Mantis.CurrentUser.MantisUser.name
                    },
                    "date_submitted" : new Date(),
                    "text" : notetext
                };
            }
        }
    },
    
    FilterGetIssues : function(ProjectID, FilterID, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.FilterGetIssues.Name, Mantis.Methods.FilterGetIssues.BuildParams(ProjectID, FilterID, 0, 0), hascallback, callBack);
    },

    IssueAdd : function(Issue, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.IssueAdd.Name, Mantis.Methods.IssueAdd.BuildParams(Issue), hascallback, callBack);
    },
    
    IssueGet : function(IssueID, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.IssueGet.Name, Mantis.Methods.IssueGet.BuildParams(IssueID), hascallback, callBack);
    },
    
    IssueNoteAdd : function(IssueID, Note, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.IssueNoteAdd.Name, Mantis.Methods.IssueNoteAdd.BuildParams(IssueID, Note), hascallback, callBack);
    },
    
    IssueUpdate : function(IssueID, Issue, callBack) {
        hascallback = callBack == null ? false : true;
        //var updateIssue = jQuery.extend(true, {}, Issue);
        //delete updateIssue.notes;
        
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.IssueUpdate.Name, Mantis.Methods.IssueUpdate.BuildParams(IssueID, Issue), hascallback, callBack);
    },
    
    ProjectGetCategories :  function(callBack){
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.ProjectGetCategories.Name, Mantis.Methods.ProjectGetCategories.BuildParams(Mantis.CurrentProjectID), hascallback, callBack);
    },
    
    ProjectGetIssues : function(ProjectID, PageNumber, PerPage, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.ProjectGetIssues.Name, Mantis.Methods.ProjectGetIssues.BuildParams(ProjectID, PageNumber, PerPage), hascallback, callBack);
    },

    /**
    * This function assumes that you want to enumerate the users on the current project
    * @param {int} Access           This is the access level that you want to filter the users by
    * @param {function} callBack    This is the callback method that will be called if its passed in.   If its null then it will by call synchronously
    * @returns {array}              Array of the users that were collected
    */
    ProjectGetUsers : function(Access, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL, Mantis.Methods.ProjectGetUsers.Name, Mantis.Methods.ProjectGetUsers.BuildParams(Access), hascallback, callBack);
    },
    
    ProjectsGetUserAccessible :  function(callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL, Mantis.Methods.ProjectsGetUserAccessible.Name, Mantis.Methods.ProjectsGetUserAccessible.BuildParams(), hascallback, callBack);
    },

    ProjectGetCustomFields : function (ProjectID, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL, Mantis.Methods.ProjectGetCustomFields.Name, Mantis.Methods.ProjectGetCustomFields.BuildParams(ProjectID), hascallback, callBack);
    },
    
    EnumGet : function(Enumeration, callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumGet.Name, Mantis.Methods.EnumGet.BuildParams(Enumeration), hascallback, callBack);
    },

    EnumAccessLevels : function(callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumAccessLevels.Name, Mantis.Methods.EnumAccessLevels.BuildParams(), hascallback, callBack);
    },
    
    EnumServerities : function(callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumServerities.Name, Mantis.Methods.EnumServerities.BuildParams(), hascallback, callBack);
    },
    
    EnumPriority : function(callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumPriority.Name, Mantis.Methods.EnumPriority.BuildParams(), hascallback, callBack);
    },
    
    EnumStatus : function(callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumStatus.Name, Mantis.Methods.EnumStatus.BuildParams(), hascallback, callBack);
    },
    
    Version : function(callBack) {
        hascallback = callBack == null ? false : true;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.Version.Name, Mantis.Methods.Version.BuildParams(), hascallback, callBack);
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