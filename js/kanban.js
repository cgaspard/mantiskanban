

var Kanban = {

    _listIDField : "ScrumBucket",

    get Container() {
        return document.getElementById("kanbancontent");
    },
    
    Lists : [],
    
    Stories : [],

    GetStoryByFieldValue : function(field, value) {
        for(var i = 0; i < Kanban.Stories.length; i++) {
            if(Kanban.Stories[i][field] == value) return Kanban.Stories[i];
        }
    },

    
    AddStory : function(storyToAdd) {
      Kanban.Stories[Kanban.Stories.length] = storyToAdd;  
    },
    
    AddList : function(listToAdd) {
        Kanban.Lists[Kanban.Lists.length] = listToAdd;
    },
    
    ClearListGUI : function() {
        while(Kanban.Container.childNodes.length != 0) {
            Kanban.Container.removeChild(Kanban.Container.firstChild);
        }
     },

     BuildProjectsGUI : function() {


     },
    
    BuildListGUI : function() {
        for(var li = 0; li < Kanban.Lists.length; li++) {
            var kanbanListItem = Kanban.Lists[li];
            
            ///The main container
            var listDiv = document.createElement("div");
            listDiv.setAttribute("class", "kanbanlist");
            listDiv.setAttribute("id", "listid" + kanbanListItem.ID);
            listDiv.addEventListener('dragover', HandleDragOver, false);
            listDiv.addEventListener("drop", Drop, false);
            listDiv.List = kanbanListItem;
            
            ///The title container
            var listDivTitle = document.createElement("div");
            listDivTitle.setAttribute("class", "kanbanlisttitle");
            listDivTitle.innerHTML = kanbanListItem.Name.capitalize();
            listDiv.appendChild(listDivTitle);
            
            for(var si = 0; si < kanbanListItem.Stories.length; si++) {

                var thisStory = kanbanListItem.Stories[si];

                var storyDiv = document.createElement("div");
                storyDiv.Story = thisStory;
                thisStory.Element = storyDiv;
                
                storyDiv.setAttribute("id", "storydiv" + thisStory.ID);
                storyDiv.setAttribute("listid", "listid" + kanbanListItem.ID);
                storyDiv.setAttribute("storyid", "storydiv" + thisStory.ID);
                storyDiv.setAttribute("dropdivid", "dropdiv" + thisStory.ID);
                storyDiv.setAttribute("draggable", "true");
                storyDiv.setAttribute("onclick", "EditStory('" + thisStory.ID + "');");

                storyDiv.addEventListener('dragstart', DragStart, false);
                storyDiv.addEventListener("dragend", DragEnd, false);

                storyDiv.addEventListener('dragenter', HandleDragEnter, false);
                storyDiv.addEventListener('dragover', HandleDragOver, false);
                storyDiv.addEventListener('dragleave', HandleDragLeave, false);

                storyDiv.addEventListener('drop', Drop, false);

                var dropDiv = document.createElement("div");
                dropDiv.setAttribute("class", "kanbandropper");
                dropDiv.setAttribute("id", "dropdiv" + thisStory.ID); 
                dropDiv.setAttribute("listid", "listid" + kanbanListItem.ID);
                dropDiv.setAttribute("storyid", "storydiv" + thisStory.ID);
                dropDiv.setAttribute("dropdivid", "dropdiv" + thisStory.ID);
                //dropDiv.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
                storyDiv.appendChild(dropDiv);

                var storyContainerDiv = document.createElement("div");
                storyContainerDiv.setAttribute("class", "kanbanstory");
                storyContainerDiv.setAttribute("id", "storycontainer" + thisStory.ID);
                storyContainerDiv.setAttribute("listid", "listid" + kanbanListItem.ID);
                storyContainerDiv.setAttribute("storyid", "storydiv" + thisStory.ID);
                storyContainerDiv.setAttribute("dropdivid", "dropdiv" + thisStory.ID);
                storyContainerDiv.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
                storyDiv.appendChild(storyContainerDiv);

                var storyDivSeverity = document.createElement("div");
                storyDivSeverity.setAttribute("class", "kanbanstoryseverity kanbanstorypriority");
                storyDivSeverity.setAttribute("id", "storyseverity" + thisStory.ID);
                storyDivSeverity.setAttribute("priority", thisStory.Issue.priority.name);
                storyDivSeverity.setAttribute("listid", "listid" + kanbanListItem.ID);
                storyDivSeverity.setAttribute("storyid", "storydiv" + thisStory.ID);
                storyDivSeverity.setAttribute("dropdivid", "dropdiv" + thisStory.ID);
                storyDivSeverity.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
                storyContainerDiv.appendChild(storyDivSeverity);

                var storyDivTitle = document.createElement("div");
                storyDivTitle.innerHTML = thisStory.Summary;
                storyDivTitle.setAttribute("class", "kanbanstorytitle");
                storyDivTitle.setAttribute("id", "storytitle" + thisStory.ID);
                storyDivTitle.setAttribute("onclick", "EditStory('" + thisStory.ID + "');");
                storyDivTitle.setAttribute("listid", "listid" + kanbanListItem.ID);
                storyDivTitle.setAttribute("storyid", "storydiv" + thisStory.ID);
                storyDivTitle.setAttribute("dropdivid", "dropdiv" + thisStory.ID);
                storyDivTitle.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
                storyContainerDiv.appendChild(storyDivTitle);
                
                var storyDivButton = document.createElement("img");
                storyDivButton.setAttribute("src", "images/info.png");
                storyDivButton.setAttribute("id", "storydivbutton" + thisStory.ID);
                storyDivButton.setAttribute("class", "storyinfobutton");
                storyDivButton.setAttribute("onclick", "EditStory('" + thisStory.ID + "');");
                storyDivButton.setAttribute("listid", "listid" + kanbanListItem.ID);
                storyDivButton.setAttribute("storyid", "storydiv" + thisStory.ID);
                storyDivButton.setAttribute("dropdivid", "dropdiv" + thisStory.ID);
                storyDivButton.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
                storyContainerDiv.appendChild(storyDivButton);
                
                listDiv.appendChild(storyDiv);
            }
            
            //var addStoryDiv = document.createElement("div");
            //addStoryDiv.innerHTML = "Add New Story";
            //addStoryDiv.setAttribute("class", "kanbannewstory");
            //addStoryDiv.setAttribute("onclick", "$('#story-form').dialog('open');");
            
            //listDiv.appendChild(addStoryDiv);
            
            ///Add it all to the container div
            Kanban.Container.appendChild(listDiv);
        }
    }
}

