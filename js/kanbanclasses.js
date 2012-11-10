Kanban.AddStory = function(summary, description, handlerid, statusid, priorityid, category, customfield) {
	var newIssueStruct = Mantis.UpdateStructureMethods.Issue.NewIssue(summary, description, Mantis.CurrentProjectID, handlerid, statusid, priorityid, category);
	if(customfield !== null) {
		Mantis.UpdateStructureMethods.Issue.UpdateCustomField(newIssueStruct, Kanban._listIDField, customfield);
	}
  Mantis.IssueAdd(newIssueStruct, Kanban.AddStoryAsyncCallback);
};

Kanban.AddStoryAsyncCallback = function(result) {
	Kanban.BlockUpdates = false;
	StopLoading();
	if(isNaN(result)) {
			alert("Error Adding: " + result);
	} else {
			try {
					var newStory = new KanbanStory(Mantis.IssueGet(result));
					newStory.BuildKanbanStoryDiv();
					newStory.List.AddNewStoryUI(newStory);
					Kanban.CloseAddStoryDialog();
			} catch (e) { console.log(e); }
	}	
};

Kanban.UpdateUnderlyingStorySource = function(originalStory) {
    var mantisIssue = Mantis.IssueGet(originalStory.ID);
    originalStory.StorySource = mantisIssue;
    return originalStory;
};


Kanban.UpdateStory = function() {
	
};


var KanbanProject = function(RawObject) {
	if(typeof(RawObject == "string")){
		this.ProjectSource = { "name" : RawObject, "id" : RawObject };
	} else {
		this.ProjectSource = RawObject;
	}
	this._lists = [];
}
KanbanProject.prototype = {
	get Lists() {
		return this._lists;
	},
	get Name() {
		return this.ProjectSource.name;
	},
	get ID () {
		return this.ProjectSource.id;
	}
}

var KanbanList = function(RawObject){
	if(typeof(RawObject) == "string"){
		this.ListSource = { "name" : RawObject, "id" : RawObject };
	} else {
		this.ListSource = RawObject;
	}
	this._stories = [];
	this.Element = null;
	this.UsesCustomField = false;
}
KanbanList.prototype = {
	
	get Stories() {
		return this._stories;
	},
	set Stories(value) {
		this._stories = value;	
	},
	
	get Name() { return this.ListSource.name; },
	set Name(value) { this.ListSource.name = value; },
	
	get ID() { return this.ListSource.id; },
	set ID(value) { this.ListSource.id = value; },
	
	AddNewStoryUI: function(Story) {
		this.Element.insertBefore(Story.Element, this.Element.lastChild);
	}
}


