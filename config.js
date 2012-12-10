/// Point to the location of your server
Mantis.ConnectURL = "http://example.com/api/soap/mantisconnect.php";

/// The default filter to use when loading a projects issues
/// If you leave this null, mantis will load whatever the last filter you used when you logged into the php site.
Mantis.DefaultFilterID = "22";

/// Use this value if you want to load additional closed issue.   A good use for this is to load open issues 
/// with DefaultFilterID, and load certain number of recently closed issues with these parameters.
Mantis.ClosedIssuesFilterID = "23";

/// How many issues should the call to the ClosedIssueFilterID return
Kanban.NumberOfClosedMessagesToLoad = 15;
