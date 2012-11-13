var Kanban = {

	CurrentProject: null,
	BlockUpdates: false,
	Dragging: false,
	UsingCustomField: false,
	_listIDField: "ScrumBucket",

	UndoInfo: {
		StoryDiv: null,
		ListDiv: null
	},

	get Container() {
		return document.getElementById("kanbancontent");
	},

	Projects: [],
	Lists: [],
	Stories: [],

	/*
	 * @name HasStory
	 * @returns {boolean} Returns true if the story is already loaded into the "Mantis.Stories" array.
	 * @argument {int} id The ID of the story to look for
	 */
	HasStory: function(id) {
		for(var i = 0; i < Kanban.Stories.length; i++) {
			if(Kanban.Stories[i].ID == id) return true;
		}
		return false;
	},

	/*
	 * @name HasList
	 * @returns {boolean} Returns true if the list is already loaded into the "Mantis.Lists" array.
	 * @argument {int} id The ID of the list to look for
	 */
	HasList: function(id) {
		for(var i = 0; i < Kanban.Lists.length; i++) {
			if(Kanban.Lists[i].ID == id) return true;
		}
		return false;
	},

	CloseAddStoryDialog: function() {
		$("#story-form").dialog("close");
	},

	GetStoryByFieldValue: function(field, value) {
		for(var i = 0; i < Kanban.Stories.length; i++) {
			if(Kanban.Stories[i][field] == value) return Kanban.Stories[i];
		}
		return null;
	},

	ReplaceStory: function(Story) {
		for(var i = 0; i < Kanban.Stories.length; i++) {
			if(Story.ID == Kanban.Stories[i].ID) {
				Kanban.Stories[i] = Story;
			}
		}
	},

	AddStoryFromFormData: function() {
		var summary = $("#add-summary").val();
		var description = $("#add-description").val();
		var handlerid = document.getElementById("add-assignedto").value;
		var statusid = document.getElementById("add-status").value;
		var priorityid = document.getElementById("add-priority").value;
		var category = document.getElementById("add-category").value
		var customfieldvalue = null;
		if(Kanban.UsingCustomField) customfieldvalue = document.getElementById("add-custom-field").value;

		Kanban.AddStory(summary, description, handlerid, statusid, priorityid, category, customfieldvalue);
	},

	AddStoryToArray: function(storyToAdd) {
		if(!Kanban.HasStory(storyToAdd.ID)) {
			Kanban.Stories[Kanban.Stories.length] = storyToAdd;
		}
	},

	AddListToArray: function(listToAdd) {
		if(!Kanban.HasList(listToAdd.ID)) {
			Kanban.Lists[Kanban.Lists.length] = listToAdd;
		}
	},

	ClearListGUI: function() {
		while(Kanban.Container.childNodes.length != 0) {
			Kanban.Container.removeChild(Kanban.Container.firstChild);
		}
	},

	UndoLastKanbanMove: function() {
		if(Kanban.UndoInfo.ListDiv !== null) {
			Kanban.UndoInfo.ListDiv.insertBefore(Kanban.UndoInfo.StoryDiv, Kanban.UndoInfo.ListDiv.lastChild);
			Kanban.UndoInfo.StoryDiv.setAttribute("listid", Kanban.UndoInfo.ListDiv.getAttribute("id"));
		}
	},

	AddGlowToRelatedStories : function(id) {
		var foundStory = Kanban.GetStoryByFieldValue("ID", id);
		for(var rel = 0; rel < foundStory.RelatedStories.length; rel++) {
			var foundRelation = Kanban.GetStoryByFieldValue("ID", foundStory.RelatedStories[rel]);
			foundRelation.Element.children[1].classList.add("glow");
		}
	},

	RemoveGlowToRelatedStories : function(id) {
		var foundStory = Kanban.GetStoryByFieldValue("ID", id);
		for(var rel = 0; rel < foundStory.RelatedStories.length; rel++) {
			var foundRelation = Kanban.GetStoryByFieldValue("ID", foundStory.RelatedStories[rel]);
			foundRelation.Element.children[1].classList.remove("glow");
		}
	},

	BuildListGUI: function() {
		for(var li = 0; li < Kanban.Lists.length; li++) {
			var kanbanListItem = Kanban.Lists[li];

			///The main container
			var listDiv = document.createElement("div");
			kanbanListItem.Element = listDiv;
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
				var storyDiv = thisStory.BuildKanbanStoryDiv();
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

			///Add it all to the container div
			Kanban.Container.appendChild(listDiv);

			var spacingDiv = document.createElement("div");
			spacingDiv.setAttribute("class", "kanbanlistspacer");
			Kanban.Container.appendChild(spacingDiv);

			Kanban.Container.addEventListener('dragenter', HandleDragEnter, false);
		}
	}
}