var KanbanStory = function(RawObject) {
    this._list = null;
		this.StorySource = RawObject;
		//alert(JSON.stringify(RawObject.notes))
		this.UsesCustomField = false;
		this.JoinList();
		Kanban.Stories[Kanban.Stories.length] = this;
		
		
}
KanbanStory.prototype = {

		get List() { return this._list; },
		set List(value) { this._list = value; },

		get ID() { return this.StorySource.id; },
		set ID(value) { this.StorySource.id = value; },
		
    get ListID() {
			if(this.UsesCustomField) {
				for(var ci =0; ci < this.StorySource.custom_fields.length; ci++) {
					if(this.StorySource.custom_fields[ci].field.name == Kanban._listIDField) {
						return this.StorySource.custom_fields[ci].value
					}
				}
			}
			return this.StorySource.status.id
		},
		
    get StatusID() { return this.StorySource.status.id; },
		set StatusID(value) { this.StorySource.status.id = value },
		
		get StatusName() { return this.StorySource.status.name; },
		set StatusName(value) { this.StorySource.status.name = value },
		
    get Notes() { return this.StorySource.notes; },
    
		get Description() { return this.StorySource.description; },
		set Description(value) { this.StorySource.description = value; },
    
		get Reproduce() { return this.StorySource.steps_to_reproduce; },
		set Reproduce(value)  { this.StorySource.steps_to_reproduce = value; },
		
		get HandlerID() { return this.StorySource.handler !== undefined ? this.StorySource.handler.id : ""; },
		set HandlerID(value) {
			
			if(value === null && this.StorySource.handler === undefined) {
				return;
			} else if( value === null && this.StorySource.handler !== undefined) {
				delete this.StorySource.handler;
			}
			
			if(this.StorySource.handler === undefined) {
				this.StorySource.handler = { "name" : "", "id" : "" };
			}
			this.StorySource.handler.id = value;
		},
		
		get HandlerName() { return this.StorySource.handler !== undefined ? this.StorySource.handler.name : ""; },
		set HandlerName(value) {
			if(this.StorySource.handler === undefined) {
				this.StorySource.handler = { "name" : "", "id" : "" };
			}
			this.StorySource.handler.name = value;
		},
		
		get ReporterName() { return this.StorySource.reporter.name; },
		set ReporterName(value) { this.StorySource.reporter.name = value; },
		
		get ReporterID() { return this.StorySource.reporter.id; },
		set ReporterID(value) { this.StorySource.reporter.id = value; }, 
		
		get PriorityName() { return this.StorySource.priority.name; },
		set PriorityName(value) { this.StorySource.priority.name = value; },
		
		get PriorityID() { return this.StorySource.priority.id; },
		set PriorityID(value) { this.StorySource.priority.id = value; },
    
		get Summary() { return this.StorySource.summary },
		set Summary(value) { this.StorySource.summary = value; },
    
		JoinList : function() {
			for(var li = 0; li < Kanban.Lists.length; li++){
				var thisList = Kanban.Lists[li];
				if(thisList.UsesCustomField)  {
					for(var ci =0; ci < this.StorySource.custom_fields.length; ci++) {
						if(this.StorySource.custom_fields[ci].field.name == Kanban._listIDField) {
							if(this.StorySource.custom_fields[ci].value == thisList.ID) {
								this._list = thisList;
								this._list.Stories[this.List.Stories.length] = this;
								this.UsesCustomField = true;
								return;
							}
						}
					}
				} else {
					if(Kanban.Lists[li].ID == this.StorySource.status.id) {
							this._list = Kanban.Lists[li];
							this._list.Stories[this.List.Stories.length] = this;
							return;
					}
				}
			}
		},
		
		Save : function() {
        this.StorySource.summary = this.Summary;
        this.StorySource.status.id = this.List.ID;
    },
		
		Refresh : function() {
			
		},
		
		BuildKanbanStoryDiv : function() {
			
			if(this.Element != null) { return this.Element; }
			
			var storyDiv = document.createElement("div");
			storyDiv.Story = this;
			this.Element = storyDiv;
			
			storyDiv.setAttribute("id", "storydiv" + this.ID);
			storyDiv.setAttribute("listid", "listid" + this.ListID);
			storyDiv.setAttribute("storyid", "storydiv" + this.ID);
			storyDiv.setAttribute("dropdivid", "dropdiv" + this.ID);
			storyDiv.setAttribute("draggable", "true");
			storyDiv.setAttribute("onclick", "EditStory('" + this.ID + "');");
	
			storyDiv.addEventListener('dragstart', DragStart, false);
			storyDiv.addEventListener("dragend", DragEnd, false);
	
			storyDiv.addEventListener('dragenter', HandleDragEnter, false);
			storyDiv.addEventListener('dragover', HandleDragOver, false);
			storyDiv.addEventListener('dragleave', HandleDragLeave, false);
	
			storyDiv.addEventListener('drop', Drop, false);
	
			var dropDiv = document.createElement("div");
			dropDiv.setAttribute("class", "kanbandropper");
			dropDiv.setAttribute("id", "dropdiv" + this.ID); 
			dropDiv.setAttribute("listid", "listid" + this.ListID);
			dropDiv.setAttribute("storyid", "storydiv" + this.ID);
			dropDiv.setAttribute("dropdivid", "dropdiv" + this.ID);
			//dropDiv.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
			storyDiv.appendChild(dropDiv);
	
			var storyContainerDiv = document.createElement("div");
			storyContainerDiv.setAttribute("class", "kanbanstory");
			storyContainerDiv.setAttribute("id", "storycontainer" + this.ID);
			storyContainerDiv.setAttribute("listid", "listid" + this.ListID);
			storyContainerDiv.setAttribute("storyid", "storydiv" + this.ID);
			storyContainerDiv.setAttribute("dropdivid", "dropdiv" + this.ID);
			if(this.HandlerName == Mantis.CurrentUser.UserName) {
					storyContainerDiv.classList.add("mystory");
			}
			storyContainerDiv.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
			storyDiv.appendChild(storyContainerDiv);
	
			var storyDivSeverity = document.createElement("div");
			storyDivSeverity.setAttribute("class", "kanbanstoryseverity kanbanstorypriority");
			storyDivSeverity.setAttribute("id", "storyseverity" + this.ID);
			storyDivSeverity.setAttribute("priority", this.PriorityName);
			storyDivSeverity.setAttribute("listid", "listid" + this.ListID);
			storyDivSeverity.setAttribute("storyid", "storydiv" + this.ID);
			storyDivSeverity.setAttribute("dropdivid", "dropdiv" + this.ID);
			storyDivSeverity.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
			storyContainerDiv.appendChild(storyDivSeverity);
	
			var storyDivTitle = document.createElement("div");
			storyDivTitle.innerHTML = this.Summary;
			storyDivTitle.setAttribute("class", "kanbanstorytitle");
			storyDivTitle.setAttribute("id", "storytitle" + this.ID);
			storyDivTitle.setAttribute("onclick", "EditStory('" + this.ID + "');");
			storyDivTitle.setAttribute("listid", "listid" + this.ListID);
			storyDivTitle.setAttribute("storyid", "storydiv" + this.ID);
			storyDivTitle.setAttribute("dropdivid", "dropdiv" + this.ID);
			storyDivTitle.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
			storyContainerDiv.appendChild(storyDivTitle);
			
			var storyDivButton = document.createElement("img");
			storyDivButton.setAttribute("src", "images/info.png");
			storyDivButton.setAttribute("id", "storydivbutton" + this.ID);
			storyDivButton.setAttribute("class", "storyinfobutton");
			storyDivButton.setAttribute("onclick", "EditStory('" + this.ID + "');");
			storyDivButton.setAttribute("listid", "listid" + this.ListID);
			storyDivButton.setAttribute("storyid", "storydiv" + this.ID);
			storyDivButton.setAttribute("dropdivid", "dropdiv" + this.ID);
			//storyDivButton.setAttribute("draggable", false);
			storyDivButton.addEventListener('dragleave', function(event) {event.stopPropagation();}, false);
			storyContainerDiv.appendChild(storyDivButton);
	
			return storyDiv;
		}	
}
