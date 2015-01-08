"use strict";

var TodoBox = React.createClass({
  render: function() {
    return (
      <div className="todoBox">
        <h1>Todos</h1>
        <TodoForm />
        <TodoList />
      </div>
    );
  }
});

var TodoList = React.createClass({
  render: function() {
    return (
      <div className="todoList">
        <Todo> Buy Milk </Todo>
        <Todo> Buy Bread </Todo>
      </div>
    );
  }
});

var TodoForm = React.createClass({
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
  <TodoBox url="todos.json" />,
  document.getElementById("content")
);