function DragCancel(event) {
	console.log("DragCancel1");
	event.preventDefault();
	console.log("DragCancel2");
}

function DragStart(event) {
	console.log("DragStart1");
	Kanban.Dragging = true;
	event.target.style.opacity = '.999999'; // this / e.target is the source node.
	event.dataTransfer.setData("Text", event.target.id);
	event.target.classList.add("rotation");
	console.log("DragStart2");
}

function DragEnd(event) {
	console.log("DragEnd1");
	Kanban.Dragging = false;
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
			UpdateListForCanbanStory(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
			listToDropIn.insertBefore(sourceElement, listToDropIn.lastChild);
		} else if(event.target.getAttribute("class") == "kanbanlistdroparea") {
			listToDropIn = document.getElementById(event.target.getAttribute("listid"));
			UpdateListForCanbanStory(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
			listToDropIn.insertBefore(sourceElement, listToDropIn.lastChild);
		} else {
			listToDropIn = document.getElementById(event.target.getAttribute("listid"));
			UpdateListForCanbanStory(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
			sourceElementDropDiv.classList.remove("over");
			listToDropIn.insertBefore(sourceElement, targetStoryDiv);
		}

		sourceElement.setAttribute("listid", listToDropIn.getAttribute("id"));
		sourceElementDropDiv.setAttribute("listid", listToDropIn.getAttribute("id"));

	} catch(e) {
		console.log(e);
		alert("Error:" + e.message);
		Kanban.BlockUpdates = false;
		StopLoading();
	} finally {

	}

}

function UpdateKanbanStoryComplete(result) {
	console.log("UpdateKanbanStoryComplete " + result);
	Kanban.BlockUpdates = false;
	StopLoading();
	if(result != "true") {
		try {
			Kanban.UndoLastKanbanMove();
		} catch(e) {
			console.log(e);
		}
		alert("Error Updating: " + result);
	} else {
		try {
			var foundStory = Kanban.GetStoryByFieldValue("ID", document.getElementById("edit-story-id").value);
			if(foundStory !== null) {
				///If its null, then we werent' editing the story, just dropping between the lists
				Kanban.UpdateUnderlyingStorySource(foundStory);
				//var newFoundStory = Kanban.GetStoryByFieldValue("ID", foundStory.ID);
				foundStory.Element.children[1].children[1].innerHTML = foundStory.Summary;
				if(foundStory.HandlerName == Mantis.CurrentUser.UserName) {
					document.getElementById("storycontainer" + foundStory.ID).classList.add("mystory");
				} else {
					document.getElementById("storycontainer" + foundStory.ID).classList.remove("mystory");
				}
				/// Make sure the list is still valid
				if(foundStory.List.ID != foundStory.ListID) {
					for(var li = 0; li < Kanban.Lists.length; li++) {
						var thisList = Kanban.Lists[li];
						if(thisList.ID == foundStory.ListID) {
							thisList.AddNewStoryUI(foundStory);
						}
					}
				}
				//foundStory.Element.children[1].children[1].innerHTML = newFoundStory.Summary;
			}
		} catch(e) {
			console.log(e);
		}

		Kanban.UndoInfo.ListDiv = null;
		Kanban.UndoInfo.StoryDiv = null;
	}
}


function UpdateStoryFromFormData() {
	try {
		Kanban.BlockUpdates = true;
		StartLoading();

		var thisStory = Kanban.GetStoryByFieldValue("ID", document.getElementById("edit-story-id").value);
		thisStory.Summary = $("#edit-summary").val();
		thisStory.Description = $("#edit-description").val();
		if(document.getElementById("edit-assignedto").value == "") {
			thisStory.HandlerID = null;
		} else {
			thisStory.HandlerID = document.getElementById("edit-assignedto").value;
		}
		thisStory.PriorityID = document.getElementById("edit-priority").value;
		thisStory.StatusID = document.getElementById("edit-status").value;
		thisStory.Reproduce = document.getElementById("edit-reproduce").value;
		Mantis.IssueUpdate(thisStory.ID, thisStory.StorySource, UpdateKanbanStoryComplete)

		$("#edit-story-form").dialog("close");
	} catch(e) {
		console.log(e);
		alert("Error:" + e.message);
		Kanban.BlockUpdates = false;
		StopLoading();
	} finally {

	}
}

function UpdateListForCanbanStory(KanbanStoryToUpdate, KanbanListToMoveTo, UpdateKanbanStoryCallback) {
	var updateIssue = null;
	if(KanbanStoryToUpdate.UsesCustomField) {
		updateIssue = Mantis.UpdateStructureMethods.Issue.UpdateCustomField(KanbanStoryToUpdate.StorySource, Kanban._listIDField, KanbanListToMoveTo.ID);
	} else {
		updateIssue = Mantis.UpdateStructureMethods.Issue.UpdateStatus(KanbanStoryToUpdate.StorySource, KanbanListToMoveTo.ID, KanbanListToMoveTo.Name);
	}

	var updateSucceeded = false;
	try {
		Mantis.IssueUpdate(KanbanStoryToUpdate.ID, updateIssue, UpdateKanbanStoryCallback);
	} catch(e) {
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
	if(e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	e.dataTransfer.dropEffect = 'move';
	return false;
}

function HandleDragEnter(e) {
	ClearAllDragHoverAreas();
	console.log("HandleDragEnter: StoryID: " + e.target.getAttribute("storyid") + "  ID: " + e.target.id);
	if(e.target.getAttribute("storyid") != e.target.getAttribute("id")) {
		var dropDiv = document.getElementById(e.target.getAttribute("dropdivid"));
		if(dropDiv != null) dropDiv.classList.add("over");
	}
}

function HandleDragLeave(e) {
	var dropDiv = document.getElementById(e.target.getAttribute("dropdivid"));
	if(dropDiv != null) dropDiv.classList.remove("over");
}


function SaveNewNote(storyID, noteText) {
	try {
		Kanban.BlockUpdates = true;
		StartLoading();
		var editStory = Kanban.GetStoryByFieldValue("ID", storyID);
		var newNote = Mantis.UpdateStructureMethods.Note.NewNote(noteText);
		Mantis.IssueNoteAdd(editStory.ID, newNote);
		editStory = Kanban.UpdateUnderlyingStorySource(editStory);
		AddNotesToStoryEditForm(editStory);
		document.getElementById("edit-newnotetext").value = "";
	} catch(e) {
		console.log(e);
		alert("Error Saving Note: " + e.message);
	} finally {
		StopLoading();
		Kanban.BlockUpdates = false;
	}
}

/*
* @name AddNotesToStoryEditForm
* @param {KanbanStory} KanbanStory The story to display the notes for
* @description Adds existing notes to the edit for of a story
*/
function AddNotesToStoryEditForm(KanbanStory) {
	var notesContainer = document.getElementById("edit-story-notes-container");
	var noteSaveButton = document.getElementById("edit-story-new-note-save-button");

	try {
		while(notesContainer.childNodes.length > 0) {
			notesContainer.removeChild(notesContainer.firstChild);
		}
	} catch(e) {}

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
		var testDate = new Date(Date.parse(thisNote.date_submitted));

		//noteDateSubbmitedDiv.innerHTML = thisNote.date_submitted;
		noteDateSubbmitedDiv.innerHTML = testDate;
		noteDiv.appendChild(noteDateSubbmitedDiv);

		var noteTextDiv = document.createElement("div");
		noteTextDiv.setAttribute("class", "notetext");
		noteTextDiv.innerHTML = thisNote.text;
		noteDiv.appendChild(noteTextDiv);

		notesContainer.appendChild(noteDiv);
	}
}


function OpenAddStory() {

	document.getElementById("add-summary").value = "";
	document.getElementById("add-description").value = "";

	var selectAssignedUser = document.getElementById("add-assignedto");
	selectAssignedUser.options.length = 0;
	var selectAddStatus = document.getElementById("add-status");
	selectAddStatus.options.length = 0;
	var selectAddCustomField = document.getElementById("add-custom-field");
	selectAddCustomField.options.length = 0;
	var selectAddPriority = document.getElementById("add-priority");
	selectAddPriority.options.length = 0;
	var selectAddCategories = document.getElementById("add-category");
	selectAddCategories.options.length = 0;

	selectAssignedUser.options[selectAssignedUser.options.length] = new Option("None", "");
	for(var i = 0; i < Mantis.ProjectUsers.length; i++) {
		var user = Mantis.ProjectUsers[i];
		selectAssignedUser.options[selectAssignedUser.options.length] = new Option(user.real_name, user.id);
		if(Mantis.CurrentUser.MantisUser.id == user.id) {
			selectAssignedUser.selectedIndex = i + 1;
		}
	}

	if(Kanban.UsingCustomField) {
		for(var i = 0; i < Mantis.ProjectCustomFields.length; i++) {
			var custom_field = Mantis.ProjectCustomFields[i];
			if(custom_field.field.name == Kanban._listIDField) {
				var possiblevalues = custom_field.possible_values.split("|");
				for(var pv = 0; pv < possiblevalues.length; pv++) {
					selectAddCustomField.options[selectAddCustomField.options.length] = new Option(possiblevalues[pv], possiblevalues[pv]);
				}
			}
		}
		document.getElementById("add-custom-field-container").style.display = "block";
	} else {
		document.getElementById("add-custom-field-container").style.display = "none";
	}

	for(var i = 0; i < Mantis.Statuses.length; i++) {
		var status = Mantis.Statuses[i];
		selectAddStatus.options[selectAddStatus.options.length] = new Option(status.name.capitalize(), status.id);
	}
	selectAddStatus.selectedIndex = 0;

	for(var i = 0; i < Mantis.Priorities.length; i++) {
		var priority = Mantis.Priorities[i];
		selectAddPriority.options[selectAddPriority.options.length] = new Option(priority.name.capitalize(), priority.id);
	}
	selectAddPriority.selectedIndex = 0;

	for(var i = 0; i < Mantis.ProjectCategories.length; i++) {
		var category = Mantis.ProjectCategories[i];
		selectAddCategories.options[selectAddCategories.options.length] = new Option(category.capitalize(), category);
	}
	selectAddCategories.selectedIndex = 0;

	$('#story-form').dialog('open');

}


function OpenUserSelector(storyID) {

	var forStory = Kanban.GetStoryByFieldValue("ID", storyID);

	var userRadioDiv = document.getElementById("user-radio");
	while(userRadioDiv.children.length > 0) { userRadioDiv.removeChild(0); }

	for(var ui = 0; ui < Mantis.ProjectUsers.length; ui++) {
		var thisMantisUser = Mantis.ProjectUsers[ui];
		var userRadioInput = document.createElement("input");
		userRadioInput.setAttribute("type", "radio");
		userRadioInput.setAttribute("id", "radiooption" + thisMantisUser.id);
		userRadioInput.setAttribute("name", "user-radio-option");
		userRadioDiv.appendChild(userRadioInput);

		var userRadioInputLabel = document.createElement("label");
		userRadioInputLabel.setAttribute("for", "radiooption" + thisMantisUser.id);
		userRadioInputLabel.innerHTML = thisMantisUser.real_name;
		userRadioDiv.appendChild(userRadioInputLabel);	
	}

	$("#user-radio").buttonset();
	$('#user-selector').dialog('open');

}

/**
 * Displays the edit form of a particular story
 * @param {[type]} storyID ID of the story to edit
 */
function EditStory(storyID) {

	$("#tabs").tabs({
		active: 0
	});

	var thisStory = Kanban.GetStoryByFieldValue("ID", storyID);
	$("#edit-story-form").dialog({ title: "Edit Story: " + thisStory.ID + " " + (thisStory.Summary.length > 40 ? thisStory.Summary.substring(0, 37) + "..." : thisStory.Summary) });
	$("#edit-story-id").val(thisStory.ID);
	$("#edit-summary").val(thisStory.Summary);
	$("#edit-description").val(thisStory.Description);
	$("#edit-reproduce").val(thisStory.Reproduce);

	$("#newnotetext").val("");
	$("#accordion-desc").accordion({
		active: 0
	});
	document.getElementById("edit-story-notes-container").scrollTop = 0;
	document.getElementById("edit-reporter").innerHTML = thisStory.ReporterName;
	document.getElementById("edit-datesubmitted").innerHTML = thisStory.DateSubmitted;

	var selectAssignedUser = document.getElementById("edit-assignedto");
	selectAssignedUser.options.length = 0;
	var selectAddStatus = document.getElementById("edit-status");
	selectAddStatus.options.length = 0;
	var selectAddPriority = document.getElementById("edit-priority");
	selectAddPriority.options.length = 0;

	///Add a blank option
	selectAssignedUser.options[selectAssignedUser.options.length] = new Option("--- Assign To No One ---", "");
	for(var i = 0; i < Mantis.ProjectUsers.length; i++) {
		var user = Mantis.ProjectUsers[i];
		selectAssignedUser.options[selectAssignedUser.options.length] = new Option(user.real_name, user.id);
		if(thisStory.HandlerID !== undefined && user.id == thisStory.HandlerID) {
			selectAssignedUser.selectedIndex = i + 1;
		}
	}

	for(var i = 0; i < Mantis.Statuses.length; i++) {
		var status = Mantis.Statuses[i];
		selectAddStatus.options[selectAddStatus.options.length] = new Option(status.name.capitalize(), status.id);
		if(thisStory.StatusID == status.id) {
			selectAddStatus.selectedIndex = i;
		}
	}

	for(var i = 0; i < Mantis.Priorities.length; i++) {
		var priority = Mantis.Priorities[i];
		selectAddPriority.options[selectAddPriority.options.length] = new Option(priority.name.capitalize(), priority.id);
		if(thisStory.PriorityID == priority.id) {
			selectAddPriority.selectedIndex = i;
		}
	}

	AddNotesToStoryEditForm(thisStory);

	// $("#edit-story-notes-container").accordion();    
	$("#edit-story-form").dialog("open");
}