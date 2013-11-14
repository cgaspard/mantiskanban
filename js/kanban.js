var Kanban = {

	get CurrentProject() {
		for(var i = 0; i < Kanban.Projects.length; i++) {
			if(document.getElementById("seletedproject").value == Kanban.Projects[i].ID) {
				return Kanban.Projects[i];
			}
		}
		return new KanbanProject({ "name": "No Name", "id": 0 });
	},

	get CurrentUser() {
		return Kanban._currentUser;
	}, set CurrentUser(value) {
		Kanban._currentUser = value;
	},

	BlockUpdates: false,
	Dragging: false,
	UsingCustomField: false,
	_listIDField: "ScrumBucket",
	_currentUser : null,

	GetCategoryIcon : function(category) {
		if(Kanban.CategoryIconMap == undefined) {
			return "";
		} else if(Kanban.CategoryIconMap[category] == undefined) {
			return "";
		} else {
			return Kanban.CategoryIconMap[category];
		}
	},

	GetUserByID : function(userid) {
		for(var ui = 0; ui < Kanban.CurrentProject.Users.lenth; ui++) {
			if(Kanban.CurrentProject.Users[ui].ID == userid) return Kanban.CurrentProject.Users[ui];
		}
		return null;
	},

	GetListByID : function(listid) {
		for(var li = 0; li < Kanban.Lists.length; li++) {
			if(Kanban.Lists[li].ID == listid) return Kanban.Lists[li];
		}
		return null;
	},

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

	HasProject: function(id) {
		for(var i = 0; i < Kanban.Projects.length; i++) {
			if(Kanban.Projects[i].ID == id) return true;
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
		CloseAddStory();
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
		var reporterid = document.getElementById("add-reporter").value;
		var statusid = document.getElementById("add-status").value;
		var priorityid = document.getElementById("add-priority").value;
		var category = document.getElementById("add-category").value
		var customfieldvalue = null;
		if(Kanban.UsingCustomField) customfieldvalue = document.getElementById("add-custom-field").value;

		Kanban.AddStory(summary, description, handlerid, reporterid, statusid, priorityid, category, customfieldvalue);
	},

	AddStoryToArray: function(storyToAdd) {
		if(!Kanban.HasStory(storyToAdd.ID)) {
			Kanban.Stories[Kanban.Stories.length] = storyToAdd;
			storyToAdd.BuildKanbanStoryDiv();
			storyToAdd.List.Container.appendChild(storyToAdd.Element);
			storyToAdd.Element.classList.add("fadein");
			//Story.Element.style.display = 'block';
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
		if(foundStory.RelatedStories.length > 0) foundStory.Element.children[1].classList.add("glow");
		for(var rel = 0; rel < foundStory.RelatedStories.length; rel++) {
			var foundRelation = Kanban.GetStoryByFieldValue("ID", foundStory.RelatedStories[rel]);
			foundRelation.Element.children[1].classList.add("glow");
		}
	},

	RemoveGlowToRelatedStories : function(id) {
		var foundStory = Kanban.GetStoryByFieldValue("ID", id);
		if(foundStory.RelatedStories.length > 0) foundStory.Element.children[1].classList.remove("glow");
		for(var rel = 0; rel < foundStory.RelatedStories.length; rel++) {
			var foundRelation = Kanban.GetStoryByFieldValue("ID", foundStory.RelatedStories[rel]);
			foundRelation.Element.children[1].classList.remove("glow");
		}
	},

	BuildListGUI: function() {
		for(var li = 0; li < Kanban.Lists.length; li++) {

			var kanbanListItem = Kanban.Lists[li];

			var existingElement = document.getElementById("listid" + kanbanListItem.ID);
			if(existingElement !== null) continue;

			///The main container
			var listDiv = document.createElement("div");
			kanbanListItem.Element = listDiv;
			listDiv.setAttribute("class", "kanbanlist");
			listDiv.setAttribute("id", "listid" + kanbanListItem.ID);
			listDiv.setAttribute("listid", kanbanListItem.ID);
			listDiv.addEventListener('dragover', HandleDragOver, false);
			listDiv.addEventListener('dragenter', HandleDragEnter, false);
			listDiv.addEventListener("drop", Drop, false);
			listDiv.List = kanbanListItem;

			///The title container
			var listDivTitle = document.createElement("div");
			listDivTitle.setAttribute("class", "kanbanlisttitle");
			listDivTitle.setAttribute("id","kanbanlisttitle"+li)
			listDivTitle.setAttribute("listid", "listid" + kanbanListItem.ID);
			listDivTitle.innerHTML = kanbanListItem.Name.capitalize();
			listDiv.appendChild(listDivTitle);
			
			var listStoryContainer = document.createElement("div");
			listStoryContainer.setAttribute("class", "kanbanliststorycontainer");
			listStoryContainer.setAttribute("id", "kanbanliststorycontainer" + kanbanListItem.ID);
			listDiv.appendChild(listStoryContainer);
			listDiv.Container = listStoryContainer;
			kanbanListItem.Container = listStoryContainer;

			var listTempLoadingGif = document.createElement("div");
			listTempLoadingGif.innerHTML = '<center><div class="tempLoadingDiv"><img src="images/columnLoadingGif.gif"></div></center>';
			listDiv.appendChild(listTempLoadingGif);


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
	if(event.target.id == "kanbancontent") return;
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

	if(sourceElement.Story.CategoryID == null) {
		sourceElement.Story.CategoryID = Mantis.ProjectCategories[0];
	}

	try {

		if(event.target.getAttribute("class") == "kanbanlist" && sourceElement.getAttribute("class").indexOf("storyinfobutton") < 0) {
			listToDropIn = event.target;
			UpdateListForCanbanStory(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
			listToDropIn.Container.insertBefore(sourceElement, listToDropIn.Container.lastChild);
		} else if(event.target.getAttribute("class") == "kanbanlistdroparea") {
			listToDropIn = document.getElementById(event.target.getAttribute("listid"));
			UpdateListForCanbanStory(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
			listToDropIn.Container.appendChild(sourceElement);
		} else if (event.target.getAttribute("class") == "kanbanlisttitle") {
			listToDropIn = document.getElementById(event.target.getAttribute("listid"));
			UpdateListForCanbanStory(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
			listToDropIn.Container.insertBefore(sourceElement, listToDropIn.Container.firstChild);
		} else {
			listToDropIn = document.getElementById(event.target.getAttribute("listid"));
			UpdateListForCanbanStory(sourceElement.Story, listToDropIn.List, UpdateKanbanStoryComplete)
			sourceElementDropDiv.classList.remove("over");
			if(targetStoryDiv !== undefined && targetStoryDiv != null) {
				listToDropIn.Container.insertBefore(sourceElement, targetStoryDiv);
			} else {
				listToDropIn.Container.appendChild(sourceElement);
			}
		}

		sourceElement.setAttribute("listid", listToDropIn.getAttribute("id"));
		sourceElementDropDiv.setAttribute("listid", listToDropIn.getAttribute("id"));

	} catch(e) {
		console.log(e);
		alert("Error:" + e.message);
		Kanban.BlockUpdates = false;
		StopLoading();
	} finally {
		ClearAllDragHoverAreas();
	}

}

function MoveKanbanStoryToProperList(kanbanStory) {
	// //Kanban.UsingCustomField && foundStory.List.ID != foundStory.ListID) || (!Kanban.UsingCustomField && 
	var thisList = null;
	thisList = Kanban.GetListByID(kanbanStory.StorySource.status.id);
	thisList.AddNewStoryUI(kanbanStory);
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


				var foundStory = Kanban.UpdateUnderlyingStorySource(foundStory);

				///Move it to the new location first before we rebuild the gui
				if(foundStory.List.ID != document.getElementById(foundStory.Element.getAttribute("listid")).List.ID) {
					MoveKanbanStoryToProperList(foundStory);
				}

				foundStory.BuildKanbanStoryDiv();
				foundStory.Element.classList.add("nofadein");


				/// Make sure the list is still valid
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
		thisStory.ProjectID = document.getElementById("edit-project").value;
		thisStory.ReporterID = document.getElementById("edit-reporter").value;
		thisStory.PriorityID = document.getElementById("edit-priority").value;
		thisStory.StatusID = document.getElementById("edit-status").value;
		thisStory.Reproduce = document.getElementById("edit-reproduce").value;
		thisStory.CategoryID = document.getElementById("edit-category").value;
		Mantis.IssueUpdate(thisStory.ID, thisStory.StorySource, UpdateKanbanStoryComplete);

		CloseEditStory();
	} catch(e) {
		console.log(e);
		alert("Error:" + e.message);
		Kanban.BlockUpdates = false;
		StopLoading();
	} finally {

	}
}

function UpdateStoryStatusWhenCustomFieldUpdated(UpatedStory, CustomFieldName, CustomFieldValue) {
	if(Kanban.AutoStatusOnCustomField[CustomFieldName][CustomFieldValue] != undefined) {
		Mantis.UpdateStructureMethods.Issue.UpdateStatus(UpatedStory.StorySource, Kanban.AutoStatusOnCustomField[CustomFieldName][CustomFieldValue], "");
	}
}

function UpdateListForCanbanStory(KanbanStoryToUpdate, KanbanListToMoveTo, UpdateKanbanStoryCallback) {
	var updateIssue = null;
	if(KanbanStoryToUpdate.UsesCustomField) {
		UpdateStoryStatusWhenCustomFieldUpdated(KanbanStoryToUpdate, Kanban._listIDField, KanbanListToMoveTo.ID);
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

var previousDragOverItem = null;

function HandleDragOver(e) {
	if(e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}

	if(e.target.getAttribute("id") == "kanbancontent") {
		ClearAllDragHoverAreas();
		return false;
	}

	e.dataTransfer.dropEffect = 'move';
	var storyID = e.target.getAttribute("storyid");
	if(storyID != e.target.getAttribute("id")) {
		var dropDiv = document.getElementById(e.target.getAttribute("dropdivid"));
		if(storyID == previousDragOverItem) return false;

		previousDragOverItem = storyID;
		ClearAllDragHoverAreas();
		if(dropDiv != null) dropDiv.classList.add("over");
	}	
	return false;
}

function HandleDragEnter(e) {
	//ClearAllDragHoverAreas();
	//console.log("HandleDragEnter: StoryID: " + e.target.getAttribute("storyid") + "  ID: " + e.target.id);
}

function HandleDragLeave(e) {
	var storyID = e.target.getAttribute("storyid");
	if(storyID != previousDragOverItem) return false;

	if(!e.target.classList.contains("kanbanstorycontainer")) return false;
	
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
		editStory = Kanban.UpdateUnderlyingStorySource(editStory, true);
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


function AddAttachmentToStoryEditForm(KanbanStory) {
	var attachmentsContainer = document.getElementById("edit-story-attachment-container");

	try {
		while(attachmentsContainer.childNodes.length > 0) {
			attachmentsContainer.removeChild(attachmentsContainer.firstChild);
		}
	} catch(e) {}

	/// This is what an attachment looks like
	//  <xsd:element name="id" type="xsd:integer" minOccurs="0"/>
	// <xsd:element name="filename" type="xsd:string" minOccurs="0"/>
	// <xsd:element name="size" type="xsd:integer" minOccurs="0"/>
	// <xsd:element name="content_type" type="xsd:string" minOccurs="0"/>
	// <xsd:element name="date_submitted" type="xsd:dateTime" minOccurs="0"/>
	// <xsd:element name="download_url" type="xsd:anyURI" minOccurs="0"/>
	// <xsd:element name="user_id" type="xsd:integer" minOccurs="0"/>

	if(KanbanStory.Attachments === undefined) return;

	for(var i = 0; i < KanbanStory.Attachments.length; i++) {
		var thisAttachment = KanbanStory.Attachments[i];

		if(thisAttachment.content_type.match("image")) {

			/*
			var attachmentLink = document.createElement("a");
			attachmentLink.setAttribute("data-toggle", "lightbox");
			attachmentLink.setAttribute("data-target", "#attachmentlightboxdiv" + thisAttachment.id);
			attachmentLink.setAttribute("href", "#attachmentlightboxdiv" + thisAttachment.id);
			attachmentsContainer.appendChild(attachmentLink);
			*/
			var attachmentDiv = document.createElement("div");
			attachmentDiv.setAttribute("class", "attachmentcontainer");
			attachmentDiv.setAttribute("storyid", KanbanStory.ID);

			var attachmentImage = document.createElement("img");
			attachmentImage.setAttribute("id", "attachment" + thisAttachment.id);
			attachmentImage.setAttribute("src", "images/loading.gif");
			attachmentImage.setAttribute("class", "kanbanimageattachment");
			attachmentImage.setAttribute("onclick", "OpenLightBox('#attachment" + thisAttachment.id + "');");
			Mantis.IssueAttachmentGet(thisAttachment.id, thisAttachment.content_type, function(result, attachmentID, attachementContentType){
				var foundAttachmentImage = document.getElementById("attachment" + attachmentID);
				var resultText = "";
				resultText = result["#text"];
				if(resultText == undefined) resultText = result;
				//console.log("ATTACHMENT ID " + attachmentID + ": " + resultText);
				foundAttachmentImage.setAttribute("src", "data:" + attachementContentType + ";base64," + resultText);
			});

			attachmentDiv.appendChild(attachmentImage);
			//attachmentLink.appendChild(attachmentImage);
			attachmentsContainer.appendChild(attachmentDiv);

		} else {
			var attachmentDiv = document.createElement("div");
			attachmentDiv.setAttribute("class", "attachmentcontainer");
			attachmentDiv.setAttribute("storyid", KanbanStory.ID);

			var attachmentFileName = document.createElement("div");
			attachmentFileName.setAttribute("id", "attachment" + thisAttachment.id);
			attachmentFileName.setAttribute("class", "attachmentname");
			attachmentFileName.innerHTML = thisAttachment.filename;
			Mantis.IssueAttachmentGet(thisAttachment.id, thisAttachment.content_type, function(result, attachmentID, attachementContentType){
				var foundAttachmentDiv = document.getElementById("attachment" + attachmentID);
				var resultText = "";
				resultText = result["#text"];
				if(resultText == undefined) resultText = result;
				//console.log("ATTACHMENT ID " + attachmentID + ": " + resultText);
				foundAttachmentDiv.setAttribute("onclick", "window.open('data:application/octet-stream;base64,"+ resultText + "');");
			});			
			attachmentDiv.appendChild(attachmentFileName);

			//window.open("data:application/octet-stream;base64," + base64);

			attachmentsContainer.appendChild(attachmentDiv);	
		}

		
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

	noteSaveButton.setAttribute("onclick", "SaveNewNote(" + KanbanStory.ID + ", document.getElementById('edit-newnotetext').value);")

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
		noteTextDiv.innerHTML = "<pre>" + thisNote.text + "</pre>";
		noteDiv.appendChild(noteTextDiv);

		notesContainer.appendChild(noteDiv);
	}
}


function OpenAddStory() {
	log("OpenAddStory Called");

	$("#add-summary").val("");
	$("#add-description").val("");
	//document.getElementById("add-summary").value = "";
	//document.getElementById("add-description").value = "";

	var selectReportingUser = document.getElementById("add-reporter");
	selectReportingUser.options.length = 0;
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

	for(var i = 0; i < Kanban.CurrentProject.Users.length; i++) {
		var user = Kanban.CurrentProject.Users[i];
		selectReportingUser.options[selectReportingUser.options.length] = new Option(user.Name, user.ID);
		if(Kanban.CurrentUser.ID == user.ID) {
			selectReportingUser.selectedIndex = i;
		}
	}

	selectAssignedUser.options[selectAssignedUser.options.length] = new Option("None", "");
	for(var i = 0; i < Kanban.CurrentProject.Users.length; i++) {
		var user = Kanban.CurrentProject.Users[i];
		selectAssignedUser.options[selectAssignedUser.options.length] = new Option(user.Name, user.ID);
	}
	selectAssignedUser.selectedIndex = 0

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
		$("#add-custom-field-container").show();
	} else {
		$("#add-custom-field-container").hide();
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

	var foundDefaultCategory = false;
	for(var i = 0; i < Mantis.ProjectCategories.length; i++) {
		var category = Mantis.ProjectCategories[i];
		selectAddCategories.options[selectAddCategories.options.length] = new Option(category.capitalize(), category);
		if(Kanban.DefaultCategory != undefined) {
			if(Kanban.DefaultCategory == category) {
				foundDefaultCategory = true;
				selectAddCategories.selectedIndex = i;
			}
		}
	}
	if(!foundDefaultCategory) selectAddCategories.selectedIndex = 0;

	ShowAddStory();
}

function UpdateStoryHandler(storyID, handlerID) {

	Kanban.BlockUpdates = true;
	StartLoading();

	try {

		var kanbanStory = Kanban.GetStoryByFieldValue("ID", storyID);

		kanbanStory.HandlerID = handlerID;
		Kanban.LastUpdateStoryID = kanbanStory.ID;
		Mantis.IssueUpdate(kanbanStory.ID, kanbanStory.StorySource, UpdateStoryHandlerComplete)
		$("#user-context-menu").hide();

	} catch(e) {
		alert(e);
		Kanban.BlockUpdates = false;
		StopLoading();
	} finally {
	}

}

function UpdateStoryHandlerComplete(result) {
	console.log("UpdateKanbanStoryComplete " + result);
	Kanban.BlockUpdates = false;
	StopLoading();
	if(result != "true") {
		alert("Error Updating: " + result);
	} else {
		try {
			var foundStory = Kanban.GetStoryByFieldValue("ID", Kanban.LastUpdateStoryID);
			if(foundStory !== null) {
				foundStory = Kanban.UpdateUnderlyingStorySource(foundStory);
			
				if(foundStory.ProjectID != Kanban.CurrentProject.ID) {
					foundStory.Element.parentNode.removeChild(foundStory.Element);
					return;
				}

				///If its null, then we werent' editing the story, just dropping between the lists
				
				//var newFoundStory = Kanban.GetStoryByFieldValue("ID", foundStory.ID);
				foundStory.BuildKanbanStoryDiv();
				foundStory.JoinList();
				foundStory.Element.classList.add("nofadein");
			}
		} catch(e) {
			console.log(e);
		}

		Kanban.UndoInfo.ListDiv = null;
		Kanban.UndoInfo.StoryDiv = null;
	}
}

/**
 * Displays the edit form of a particular story
 * @param {[type]} storyID ID of the story to edit
 */
function EditStory(storyID) {

	$('#myTab a:first').tab('show');

	//$("#tabs").tabs({
	 	//active: 0
	//});

	var thisStory = Kanban.GetStoryByFieldValue("ID", storyID);
	document.getElementById("edit-story-title").innerHTML = "Edit Story: " + thisStory.ID + " " + (thisStory.Summary.length > 40 ? thisStory.Summary.substring(0, 37) + "..." : thisStory.Summary);
	//$("#edit-story-form").dialog({ title: "Edit Story: " + thisStory.ID + " " + (thisStory.Summary.length > 40 ? thisStory.Summary.substring(0, 37) + "..." : thisStory.Summary) });
	$("#edit-story-id").val(thisStory.ID);
	$("#edit-summary").val(thisStory.Summary);
	$("#edit-description").val(thisStory.Description);
	$("#edit-reproduce").val(thisStory.Reproduce);

	$("#edit-newnotetext").val("");

	document.getElementById("edit-story-notes-container").scrollTop = 0;
	document.getElementById("edit-datesubmitted").innerHTML = thisStory.DateSubmitted;

	var selectReportingUser = document.getElementById("edit-reporter");
	selectReportingUser.options.length = 0;
	var selectAssignedUser = document.getElementById("edit-assignedto");
	selectAssignedUser.options.length = 0;
	var selectAddStatus = document.getElementById("edit-status");
	selectAddStatus.options.length = 0;
	var selectEditCategory = document.getElementById("edit-category");
	selectEditCategory.options.length = 0;
	var selectAddPriority = document.getElementById("edit-priority");
	selectAddPriority.options.length = 0;
	var selectStoryProject = document.getElementById("edit-project");
	selectStoryProject.options.length = 0;


	for(var i = 0; i < Kanban.Projects.length; i++) {
		var project = Kanban.Projects[i];
		selectStoryProject.options[selectStoryProject.options.length] = new Option(project.Name, project.ID);
		if(thisStory.ProjectID !== undefined && project.ID == thisStory.ProjectID) {
			selectStoryProject.selectedIndex = i;
		}
	}

	for(var i = 0; i < Kanban.CurrentProject.Users.length; i++) {
		var user = Kanban.CurrentProject.Users[i];
		selectReportingUser.options[selectReportingUser.options.length] = new Option(user.Name, user.ID);
		if(thisStory.ReporterID !== undefined && user.ID == thisStory.ReporterID) {
			selectReportingUser.selectedIndex = i;
		}
	}

	///Add a blank option
	selectAssignedUser.options[selectAssignedUser.options.length] = new Option("--- Assign To No One ---", "");
	for(var i = 0; i < Kanban.CurrentProject.Users.length; i++) {
		var user = Kanban.CurrentProject.Users[i];
		selectAssignedUser.options[selectAssignedUser.options.length] = new Option(user.Name, user.ID);
		if(thisStory.HandlerID !== undefined && user.ID == thisStory.HandlerID) {
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

	for(var i = 0; i < Mantis.ProjectCategories.length; i++) {
		var category = Mantis.ProjectCategories[i];
		if(category == null) category = "";
		selectEditCategory.options[selectEditCategory.options.length] = new Option(category.capitalize(), category);
		if(thisStory.CategoryID == category) {
			selectEditCategory.selectedIndex = i;
		}
	}

	AddNotesToStoryEditForm(thisStory);

	AddAttachmentToStoryEditForm(thisStory);

	//$('#edit-story-form').modal();
	ShowEditStory();

}

function ShowPriorityLegend() {
	document.getElementById("contentarea").setAttribute("showingpriority", "true");	
}

function HidePriorityLegend() {
	document.getElementById("contentarea").setAttribute("showingpriority", "false");	
}

Kanban.SaveSettings = function() {
	//modifyStyleRule(selectorText, value)
	DefaultSettings.kanbanListWidth = document.getElementById("settings-list-width").value;
	DefaultSettings.connectURL = document.getElementById("settings-connectURL").value;
	saveSettingsToStorageMechanism();
	Kanban.ApplySettings();
}

Kanban.ApplySettingsAtLogin = function() {
	modifyStyleRule(".kanbanlist", "width", DefaultSettings.kanbanListWidth);
}

Kanban.ApplySettings = function() {
	var listWidthValue = document.getElementById("settings-list-width").value;
	modifyStyleRule(".kanbanlist", "width", listWidthValue);
	document.getElementById("mantisURL").value = DefaultSettings.connectURL;
}

Kanban.LoadRuntimeSettings = function() {
	document.getElementById("settings-list-width").value = getStyleRule(".kanbanlist", "width");	
	document.getElementById("settings-connectURL").value = DefaultSettings.connectURL;
}

function ShowSettings() {
	CloseAddStory();
	CloseEditStory();
	Kanban.LoadRuntimeSettings();
	document.getElementById("edit-settings-form").style.display = "inline-block";
	document.getElementById("settings-connectURL").value = DefaultSettings.connectURL;
	document.getElementById("kanbancontent").setAttribute("editing", "true");
}

function CloseSettings() {
	document.getElementById("kanbancontent").setAttribute("editing", "false");	
	document.getElementById("edit-settings-form").style.display = "none";
}

function ShowEditStory() {
	CloseAddStory();
	CloseSettings();
	document.getElementById("edit-story-form").style.display = "inline-block";
	document.getElementById("kanbancontent").setAttribute("editing", "true");	
}

function ShowAddStory() {
	CloseEditStory();
	CloseSettings();
	document.getElementById("add-story-form").style.display = "inline-block";
	document.getElementById("kanbancontent").setAttribute("editing", "true");		
}

function CloseEditStory() {
	document.getElementById('kanbancontent').setAttribute('editing', 'false');
	document.getElementById("edit-story-form").style.display = "none";
}

function CloseAddStory() {
	document.getElementById('kanbancontent').setAttribute('editing', 'false');
	document.getElementById("add-story-form").style.display = "none";

}