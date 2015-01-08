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
    var newTodos = todos.concat([todo]);
    this.setState({ data: newTodos });
    $.ajax({
      type: "POST",
      url: "/todo",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(todo),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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

var TodoList = React.createClass({
  render: function() {
    var todoItems = this.props.data.map(function (todo) {
      return (
        <Todo completed={ todo.completed }>
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

var Todo = React.createClass({
  render: function() {
    return (
      <div className="todo">
        <form>
          <input type="checkbox" name="completed" />
          { this.props.children }
        </form>
      </div>
    );
  }
});

React.render(
  <TodoBox />,
  document.getElementById("content")
);