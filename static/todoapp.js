"use strict";

var TodoBox = React.createClass({
  loadTodosFromServer: function() {
    $.ajax({
      url: "/todos",
      dataType: "json",
      success: function(data) {
        this.setState({ data: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoSubmit: function(todo) {
    var todos = this.state.data;
    todo.position = todos.length;
    $.ajax({
      type: "POST",
      url: "/todo",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(todo),
      success: function(data) {
        todo._id = { $oid: data };
        var newTodos = todos.concat([todo]);
        this.setState({ data: newTodos });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoCompletion: function(todoId) {
    var todo = _.find(this.state.data, function(todo) { return todo._id.$oid === todoId });
    var newTodos = _.without(this.state.data, todo);
    todo.completed = todo.completed == true ? false: true;
    newTodos.splice(todo.position, 0, todo);
    this.setState({ data: newTodos });
  },
  reorderTodos: function(todo, newPos) {
    var todoToMove = this.state.data.splice(todo.position, 1)[0];
    var reorderedTodos = this.state.data.splice(newPos, 0, todoToMove);
    this.setState({ data: reorderedTodos });
  },
  completeAllTodos: function(e) {
    e.preventDefault();
    var incompleteTodos = _.where(this.state.data, { completed: false });
    var completedTodos = _.difference(this.state.data, incompleteTodos);
    _.each(incompleteTodos, function(todo) {
      this.handleTodoCompletion(todo._id.$oid);
      $.post("/todo/" + todo._id.$oid + "/complete");
    }, this);
    var newTodos = _.union(incompleteTodos, completedTodos);
    var orderedTodos = _.sortBy(newTodos, function (todo) { return todo.position; });
    this.setState({ data: orderedTodos });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadTodosFromServer();
  },
  render: function() {
    var numLeft = _.where(this.state.data, { completed: false }).length;
    return (
      <div className="todoBox">
        <h1>Todos</h1>
        <TodoForm onTodoSubmit={ this.handleTodoSubmit } />
        <TodoList handleTodoCompletion={ this.handleTodoCompletion } data={ this.state.data } />
        <TodoFooter numLeft={ numLeft } completeAll={ this.completeAllTodos }/>
      </div>
    );
  }
});

var TodoFooter = React.createClass({
  render: function() {
    return (
      <div className="todoFooter">
        <span className="todoCounter">{ this.props.numLeft } items left</span>
        <a className="completeAll" href="#" onClick={ this.props.completeAll }>Mark all as complete</a>
      </div>
    );
  }
});

React.render(
  <TodoBox />,
  document.getElementById("content")
);
