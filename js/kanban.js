

var Kanban = {

    BlockUpdates : false,
    
    UndoInfo : {
        StoryDiv : null,
        ListDiv : null
    },

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
        return null;
    },
    
    ReplaceStory : function(Story) {
        for(var i = 0; i < Kanban.Stories.length; i++) {
            if(Story.Issue.id == Kanban.Stories[i].Issue.id) {
                Kanban.Stories[i] = Story;
            }
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
            listDiv.addEventListener('dragenter', HandleDragEnter, false);
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
                if(thisStory.HandlerName == Mantis.CurrentUser.UserName) {
                    storyContainerDiv.classList.add("mystory");
                }
                storyContainerDiv.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
                storyDiv.appendChild(storyContainerDiv);

                var storyDivSeverity = document.createElement("div");
                storyDivSeverity.setAttribute("class", "kanbanstoryseverity kanbanstorypriority");
                storyDivSeverity.setAttribute("id", "storyseverity" + thisStory.ID);
                storyDivSeverity.setAttribute("priority", thisStory.PriorityName);
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
                //storyDivButton.setAttribute("draggable", false);
                storyDivButton.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
                storyContainerDiv.appendChild(storyDivButton);

                listDiv.appendChild(storyDiv);
            }
            
            
            var listDropArea = document.createElement("div");
            listDropArea.setAttribute("class", "kanbanlistdroparea");
            listDropArea.setAttribute("id", "droplistid" + kanbanListItem.ID);
            listDropArea.setAttribute("listid", "listid" + kanbanListItem.ID);
            listDropArea.addEventListener('dragover', HandleDragOver, false);
            listDropArea.addEventListener('dragenter', HandleDragEnter, false);
            listDropArea.addEventListener("drop", Drop, false);
            listDropArea.innerHTML = "Drop Here";
            listDiv.appendChild(listDropArea);
            
            //var addStoryDiv = document.createElement("div");
            //addStoryDiv.innerHTML = "Add New Story";
            //addStoryDiv.setAttribute("class", "kanbannewstory");
            //addStoryDiv.setAttribute("onclick", "$('#story-form').dialog('open');");
            
            //listDiv.appendChild(addStoryDiv);
            
            ///Add it all to the container div
            Kanban.Container.appendChild(listDiv);
            Kanban.Container.addEventListener('dragenter', HandleDragEnter, false);
        }
    }
}

var Dragging = false;

function DragCancel(event) {
    console.log("DragCancel1");
    event.preventDefault();
    console.log("DragCancel2");
}

function DragStart(event) {
    console.log("DragStart1");
    event.preventDefault();
    Dragging = true;
    event.target.style.opacity = '.999999';  // this / e.target is the source node.
    event.dataTransfer.setData("Text",event.target.id);
    event.target.classList.add("rotation");
    console.log("DragStart2");
}

function DragEnd(event) {
    console.log("DragEnd1");
    Dragging = false;
    event.target.classList.remove("rotation");
    console.log("DragEnd1");
}

