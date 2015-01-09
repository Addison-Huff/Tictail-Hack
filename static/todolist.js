"use strict";

var TodoList = React.createClass({
  render: function() {
    var handleTodoCompletion = this.props.handleTodoCompletion;
    var todoItems = this.props.data.map(function (todo) {
      var even = todo.position % 2 !== 0; // "Even" is based on actual list position, not list index
      var props = {
        handleTodoCompletion: handleTodoCompletion,
        key: todo._id.$oid,
        completed: todo.completed,
        even: even,
        reactId: todo._id.$oid
      };
      return (
        <Todo {...props} >
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
  getInitialState: function() {
    return { completed: this.props.completed };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ completed: nextProps.completed });
  },
  completeTodo: function() {
    var completed = this.state.completed == true ? false: true;
    this.setState({ completed: completed });
    this.props.handleTodoCompletion(this.props.reactId);
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
          <input type="checkbox" name="completed" checked={ this.state.completed } id={ this.props.reactId } onChange={ this.completeTodo }/>
          <label htmlFor={ this.props.reactId }></label>
        </form>
        { this.props.children }
      </div>
    );
  }
});
