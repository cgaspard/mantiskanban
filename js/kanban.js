

var Kanban = {
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
    
    BuildListGUI : function() {
        for(var li = 0; li < Kanban.Lists.length; li++) {
            var kanbanListItem = Kanban.Lists[li];
            
            ///The main container
            var listDiv = document.createElement("div");
            listDiv.setAttribute("class", "kanbanlist");
            listDiv.List = kanbanListItem;
            
            ///The title container
            var listDivTitle = document.createElement("div");
            listDivTitle.setAttribute("class", "kanbanlisttitle");
            listDivTitle.innerHTML = kanbanListItem.Name.capitalize();
            listDiv.appendChild(listDivTitle);
            
            var dropDiv = document.createElement("div");
            dropDiv.setAttribute("class", "kanbandropper");            
            dropDiv.addEventListener('dragenter', HandleDragEnter, false);
            dropDiv.addEventListener('dragover', HandleDragOver, false);
            dropDiv.addEventListener('dragleave', HandleDragLeave, false);
            dropDiv.addEventListener('drop', Drop, false);
            dropDiv.innerHTML = "Drop";
            listDiv.appendChild(dropDiv);
            
            for(var si = 0; si < kanbanListItem.Stories.length; si++) {
                //var thisStory = new KanbanStory();i could write it in 
                var thisStory = kanbanListItem.Stories[si];
                var storyDiv = document.createElement("div");
                storyDiv.setAttribute("class", "kanbanstory");
                storyDiv.setAttribute("id", thisStory.ID);
                storyDiv.setAttribute("draggable", "true");
                storyDiv.addEventListener('dragstart', Drag, false);
                storyDiv.addEventListener("dragend", DragEnd, false);
                storyDiv.setAttribute("onclick", "EditStory('" + thisStory.ID + "');");
                storyDiv.Story = thisStory;

                var storyDivSeverity = document.createElement("div");
                //storyDivSeverity.innerHTML = thisStory.Summary;
                storyDivSeverity.setAttribute("class", "kanbanstoryseverity");
                storyDivSeverity.setAttribute("severity", thisStory.Issue.severity.name);
                storyDiv.appendChild(storyDivSeverity);

                
                var storyDivTitle = document.createElement("div");
                storyDivTitle.innerHTML = thisStory.Summary;
                storyDivTitle.setAttribute("class", "kanbanstorytitle");
                storyDivTitle.setAttribute("onclick", "EditStory('" + thisStory.ID + "');");
                storyDiv.appendChild(storyDivTitle);
                
                var storyDivButton = document.createElement("img");
                storyDivButton.setAttribute("src", "images/info.png");
                storyDivButton.setAttribute("class", "storyinfobutton");
                storyDivButton.setAttribute("onclick", "EditStory('" + thisStory.ID + "');");
                storyDiv.appendChild(storyDivButton);
                
                //storyDiv.setAttribute("ondragstart", "HandleDragStart(event);");
                listDiv.appendChild(storyDiv);
            }
            
            var addStoryDiv = document.createElement("div");
            addStoryDiv.innerHTML = "Add New Story";
            addStoryDiv.setAttribute("class", "kanbannewstory");
            addStoryDiv.setAttribute("onclick", "$('#story-form').dialog('open');");
            
            listDiv.appendChild(addStoryDiv);
            
            ///Add it all to the container div
            Kanban.Container.appendChild(listDiv);
        }
    }
}

function Drag(event) {
  event.target.style.opacity = '.999999';  // this / e.target is the source node.
  event.dataTransfer.setData("Text",event.target.id);
  event.target.classList.add("rotation");
}

function DragEnd(event) {
    event.target.classList.remove("rotation");
    
}

function Drop(event) {
    event.preventDefault();
    var data=event.dataTransfer.getData("Text");
    //alert(event.target.parentNode.nextSibling);
    event.target.classList.remove('over');
    event.target.parentNode.insertBefore(document.getElementById(data),  event.target.nextSibling);
}


function HandleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function HandleDragEnter(e) {
  // this / e.target is the current hover target.
  e.target.classList.add('over');
}

function HandleDragLeave(e) {
  e.target.classList.remove('over');  // this / e.target is previous target element.
}

var KanbanStory = function(StoryID, StoryStatus, StorySummary, StoryDescription, StoryNotes, StoryAssignedTo, RawObject) {
    this.ID = StoryID;
    this.Summary = StorySummary;
    this.Status = StoryStatus;
    this.Notes = StoryNotes;
    this.Description = StoryDescription;
    this.AssignedTo = StoryAssignedTo;
    for(var li = 0; li < Kanban.Lists.length; li++){
        if(Kanban.Lists[li].ID == StoryStatus.id) {
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
    $("#edit-story-form").dialog("open");


}
