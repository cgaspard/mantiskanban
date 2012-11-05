var KanbanProject = function(RawObject) {
	this.ProjectSource = RawObject;
}
KanbanProject.prototype = {
	Lists : [],
	Name : "",
	ID : 0
}

var KanbanList = function(RawObject){
		this.ListSource = RawObject;
		this._stories = [];
}
KanbanList.prototype = {
	
	get Stories() {
		return this._stories;
	},
	set Stories(value) {
		this._stories = value;	
	},
	
	Element : null,
	
	get Name() { return this.ListSource.name; },
	set Name(value) { this.ListSource.name = value; },
	
	get ID() { return this.ListSource.id; },
	set ID(value) { this.ListSource.id = value; }
}


var KanbanStory = function(RawObject) {
    this._list = null;
		this.StorySource = RawObject;
		this.JoinList();
		
}
KanbanStory.prototype = {

		get List() { return this._list; },
		set List(value) { this._list = value; },

		get ID() { return this.StorySource.id; },
		set ID(value) { this.StorySource.id = value; },
		
    get ListID() { return this.List.ID },
		set ListID(value) {
			//this.StorySource.status.id = value;
		},
		
    get StatusID() { return this.StorySource.status.id; },
		set StatusID(value) { this.StorySource.status.id = value },
		
		get StatusName() { return this.StorySource.status.name; },
		set StatusName(value) { this.StorySource.status.name = value },
		
    get Notes() { return this.StorySource.notes; },
    
		get Description() { return this.StorySource.description; },
		set Description(value) { this.StorySource.description = value; },
    
		get HandlerID() { return this.StorySource.handler.id; },
		set HandlerID(value) { this.StorySource.handler.id = value; },
		
		get HandlerName() { return this.StorySource.handler.name; },
		set HandlerName(value) { this.StorySource.handler.name = value; },
		
		get ReporterName() { return this.StorySource.reporter.name; },
		set ReporterName(value) { this.StorySource.reporter.name = value; },
		
		get ReporterID() { return this.StorySource.reporter.id; },
		set ReporterID(value) { this.StorySource.reporter.id = value; }, 
		
		get PriorityName() { return this.StorySource.priority.name; },
		set PriorityName(value) { this.StorySource.priority.name = value; },
		
		get PriorityID() { return this.StorySource.priority.id; },
		set PriorityID(value) { this.StorySource.priority.id = value; },
    
		get Summary() { return this.StorySource.summary },
		set Summary(value) { this.Issu.summary = value; },
    
		JoinList : function() {
			for(var li = 0; li < Kanban.Lists.length; li++){
        if(Kanban.Lists[li].ID == this.StorySource.status.id) {
            this.List = Kanban.Lists[li];
            this.List.Stories[this.List.Stories.length] = this;
            break;
        }
			}
		},
		
		Save : function() {
        this.StorySource.summary = this.Summary;
        this.StorySource.status.id = this.List.ID;
    },
		
		Refresh : function() {
			
		}
		
		
}