var Dragging = false;

function DragCancel(event) {
    event.preventDefault();
}

function DragStart(event) {

    Dragging = true;
    event.target.style.opacity = '.999999';  // this / e.target is the source node.
    event.dataTransfer.setData("Text",event.target.id);
    event.target.classList.add("rotation");
}

function DragEnd(event) {
    Dragging = false;
    event.target.classList.remove("rotation");
}

function Drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.classList.remove('over');
        
    if(event.target.getAttribute("class") == "kanbanlist") {
        event.target.appendChild(document.getElementById(data));
    }  else {
        var listToDropIn = document.getElementById(event.target.getAttribute("listid"));
        var targetStoryDiv = document.getElementById(event.target.getAttribute("storyid"));
        document.getElementById(targetStoryDiv.getAttribute("dropdivid")).classList.remove("over");
        listToDropIn.insertBefore(document.getElementById(data), targetStoryDiv);
    }
}

function ClearAllDragHoverAreas() {
    var elements = document.getElementsByClassName("over");
    for(var i = 0; i < elements.length; i++) {
        elements[i].classList.remove("over");
    }
}

function HandleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function HandleDragEnter(e) {
    ClearAllDragHoverAreas();
    console.log("HandleDragEnter: StoryID: " + e.target.getAttribute("storyid") + "  ID: " + e.target.id);
    if(e.target.getAttribute("storyid") != e.target.getAttribute("id")) {
        document.getElementById(e.target.getAttribute("dropdivid")).classList.add("over");
    }
}

function HandleDragLeave(e) {
        document.getElementById(e.target.getAttribute("dropdivid")).classList.remove("over");
}

var KanbanStory = function(StoryID, StoryStatus, StorySummary, StoryDescription, StoryNotes, StoryAssignedTo, RawObject) {
    this.ID = StoryID;
    this.ListID = null;

    for(var counter in RawObject.custom_fields) {
        var customfield = RawObject.custom_fields[counter];
        if(customfield.field.name == Kanban._listIDField) {
            this.ListID = customfield.value;
        }
    }
    if(this.ListID == null) this.ListID = StoryStatus.id;

    this.Summary = StorySummary;
    this.Status = StoryStatus;
    this.Notes = StoryNotes;
    this.Description = StoryDescription;
    this.AssignedTo = StoryAssignedTo;
    for(var li = 0; li < Kanban.Lists.length; li++){
        if(Kanban.Lists[li].ID == this.ListID) {
            this.List = Kanban.Lists[li];
            var foundStoryInList = false;
            for(var sti = 0; sti < Kanban.Lists[li].Stories.length; sti++) {
                if(Kanban.Lists[li].Stories[sti].ID == StoryID) foundStoryInList = true;
            }
            if(!foundStoryInList) Kanban.Lists[li].Stories[Kanban.Lists[li].Stories.length] = this;
            break;
        }
    }
    
    this.Issue = RawObject;
}

KanbanStory.prototype = {
    Save : function() {
        this.Issue.summary = this.Summary;
        this.Issue.status.id = this.List.ID;
    }
}

var KanbanList = function(ListName, ListID){
    this.Name = ListName;
    this.ID = ListID;
    this.Stories = new Array();
}

KanbanList.prototype = {

}


function EditStory(storyID) {
    thisStory = Kanban.GetStoryByFieldValue("ID", storyID);
    $("#edit-summary").val(thisStory.Summary);
    $("#edit-description").val(thisStory.Description);
    document.getElementById("edit-reporter").innerHTML = thisStory.Issue.reporter.real_name;
    var selectAssignedUser = document.getElementById("edit-assignedto");
    selectAssignedUser.options.length = 0;
    for(var i = 0; i < Mantis.ProjectUsers.length; i++) {
        var user = Mantis.ProjectUsers[i];
        selectAssignedUser.options[selectAssignedUser.options.length] = new Option(user.real_name, user.id);
        if(user.id == thisStory.Issue.handler.id) { selectAssignedUser.selectedIndex = i; }

    }
    $("#edit-story-form").dialog("open");
}
