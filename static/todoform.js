"use strict";

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
