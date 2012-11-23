mantiskanban
============

Mantis Kanban that uses ajax and mantisconnect

![Alt text](https://raw.github.com/cgaspard/mantiskanban/master/images/mantis_logo.png "Logo")

JS Configuration:

  Modify mantisConnectURL variable in js/mantis.js -  This should point to the mantisconnect.php page on your server
  Modify _defaultfilterid variable in js/mantis.js -  Set this to the ID of the mantis filter that you want to use by default

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
