mantiskanban
============

Mantis Kanban that uses ajax and mantisconnect

NEW!!! Live Demo http://mantiskanban.com/mantisbt/mantiskanban/

NEW FEATURES!!! 

You can now link directly to projects an issues in the kanban. 

Link to an issue like this: http://mantiskanban.com/mantisbt/mantiskanban/index.html?issue=22

Link to a project like this: Link to an issue like this: http://mantiskanban.com/mantisbt/mantiskanban/index.html?project=2

![Alt text](https://raw.github.com/cgaspard/mantiskanban/master/images/mantis_logo.png "Logo")

Requires Mantis vs 1.2.15 or greater.

JS Configuration: config.js

        /// Point to the location of your server... should be in the same domain as the mantis server
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
                "Sprint" : "30", // Acknowledged
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
            autoResizeColumns: true,
            currentProject:Mantis.CurrentProjectSelection
        };


Mantis Configuration:

  Scrum Buckets:
  
    If you want to define custom buckets, then in mantis go to Manage > ManageCustomFields.
  
    Then add a field called "ScrumBucket" of type "List" with whatever possible values you want.  Be sure to seperate the
    value with "|" like this: Backlog|Sprint|Current|Design|CodeComplete|Testing|Release
    
    Next you need to associate the custom field with whatever project you want to have it show up on.

  Default Filter:

    You need to setup a filter for project issues.   If you don't, then Mantis will deliver all issues.   When you
    have closed many issues, you will notice the speed greatly decreases.

  Screenshots:

Full Screen:
![Alt text](https://raw.github.com/cgaspard/mantiskanban/master/screenshots/screen1.png "Optional title")

Edit Story:
![Alt text](https://raw.github.com/cgaspard/mantiskanban/master/screenshots/screen2.png "Optional title")

Custom Scrum Buckets:
![Alt text](https://raw.github.com/cgaspard/mantiskanban/master/screenshots/screen3.png "Optional title")

Mantis Statuses as Buckets:
![Alt text](https://raw.github.com/cgaspard/mantiskanban/master/screenshots/screen4.png "Optional title")
