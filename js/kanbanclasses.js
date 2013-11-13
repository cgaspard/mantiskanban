var KanbanUser = function(RawObject) {
	var self = this;
	if(typeof(RawObject) == "string") {
		self.UserSource = JSON.parse(RawObject);
	} else {
		self.UserSource = RawObject;
	}
}

KanbanUser.prototype = {
	get UserName() {
		return this.UserSource.name;
	}, set UserName(value) {
		this.UserSource.name = value;
	},

	get Password() {
		return this.UserSource.password;
	}, set Password(value) {
		this.UserSource.password = value;
	},

	get Name() {
		return this.UserSource.real_name;
	}, set Name(value) {
		this.UserSource.real_name = value;
	},

	get ID () {
		return this.UserSource.id;
	}
}

var KanbanProject = function(RawObject) {
	var self = this;
	if(typeof(RawObject) == "string") {
		self.ProjectSource = {
			"name": RawObject,
			"id": RawObject
		};
	} else {
		self.ProjectSource = RawObject;
	}
	self._lists = [];
}

KanbanProject.prototype = {
	get Lists() {
		return this._lists;
	},

	get Name() {
		return this.ProjectSource.name;
	},

	get ID() {
		return this.ProjectSource.id;
	},

	HasFilterID : function() {
		
	},

	get Users() {
		var mantisUsers = Mantis.ProjectUsers
		var userList = new Array();
		for(var ul = 0; ul < mantisUsers.length; ul++) {
			userList.push(new KanbanUser(mantisUsers[ul]));
		}
		return userList;
	}
}

var KanbanList = function(RawObject) {
		if(typeof(RawObject) == "string") {
			this.ListSource = {
				"name": RawObject,
				"id": RawObject
			};
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
	}, set Stories(value) {
		this._stories = value;
	},

	get Name() {
		return this.ListSource.name;
	}, set Name(value) {
		this.ListSource.name = value;
	},

	get ID() {
		return this.ListSource.id;
	}, set ID(value) {
		this.ListSource.id = value;
	},

	AddNewStoryUI: function(Story) {
		this.Container.appendChild(Story.Element);
		Story.Element.classList.add("fadein");
		//Story.Element.style.display = 'block';
	},

	/*
	 * @name AddStory
	 * @param {KanbanStory} Story The story you want to add.
	 * @returns {null} Doesn't return anything
	 */
	AddStory: function(Story) {
		if(!this.HasStory(Story.ID)) {
			this._stories[this._stories.length] = Story;
		}
	},

	/*
	 * @name HasStory
	 * @param {int} id The ID of the story to look for
	 * @returns {boolean} Returns true if the story is already loaded into the "Mantis.Stories" array.
	 */
	HasStory: function(id) {
		for(var i = 0; i < this._stories.length; i++) {
			if(this._stories[i].ID == id) return true;
		}
		return false;
	},

}

var KanbanStory = function(RawObject) {
	this._list = null;
	this.StorySource = RawObject;
	//alert(JSON.stringify(RawObject.notes))
	this.UsesCustomField = false;
	this.JoinList();
	if(!Kanban.HasStory(this.ID)) {
		Kanban.AddStoryToArray(this);
	}
}

