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
  reorderTodos: function(todo, newPos) {
    var todoToMove = this.state.data.splice(todo.position, 1)[0];
    var reorderedTodos = this.state.data.splice(newPos, 0, todoToMove);
    this.setState({ data: reorderedTodos });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadTodosFromServer();
  },
  render: function() {
    return (
      <div className="todoBox">
        <h1>Todos</h1>
        <TodoForm onTodoSubmit={ this.handleTodoSubmit } />
        <TodoList data={ this.state.data } />
      </div>
    );
  }
});

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text) {
      return;
    }
    this.props.onTodoSubmit({ text: text, completed: false });
    this.refs.text.getDOMNode().value = "";
    return;
  },
  render: function() {
    return (
      <form className="todoForm" onSubmit={ this.handleSubmit }>
        <input type="text" placeholder="What needs to be done?" ref="text" />
        <input type="submit" value="Add Todo" />
      </form>
    );
  }
});

var TodoList = React.createClass({
  render: function() {
    var todoItems = this.props.data.map(function (todo) {
      var even = todo.position % 2 !== 0; // I'm naming it "even" based off of list position, not list index
      return (
        <Todo key={ todo._id.$oid } completed={ todo.completed } even={ even } reactId={ todo._id.$oid }>
          { todo.text }
        </Todo>
      );
    });
    return (
      <div className="todoList">
        { todoItems }
      </div>
    );
  }
});

var Todo = React.createClass({
  getInitialState: function () {
    return { completed: this.props.completed };
  },
  handleChange: function () {
    var completed = this.state.completed == true ? false: true;
    this.setState({ completed: completed });
    $.post("/todo/" + this.props.reactId + "/complete");
  },
  render: function() {
    var classString = "todo";
    if (this.props.even) {
      classString += " even";
    }
    if (this.state.completed) { 
      classString += " completed";
    }
    return (
      <div className={ classString }>
        <form className="checkbox">
          <input type="checkbox" name="completed" checked={ this.state.completed } id={ this.props.reactId } onChange={ this.handleChange }/>
          <label htmlFor={ this.props.reactId }></label>
        </form>
        { this.props.children }
      </div>
    );
  }
});

React.render(
  <TodoBox />,
  document.getElementById("content")
);