function Drop(event) {
    event.preventDefault();
    if(Kanban.BlockUpdates) return;
    
    var data = event.dataTransfer.getData("Text");
    event.target.classList.remove('over');
    var listToDropIn = null;

    var sourceElement = document.getElementById(data);
    Kanban.UndoInfo.StoryDiv = sourceElement;
    Kanban.UndoInfo.ListDiv = document.getElementById(sourceElement.getAttribute("listid"));
    var sourceElementDropDiv = document.getElementById(sourceElement.getAttribute("dropdivid"));
    var targetStoryDiv = document.getElementById(event.target.getAttribute("storyid"));

    StartLoading();
    Kanban.BlockUpdates = true;
    
    try {
    
        if(event.target.getAttribute("class") == "kanbanlist" && sourceElement.getAttribute("class").indexOf("storyinfobutton") < 0) {
            listToDropIn = event.target;
            UpdateKanbanStoryList(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
            listToDropIn.insertBefore(sourceElement, listToDropIn.lastChild);
        } else if(event.target.getAttribute("class") == "kanbanlistdroparea") {
            listToDropIn = document.getElementById(event.target.getAttribute("listid"));
            UpdateKanbanStoryList(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
            listToDropIn.insertBefore(sourceElement, listToDropIn.lastChild);
        } else {
            listToDropIn = document.getElementById(event.target.getAttribute("listid"));
            UpdateKanbanStoryList(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
            sourceElementDropDiv.classList.remove("over");
            listToDropIn.insertBefore(sourceElement, targetStoryDiv);
        }
        
        sourceElement.setAttribute("listid", listToDropIn.getAttribute("id"));
        sourceElementDropDiv.setAttribute("listid", listToDropIn.getAttribute("id"));
        
    } catch (e) {
        console.log(e); 
        alert("Error:" + e.message);
        Kanban.BlockUpdates = false;
        StopLoading();
    } finally {
        
    }
    
}

function UndoLastKanbanMove() {
    Kanban.UndoInfo.ListDiv.appendChild(Kanban.UndoInfo.StoryDiv);
    Kanban.UndoInfo.StoryDiv.setAttribute("listid", Kanban.UndoInfo.ListDiv.getAttribute("id"));
}

function AddIssueComplete(result) {
    Kanban.BlockUpdates = false;
    StopLoading();
    if(result != "true") {
        alert("Error Adding: " + result);
    } else {
        try {
            Kanban.Stories[Kanban.Stories.length] = new KanbanStory(Mantis.IssueGet(result));
            var newFoundStory = Kanban.GetStoryByFieldValue("ID", result);
            Kanban.ClearListGUI();
            Kanban.BuildListGUI();
        } catch (e) { console.log(e); }
        
    }

}

function UpdateKanbanStoryComplete(result) {
    Kanban.BlockUpdates = false;
    StopLoading();
    if(result != "true") {
        try {
            UndoLastKanbanMove();
        } catch (e) { console.log(e); }
        alert("Error Updating: " + result);
    } else {
        try {
            var foundStory = Kanban.GetStoryByFieldValue("ID", document.getElementById("edit-story-id").value);
            Kanban.ReplaceStory(UpdateUnderlyingStory(foundStory));
            var newFoundStory = Kanban.GetStoryByFieldValue("ID", foundStory.ID);
            foundStory.Element.children[1].children[1].innerHTML = newFoundStory.Summary;
        } catch (e) { console.log(e); }
        
        Kanban.UndoInfo.ListDiv = null;
        Kanban.UndoInfo.StoryDiv = null;
    }
}

function AddStoryFromFormData() {
    var summary = $("#add-summary").val();
    var description = $("#add-description").val();
    var handlerid = document.getElementById("add-assignedto").value;
    var statusid = document.getElementById("add-status").value;
    var priorityid = document.getElementById("add-priority").value;
    var category = document.getElementById("add-category").value
    
    var newIssueStruct = Mantis.UpdateStructureMethods.Issue.NewIssue(summary, description, Mantis.CurrentProjectID, handlerid, statusid, priorityid, category);
    
    Mantis.IssueAdd(newIssueStruct, AddIssueComplete);
}

function UpdateStoryFromFormData() {
    try {
        Kanban.BlockUpdates = true;
        StartLoading();
        
        Kanban.GetStoryByFieldValue("ID", document.getElementById("edit-story-id").value);
        thisStory.Issue.summary = $("#edit-summary").val();
        thisStory.Issue.description = $("#edit-description").val();
        thisStory.Issue.handler.id = document.getElementById("edit-assignedto").value;
        thisStory.Issue.priority.id = document.getElementById("edit-priority").value;
        thisStory.Issue.status.id = document.getElementById("edit-status").value;
        Mantis.IssueUpdate(thisStory.Issue.id, thisStory.Issue, UpdateKanbanStoryComplete)
        
        $("#edit-story-form").dialog("close");
    } catch (e) {
        console.log(e);
        alert("Error:" + e.message);
        Kanban.BlockUpdates = false;
        StopLoading();
    } finally {
        
    }
}

function UpdateKanbanStoryList(KanbanStoryToUpdate, KanbanListToMoveTo, UpdateKanbanStoryCallback) {
    
    var updateIssue = Mantis.UpdateStructureMethods.Issue.UpdateStatus(KanbanStoryToUpdate.StorySource, KanbanListToMoveTo.ID, KanbanListToMoveTo.Name);
    
    var updateSucceeded = false;
    try {
        Mantis.IssueUpdate(KanbanStoryToUpdate.ID, updateIssue, UpdateKanbanStoryCallback);
    } catch (e) {
        console.log(e);
        alert("Error Updating Story: " + e.message);    
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

function UpdateUnderlyingStory(originalStory) {
    var newStory = new KanbanStory(Mantis.IssueGet(originalStory.Issue.id));
    newStory.Element = originalStory.Element;
    return newStory;
}

function SaveNewNote(storyID, noteText) {
    try {
        Kanban.BlockUpdates = true;
        StartLoading();
        var editStory = Kanban.GetStoryByFieldValue("ID", storyID);
        var newNote = Mantis.UpdateStructureMethods.Note.NewNote(noteText);
        Mantis.IssueNoteAdd(editStory.ID, newNote);
        editStory = UpdateUnderlyingStory(editStory);
        AddNotesToStoryEditForm(editStory);
        document.getElementById("newnotetext").value = "";
        
    } catch(e) {
        console.log(e);
        alert("Error Saving Note: " + e.message);
    } finally {
        StopLoading();
        Kanban.BlockUpdates = false;
    }
}

function AddNotesToStoryEditForm(KanbanStory) {
    var notesContainer = document.getElementById("edit-story-notes-container");
    var noteSaveButton = document.getElementById("edit-story-new-note-save-button");
    
    try { while(notesContainer.childNodes.length > 0) { notesContainer.removeChild(notesContainer.firstChild); } } catch(e) { }
    
    noteSaveButton.setAttribute("onclick", "SaveNewNote(" + KanbanStory.ID + ", document.getElementById('newnotetext').value);")

    if(KanbanStory.Notes === undefined) return;
    
    for(var i = 0; i < KanbanStory.Notes.length; i++) {
        var thisNote = KanbanStory.Notes[i];
        var noteDiv = document.createElement("div");
        noteDiv.setAttribute("class", "notecontainer");
        noteDiv.setAttribute("storyid", KanbanStory.ID);

        var noteSubmitterDiv = document.createElement("div");
        noteSubmitterDiv.setAttribute("class", "notesubmitter");
        noteSubmitterDiv.innerHTML = thisNote.reporter.real_name;
        noteDiv.appendChild(noteSubmitterDiv);

        var noteDateSubbmitedDiv = document.createElement("div");
        noteDateSubbmitedDiv.setAttribute("class", "notedatesubmitted");
        noteDateSubbmitedDiv.innerHTML = thisNote.date_submitted;
        noteDiv.appendChild(noteDateSubbmitedDiv);

        var noteTextDiv = document.createElement("div");
        noteTextDiv.setAttribute("class", "notetext");
        noteTextDiv.innerHTML = thisNote.text;
        noteDiv.appendChild(noteTextDiv);

        notesContainer.appendChild(noteDiv);
    }
}


function OpenAddStory() {
    
    var selectAssignedUser = document.getElementById("add-assignedto");
    selectAssignedUser.options.length = 0;
    var selectAddStatus = document.getElementById("add-status");
    selectAddStatus.options.length = 0;
    var selectAddPriority = document.getElementById("add-priority");
    selectAddPriority.options.length = 0;
    var selectAddCategories = document.getElementById("add-category");
    selectAddCategories.options.length = 0;

    for(var i = 0; i < Mantis.ProjectUsers.length; i++) {
        var user = Mantis.ProjectUsers[i];
        selectAssignedUser.options[selectAssignedUser.options.length] = new Option(user.real_name, user.id);
        if(Mantis.CurrentUser.MantisUser.id == user.id) {
             selectAssignedUser.selectedIndex = i + 1;
        }

    }

    for(var i = 0; i < Mantis.Statuses.length; i++) {
        var status = Mantis.Statuses[i];
        selectAddStatus.options[selectAddStatus.options.length] = new Option(status.name, status.id);
    }
    selectAddStatus.selectedIndex = 0;

    for(var i = 0; i < Mantis.Priorities.length; i++) {
        var priority = Mantis.Priorities[i];
        selectAddPriority.options[selectAddPriority.options.length] = new Option(priority.name, priority.id);
    }
    selectAddPriority.selectedIndex = 0;
    
    for(var i = 0; i < Mantis.ProjectCategories.length; i++) {
        var category = Mantis.ProjectCategories[i];
        selectAddCategories.options[selectAddCategories.options.length] = new Option(category, category);
    }
    selectAddCategories.selectedIndex = 0;
    
    $('#story-form').dialog('open');

}

function EditStory(storyID) {
    var thisStory = Kanban.GetStoryByFieldValue("ID", storyID);
    $("#edit-story-id").val(thisStory.ID);
    $("#edit-summary").val(thisStory.Summary);
    $("#edit-description").val(thisStory.Description);
    document.getElementById("edit-reporter").innerHTML = thisStory.ReporterName;

    var selectAssignedUser = document.getElementById("edit-assignedto");
    selectAssignedUser.options.length = 0;
    var selectAddStatus = document.getElementById("edit-status");
    selectAddStatus.options.length = 0;
    var selectAddPriority = document.getElementById("edit-priority");
    selectAddPriority.options.length = 0;
    
    ///Add a blank option
    selectAssignedUser.options[selectAssignedUser.options.length] = new Option("--- Assign To ---", "");
    for(var i = 0; i < Mantis.ProjectUsers.length; i++) {
        var user = Mantis.ProjectUsers[i];
        selectAssignedUser.options[selectAssignedUser.options.length] = new Option(user.real_name, user.id);
        if(thisStory.HandlerID !== undefined && user.id == thisStory.HandlerID) {
             selectAssignedUser.selectedIndex = i + 1;
        }
    }
    
    for(var i = 0; i < Mantis.Statuses.length; i++) {
        var status = Mantis.Statuses[i];
        selectAddStatus.options[selectAddStatus.options.length] = new Option(status.name, status.id);
        if(thisStory.StatusID == status.id) {
             selectAddStatus.selectedIndex = i;
        }
        
    }

    for(var i = 0; i < Mantis.Priorities.length; i++) {
        var priority = Mantis.Priorities[i];
        selectAddPriority.options[selectAddPriority.options.length] = new Option(priority.name, priority.id);
        if(thisStory.PriorityID == priority.id) {
             selectAddPriority.selectedIndex = i;
        }
    }
    
    AddNotesToStoryEditForm(thisStory)
    $("#edit-story-form").dialog("open");
}