var mantisConnectURL = "http://bugz.mygait.net/api/soap/mantisconnect.php";
var mantisUsername = "corey.gaspard";
var mantisPassword = "rbg76cjg";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var Mantis = {
    
    _statues : null,
    _severities : null,
    
    CurrentUser : {
        UserName : "",
        Password : ""
    },

    get Statuses() {
        if(_statues == null) {
            Mantis._statues = Mantis.EnumStatus(Mantis.CurrentUser.UserName, Mantis.CurrentUser.Password, null);  
        }
        
        return Mantis._statues;
    },
    
    get  Serverities() {
        if(Mantis._severities == null) {
            Mantis._severities = Mantis.EnumServerities(Mantis.CurrentUser.UserName, Mantis.CurrentUser.Password, null);
        }
        
        return Mantis._severities;
    },
    
    CurrentProjectID : 0,

    Params : {
        Access : "access",
        UserName : "username",
        Password : "password",
        Enumeration: "enumeration",
        ProjectID : "project_id",
        PageNumber : "page_number",
        PerPage : "per_page",
        IssueID : "issueId",
        Issue : "issue"
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
                pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            },
        },
        
        EnumPriority :{
            Name : "mc_enum_priorities",
            BuildParams : function() {
                pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            }
        },
        
        EnumServerities : {
            Name : "mc_enum_severities",
            BuildParams : function() {
                pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            }
        },
        
        EnumGet :  {
            Name : "mc_enum_get",
            BuildParams : function(enumeration) {
                pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.Enumeration, enumeration);
                return pl;
            }
        },

        ProjectGetUsers :  {
            Name : "mc_project_get_users",
            BuildParams : function(access) {
                pl = new SOAPClientParameters();
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
                pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                return pl;
            }
        },
        
        ProjectGetIssues : {
            Name : "mc_project_get_issues",
            BuildParams : function(projectid, pagenumber, perpage) {
                pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.ProjectID, projectid);
                pl.add(Mantis.Params.PageNumber, pagenumber);
                pl.add(Mantis.Params.PerPage, perpage);
                return pl;
            }
        },
        
        IssueUpdate : {
            Name : "mc_issue_update",
            BuildParams : function(issueid, issue) {
                pl = new SOAPClientParameters();
                pl.add(Mantis.Params.UserName, Mantis.CurrentUser.UserName);
                pl.add(Mantis.Params.Password, Mantis.CurrentUser.Password);
                pl.add(Mantis.Params.IssueID, issueid);
                pl.add(Mantis.Params.Issue, issue);
                return pl;
            }
        }
    },
    
    ProjectGetIssues : function(ProjectID, PageNumber, PerPage, callBack) {
        hascallback = callBack == null ? true : false;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.ProjectGetIssues.Name, Mantis.Methods.ProjectGetIssues.BuildParams(ProjectID, PageNumber, PerPage), hascallback, callBack);
    },
    
    ProjectsGetUserAccessible :  function(callBack) {
        hascallback = callBack == null ? true : false;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.ProjectsGetUserAccessible.Name, Mantis.Methods.ProjectsGetUserAccessible.BuildParams(), hascallback, callBack);
    },
    
    EnumGet : function(Enumeration, callBack) {
        hascallback = callBack == null ? true : false;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumGet.Name, Mantis.Methods.EnumGet.BuildParams(Enumeration), hascallback, callBack);
    },
    
    EnumServerities : function(callBack) {
        hascallback = callBack == null ? true : false;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumServerities.Name, Mantis.Methods.EnumServerities.BuildParams(), hascallback, callBack);
    },
    
    EnumPriority : function(callBack) {
        hascallback = callBack == null ? true : false;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumPriority.Name, Mantis.Methods.EnumPriority.BuildParams(), hascallback, callBack);
    },
    
    EnumStatus : function(callBack) {
        hascallback = callBack == null ? true : false;
        return SOAPClient.invoke(mantisConnectURL,  Mantis.Methods.EnumStatus.Name, Mantis.Methods.EnumStatus.BuildParams(), hascallback, callBack);
    },
    
    Version : function(callBack) {
        hascallback = callBack == null ? true : false;
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