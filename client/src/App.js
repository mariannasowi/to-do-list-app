import React from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.emit('updateData');
    this.socket.on('addTask', task => this.addTask(task));
    this.socket.on('removeTask', (taskIndex) => this.removeTask(taskIndex));
    this.socket.on('updateData', tasksServer => this.setState({ tasks: tasksServer }));
    this.socket.on('editRecord', (taskChange) => this.editRecord(taskChange.taskChange, taskChange.id))
  }

  removeTask(taskIndex, event) {
    if(event !== undefined) {
      this.socket.emit('removeTask', taskIndex);
    }
    this.setState({tasks: this.state.tasks.filter(task => task.id !== taskIndex)});
  }

  updateTaskName(value) {
    this.setState({ taskName: value });
  }

  addTask(task) {
    this.setState({ tasks: [...this.state.tasks, {id: task.id, task: task.task}] });
  }

  editRecord(taskChange, id, event) {
    if(event !== undefined) {
      this.socket.emit('editRecord', ({taskChange, id}));
    }
    this.setState({tasks: this.state.tasks.map(task => (
      task.id === id ? {id: id, task: taskChange} : {id: task.id, task: task.task}
    ))});
  }

  submitForm(event) {
    event.preventDefault();
    const id = v4();
    this.socket.emit('addTask', {id: id, task: this.state.taskName});
    this.addTask({id: id, task: this.state.taskName});
    this.updateTaskName('');
  }

  render() {
    return (
      <div className="App">

      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {this.state.tasks.map(task => (
            <li className="task" key={task.id}>
              <input className="text-input text-task-input" type="text" value={task.task} onChange={event => this.editRecord(event.currentTarget.value, task.id, event)}></input>
              <button className="btn btn--red" onClick={event => this.removeTask(task.id,event) }>Remove</button>
            </li>
          ))}
        </ul>
  
        <form id="add-task-form" onSubmit={event => this.submitForm(event)}>
          <input className="text-input" value={this.state.taskName} onChange={event => this.updateTaskName(event.currentTarget.value)} autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
    );
  };

};

export default App;