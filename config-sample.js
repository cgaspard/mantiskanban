/// Point to the location of your server
Mantis.ConnectURL = "http://bserver/api/soap/mantisconnect.php";

/// The default filter to use when loading a projects issues
/// If you leave this null, mantis will load whatever the last filter you used when you logged into the php site.
Mantis.DefaultFilterID = "0";

/// Use this value if you want to load additional closed issues, in addition to all the other statuses.   A good use for this is to load open issues 
/// with DefaultFilterID, and load certain number of recently closed issues with these parameters.
Mantis.ClosedIssuesFilterID = "0";

/// How many issues should the call to the ClosedIssueFilterID return
Kanban.NumberOfClosedMessagesToLoad = 10;

/// This is the default project to be selected
Mantis.CurrentProjectSelection = "0";

/// When a project has a custom field, you can specify mantis statuses to change to when entering this bucket
Kanban.AutoStatusOnCustomField = {
	"ScrumBucket" : {
		"Backlog" : "10", // New
		"Sprint" : "30", //	Acknowledged
		"Current" : "50", // Assigned
		"Complete" : "80", // Resolved
		"Testing" : "80",
		"Tested" : "80",
		"Release" : "90" // Closed
	}
}

/// Use this to set default icons for cateogories
Kanban.CategoryIconMap =  {
	"Bug" : "info-sign",
	"Task" : "calendar",
	"Feature" : "star"
}


/// This is used to just define the Default Settings object, this info gets saved to local storage for next login
var DefaultSettings = {
	username:"",
	stayLoggedIn:1,
	lastAccessTime:0,
	currentProject:Mantis.CurrentProjectSelection
};

