(function() {

    window.App = {
        Models: {},
        Collections : {},
        Views: {}

    };

    window.template = function( id ) {
        return _.template( $('#'+id).html() );
    };

    App.Models.Task = Backbone.Model.extend({

        initialize : function(){
            this.on("invalid",function(model,error){
                console.log(error);
            });
        },

        validate: function(attrs) {
            if( ! $.trim( attrs.title ) ) {
                return 'A task requires a valid title.';
            }
        }

    });

    App.Collections.Tasks = Backbone.Collection.extend({
        model: App.Models.Task
    });

    App.Views.Tasks = Backbone.View.extend({
        tagName: 'ul',

        initialize: function() {
            this.collection.on('add', this.addOne, this);
        },

        render: function() {
            this.collection.each(this.addOne, this);
            return this;
        },

        addOne: function( task ) {

            var taskView = new App.Views.Task({ model: task });

            this.$el.append( taskView.render().el );
        }
    });

    App.Views.Task = Backbone.View.extend({

        tagName: 'li',

        template: template('taskTemplate'),

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);

        },

        events: {
            'click .edit': 'editTask',
            'click .delete': 'deleteTask'
        },

        editTask: function() {
            var newTaskTitle = prompt('What would you like to change the text to?', this.model.get('title'));
            if( !newTaskTitle )
            {
                return;
            }
            this.model.set({'title' : newTaskTitle}, {validate : true});
        },

        deleteTask: function() {
            this.model.destroy();
            console.log(tasksCollection);
        },

        remove: function() {
            this.$el.remove();
        },

        render: function() {

            var template = this.template( this.model.toJSON() );
            this.$el.html( template );
            return this;
        }

    });

    App.Views.AddTask = Backbone.View.extend({

        el: '#addTask',

        events:{
            'submit' : 'submit'
        },

        submit: function(event) {
            event.preventDefault();

            var newTaskTitle = $(event.currentTarget).find('input[type=text]').val();
            console.log(newTaskTitle);

            var task = new App.Models.Task({ title: newTaskTitle });
            console.log(task);
            this.collection.add(task);
        },

    });


    var tasksCollection = new App.Collections.Tasks([
        {
            title: 'Go to the store',
            priotity: 4
        },
        {
            title: 'Go to the mall',
            priotity: 3
        },
        {
            title: 'Get to work',
            priotity: 5
        }
    ]);

    var addTaskView = new App.Views.AddTask({ collection: tasksCollection })

    var tasksView = new App.Views.Tasks({ collection: tasksCollection });
    tasksView.render();
    $('.tasks').html(tasksView.el);


})();