KanbanStory.prototype = {

	get ID() {
		return this.StorySource.id;
	}, set ID(value) {
		this.StorySource.id = value;
	},

	get List() {
		for(var li = 0; li < Kanban.Lists.length; li++) {
			var kanbanList = Kanban.Lists[li];
			if(Kanban.UsesCustomField) {
				for(var ci = 0; ci < this.StorySource.custom_fields.length; ci++) {
					if(this.StorySource.custom_fields[ci].field.name == Kanban._listIDField) {
						if(this.StorySource.custom_fields[ci].value == kanbanList.ID) {
							return kanbanList;
						}
					}
				}
			} else {
				if(kanbanList.ID == this.StatusID) {
					return kanbanList;
				}
			}				
		}
		return null;
	},
	set List(value) {
		if(Kanban.UsesCustomField) {
			for(var ci = 0; ci < this.StorySource.custom_fields.length; ci++) {
				if(this.StorySource.custom_fields[ci].field.name == Kanban._listIDField) {
					this.StorySource.custom_fields[ci].value == value.ID;
				}
			}
		} else {
			this.StatusID = value.ID;
		}				
	},

	get ListID() {
		return this.List.ID;
	},

	get ProjectID() {
		return this.StorySource.project.id;
	},
	set ProjectID(value) {
		this.StorySource.project.id = value
	},

	get CategoryID() {
		return this.StorySource.category;
	},
	set CategoryID(value) {
		this.StorySource.category = value;
	},

	get ProjectName() {
		return this.StorySource.project.name;
	}, 
	set ProjectName(value) {
		this.StorySource.project.name = value
	},


	get StatusID() {
		return this.StorySource.status.id;
	},
	set StatusID(value) {
		this.StorySource.status.id = value
	},

	get RelatedStories() {
		var rels = new Array();
		if(this.StorySource.relationships === undefined) return rels;
		for(var ra = 0; ra < this.StorySource.relationships.length; ra++) {
			var thisRel = this.StorySource.relationships[ra];
			rels[rels.length] = thisRel.target_id;
		}
		return rels;
	},

	get StatusName() {
		return this.StorySource.status.name;
	}, set StatusName(value) {
		this.StorySource.status.name = value
	},

	get Notes() {
		return this.StorySource.notes;
	},

	get Attachments() {
		return this.StorySource.attachments;
	},
	

	get Description() {
		return this.StorySource.description;
	}, set Description(value) {
		this.StorySource.description = value;
	},

	get Reproduce() {
		return this.StorySource.steps_to_reproduce;
	}, set Reproduce(value) {
		this.StorySource.steps_to_reproduce = value;
	},

	get DateSubmitted() {
		return new Date(Date.parse(this.StorySource.date_submitted));
	},

	get HandlerID() {
		return this.StorySource.handler !== undefined ? this.StorySource.handler.id : "";
	}, 

	set HandlerID(value) {
		if(value === null && this.StorySource.handler === undefined) {
			return;
		} else if(value === null && this.StorySource.handler !== undefined) {
			delete this.StorySource.handler;
		}

		if(this.StorySource.handler === undefined) {
			this.StorySource.handler = {
				"name": "",
				"id": ""
			};
		}
		this.StorySource.handler.id = value;
	},

	get HandlerName() {
		return this.StorySource.handler !== undefined ? this.StorySource.handler.name : "";
	}, set HandlerName(value) {
		if(this.StorySource.handler === undefined) {
			this.StorySource.handler = {
				"name": "",
				"id": ""
			};
		}
		this.StorySource.handler.name = value;
	},

	get ReporterName() {
		return this.StorySource.reporter.name;
	}, set ReporterName(value) {
		this.StorySource.reporter.name = value;
	},

	get ReporterID() {
		return this.StorySource.reporter.id;
	}, set ReporterID(value) {
		this.StorySource.reporter.id = value;
	},

	get PriorityName() {
		return this.StorySource.priority.name;
	}, set PriorityName(value) {
		this.StorySource.priority.name = value;
	},

	get PriorityID() {
		return this.StorySource.priority.id;
	}, set PriorityID(value) {
		this.StorySource.priority.id = value;
	},

	get Summary() {
		return this.StorySource.summary
	}, set Summary(value) {
		this.StorySource.summary = value;
	},

	/*
	 * @name JoinList
	 * @description Adds the story to a KanbanList.Stories array
	 */
	JoinList: function() {
		for(var li = 0; li < Kanban.Lists.length; li++) {
			var thisList = Kanban.Lists[li];
			var foundListToDropIn = false;
			if(thisList.UsesCustomField) {
				for(var ci = 0; ci < this.StorySource.custom_fields.length; ci++) {
					if(this.StorySource.custom_fields[ci].field.name == Kanban._listIDField) {
						if(this.StorySource.custom_fields[ci].value == thisList.ID) {
							this._list = thisList;
							this._list.AddStory(this);
							this.UsesCustomField = true;
							foundListToDropIn = true;
							return;
						}
					}
				}
				if(!foundListToDropIn) {
					/// Hack to drop issues without a value assigned in their custom field into the first bucket.
					this._list = Kanban.Lists[0];
					Kanban.Lists[0].AddStory(this);
					this.UsesCustomField = true;
				}
			} else {
				if(Kanban.Lists[li].ID == this.StorySource.status.id) {
					this._list = Kanban.Lists[li];
					this._list.AddStory(this);
					return;
				}
			}
		}
	},

	Save: function() {
		this.StorySource.summary = this.Summary;
		this.StorySource.status.id = this.List.ID;
	},

	Delete: function() {
		this.Element.parentNode.removeChild(this.Element);
	},

	BuildKanbanStoryDiv: function() {

		var storyDiv = document.createElement("div");
		storyDiv.Story = this;

		if(this.ListID == null) {
			this.List = Kanban.Lists[0];
		}

		storyDiv.setAttribute("id", "storydiv" + this.ID);
		storyDiv.setAttribute("listid", "listid" + this.ListID);
		storyDiv.setAttribute("class", "kanbanstorycontainer");
		storyDiv.setAttribute("storyid", "storydiv" + this.ID);
		storyDiv.setAttribute("dropdivid", "dropdiv" + this.ID);
		storyDiv.setAttribute("draggable", "true");
		storyDiv.setAttribute("onclick", "EditStory('" + this.ID + "');");
		storyDiv.setAttribute("category", this.CategoryID);

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
		storyContainerDiv.setAttribute("title", "Issue #" + this.ID + ": " + this.Summary.htmlencode());
		storyContainerDiv.setAttribute("onmouseover", "Kanban.AddGlowToRelatedStories('" + this.ID + "'); //$('#storycontainer" + this.ID + "').popover('show');");
		storyContainerDiv.setAttribute("onmouseout", "Kanban.RemoveGlowToRelatedStories('" + this.ID + "'); //$('#storycontainer" + this.ID + "').popover('hide');");
		storyContainerDiv.setAttribute("container", "dropdiv" + this.ID);
		//storyContainerDiv.setAttribute("rel", "popover");
		//storyContainerDiv.setAttribute("data-content", this.Summary.htmlencode());
		//storyContainerDiv.setAttribute("data-original-title", "Issue #" + this.ID + ": " + this.Summary.htmlencode());
		if(this.HandlerName == Kanban.CurrentUser.UserName) {
			storyContainerDiv.classList.add("mystory");
		}
		storyDiv.appendChild(storyContainerDiv);

		var storyDivSeverityContainer = document.createElement("div");
		storyDivSeverityContainer.setAttribute("class", "kanbanstoryprioritycontainer");
		storyDivSeverityContainer.setAttribute("listid", "listid" + this.ListID);
		storyDivSeverityContainer.setAttribute("storyid", "storydiv" + this.ID);
		storyDivSeverityContainer.setAttribute("dropdivid", "dropdiv" + this.ID);
		storyContainerDiv.appendChild(storyDivSeverityContainer);

		var storyDivSeverity = document.createElement("div");
		storyDivSeverity.setAttribute("class", "kanbanstorypriority");
		storyDivSeverity.setAttribute("id", "storyseverity" + this.ID);
		storyDivSeverity.setAttribute("priority", this.PriorityName);
		storyDivSeverity.setAttribute("listid", "listid" + this.ListID);
		storyDivSeverity.setAttribute("storyid", "storydiv" + this.ID);
		storyDivSeverity.setAttribute("dropdivid", "dropdiv" + this.ID);
		storyDivSeverity.innerHTML = this.ID;
		storyDivSeverityContainer.appendChild(storyDivSeverity);

		var storyDivTitle = document.createElement("span");
		
		storyDivTitle.setAttribute("class", "kanbanstorytitle");
		storyDivTitle.setAttribute("id", "storytitle" + this.ID);
		storyDivTitle.setAttribute("onclick", "EditStory('" + this.ID + "');");
		storyDivTitle.setAttribute("listid", "listid" + this.ListID);
		storyDivTitle.setAttribute("storyid", "storydiv" + this.ID);
		storyDivTitle.setAttribute("dropdivid", "dropdiv" + this.ID);
		if(this.CategoryID != null) {
			storyDivTitle.innerHTML += "<span class=\"categoryicon glyphicon glyphicon-" + Kanban.GetCategoryIcon(this.CategoryID) + "\"></span> ";
		}
		if(this.Attachments.length > 0) {
			storyDivTitle.innerHTML += "<span class=\"glyphicon glyphicon-file\"></span> ";
		}
		storyDivTitle.innerHTML += this.Summary;
		
		storyContainerDiv.appendChild(storyDivTitle);

		var storyDivButtonContainer = document.createElement("div");
		storyDivButtonContainer.setAttribute("class", "kabanhandlercontainer");
		storyDivButtonContainer.setAttribute("onclick", "EditStory('" + this.ID + "');");
		storyDivButtonContainer.setAttribute("listid", "listid" + this.ListID);
		storyDivButtonContainer.setAttribute("storyid", "storydiv" + this.ID);
		storyDivButtonContainer.setAttribute("dropdivid", "dropdiv" + this.ID);
		storyContainerDiv.appendChild(storyDivButtonContainer);

		var storyDivButton = document.createElement("div");
		storyDivButton.setAttribute("id", "storydivbutton" + this.ID);
		storyDivButton.setAttribute("class", "handlercontainer");
		storyDivButton.setAttribute("listid", "listid" + this.ListID);
		storyDivButton.setAttribute("storyid", "storydiv" + this.ID);
		storyDivButton.setAttribute("dropdivid", "dropdiv" + this.ID);
		if(this.HandlerName != "") {
			storyDivButton.setAttribute("style", " color: " + colorCodes[this.HandlerName.substring(0, 1).toUpperCase()].foreground + ";  background-color:" + colorCodes[this.HandlerName.substring(0, 1).toUpperCase()].background + ";");
		}
		storyDivButton.innerHTML = this.HandlerName.substring(0, 1).toUpperCase() + this.HandlerName.substring(1, 2);
		storyDivButtonContainer.appendChild(storyDivButton);

		if(this.Element != null) {
			var replacedNode = this.Element.parentNode.replaceChild(storyDiv, this.Element);
			//this.Element.classList.add("fadein");
		}

		this.Element = storyDiv;
		return storyDiv;
	}
}

Kanban.AddStory = function(summary, description, handlerid, reporterid, statusid, priorityid, category, customfield) {
	var newIssueStruct = Mantis.UpdateStructureMethods.Issue.NewIssue(summary, description, Mantis.CurrentProjectID, handlerid, reporterid, statusid, priorityid, category);
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
		} catch(e) {
			console.log(e);
		}
	}
};

Kanban.UpdateUnderlyingStorySource = function(originalStory) {
	var mantisIssue = Mantis.IssueGet(originalStory.ID, null);
	originalStory.StorySource = mantisIssue;
	return originalStory;
};

