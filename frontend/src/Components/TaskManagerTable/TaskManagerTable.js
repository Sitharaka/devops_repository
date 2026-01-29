import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManagerTable.css';
import { useAuth } from '../../AuthContext';

function TaskManagerTable() {
  const [tasks, setTasks] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [newTaskDay, setNewTaskDay] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskError, setNewTaskError] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [confirm, setConfirm] = useState({ visible: false, message: '', onConfirm: null });
  const auth = useAuth();

  useEffect(() => {
    if (!auth.token) return;

    axios.get('/tasks', { headers: { Authorization: `Bearer ${auth.token}` } })
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, [auth.token]);

  const openAddTask = (day) => {
    setNewTaskDay(day);
    setNewTaskName('');
    setNewTaskDesc('');
    setNewTaskError('');
  };

  const submitNewTask = () => {
    if (!newTaskName) {
      setNewTaskError('Task name is required');
      return;
    }

    axios.post('/tasks', { task_name: newTaskName, description: newTaskDesc, day: newTaskDay }, { headers: { Authorization: `Bearer ${auth.token}` } })
      .then(response => {
        setTasks([...tasks, response.data.task]);
        setNewTaskDay(null);
      })
      .catch(err => console.error('Error creating task', err));
  };

  const handleRemoveAllTasks = (day) => {
    setConfirm({ visible: true, message: `Delete all tasks for ${day}?`, onConfirm: () => {
      axios.delete(`/tasks?day=${day}`, { headers: { Authorization: `Bearer ${auth.token}` }})
        .then(() => setTasks(tasks.filter(task => task.day !== day)))
        .catch(error => console.error('Error removing tasks:', error));
      setConfirm({ visible: false, message: '', onConfirm: null });
    }});
  };

  const handleTaskAction = (taskId, action) => {
    if (action === 'delete') {
      axios.delete(`/tasks/${taskId}`, { headers: { Authorization: `Bearer ${auth.token}` }})
        .then(() => setTasks(tasks.filter(task => task._id !== taskId)))
        .catch(error => console.error('Error deleting task:', error));
    } else if (action === 'edit') {
      const task = tasks.find(t => t._id === taskId);
      if (task) setEditTask({ ...task });
    } else if (action === 'toggle') {
      const task = tasks.find(task => task._id === taskId);
      axios.put(`/tasks/${taskId}`, { status: task.status === 'complete' ? 'pending' : 'complete' }, { headers: { Authorization: `Bearer ${auth.token}` }})
        .then(response => setTasks(tasks.map(task => task._id === taskId ? response.data.task : task)))
        .catch(error => console.error('Error toggling task status:', error));
    }
  };

  const handleLogout = () => {
    auth.logout();
    setTasks([]);
  };

  const handleDeleteAccount = () => {
    if (!auth.user) return;
    setConfirm({ visible: true, message: 'Permanently delete your account and all tasks?', onConfirm: () => {
      axios.delete(`/users/${auth.user._id}`, { headers: { Authorization: `Bearer ${auth.token}` }})
        .then(() => {
          handleLogout();
        })
        .catch(err => console.error('Error deleting account:', err));
      setConfirm({ visible: false, message: '', onConfirm: null });
    }});
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="task-manager">
      <div className="header">
        <h1 className="app-title">Task Manager</h1>
        <div className="account-panel">
          <button className="account-button" onClick={() => setAccountOpen(!accountOpen)}>{auth.user ? auth.user.name : 'Account'}</button>
          <div className={`account-menu ${accountOpen ? 'open' : ''}`}>
            {auth.user ? (
              <>
                <div style={{padding: '0.5rem'}}><strong>{auth.user.name}</strong><br/>{auth.user.gmail}</div>
                <button onClick={handleLogout}>Log out</button>
                <button onClick={handleDeleteAccount}>Delete account</button>
              </>
            ) : (
              <div style={{padding: '0.5rem'}}>Not signed in</div>
            )}
          </div>
        </div>
      </div>

      {!auth.user && (
        <div style={{textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: 12}}>
          <h2>Welcome!</h2>
          <p>Sign in or create an account to manage your weekly tasks.</p>
          <a href="/SignIn">Sign In</a> | <a href="/SignUp">Sign Up</a>
        </div>
      )}

      {auth.user && (
        <div className="table-wrapper">
          <div className="task-table">
            {days.map(day => (
              <div className="day-column" key={day}>
                <div className="day-header">
                  <div className="day-title">{day}</div>
                  <div className="day-actions">
                    <button title="Add Task" onClick={() => openAddTask(day)}>?</button>
                    <button title="Remove all" onClick={() => handleRemoveAllTasks(day)}>??</button>
                  </div>
                </div>

                <div className="tasks-list">
                  {tasks.filter(task => task.day === day).map(task => (
                    <div className="task-item" key={task._id}>
                      <input type="checkbox" checked={task.status === 'complete'} onChange={() => handleTaskAction(task._id, 'toggle')} />
                      <div className="task-info">
                        <div className="task-title">{task.task_name}</div>
                        {task.description && <div className="task-desc">{task.description}</div>}
                      </div>
                      <div className="task-actions">
                        <button onClick={() => handleTaskAction(task._id, 'edit')}>??</button>
                        <button onClick={() => handleTaskAction(task._id, 'delete')}>???</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="add-task-btn" onClick={() => openAddTask(day)}>Add Task</button>
                <button className="remove-all-btn" onClick={() => handleRemoveAllTasks(day)}>Remove All Tasks</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add task modal / panel */}
      {newTaskDay && (
        <div style={{position: 'fixed', left: 0, top: 0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)'}}>
          <div style={{background:'#fff', padding:20, borderRadius:8, width:320}}>
            <h3>Add task for {newTaskDay}</h3>
            <input placeholder="Task name" value={newTaskName} onChange={e=>setNewTaskName(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} aria-label="Task name" />
            <textarea placeholder="Description" value={newTaskDesc} onChange={e=>setNewTaskDesc(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} aria-label="Description" />
            {newTaskError && <div style={{color:'red', marginBottom:8}}>{newTaskError}</div>}
            <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
              <button onClick={()=>setNewTaskDay(null)}>Cancel</button>
              <button onClick={submitNewTask} style={{background:'#007acc', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6}}>Add</button>
            </div>
          </div>
        </div>
      )}

      {editTask && (
        <div style={{position: 'fixed', left: 0, top: 0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)'}}>
          <div style={{background:'#fff', padding:20, borderRadius:8, width:320}}>
            <h3>Edit task</h3>
            <input placeholder="Task name" value={editTask.task_name} onChange={e=>setEditTask({...editTask, task_name: e.target.value})} style={{width:'100%', padding:8, marginBottom:8}} aria-label="Edit task name" />
            <textarea placeholder="Description" value={editTask.description} onChange={e=>setEditTask({...editTask, description: e.target.value})} style={{width:'100%', padding:8, marginBottom:8}} aria-label="Edit description" />
            <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
              <button onClick={()=>setEditTask(null)}>Cancel</button>
              <button onClick={()=>{
                axios.put(`/tasks/${editTask._id}`, { task_name: editTask.task_name, description: editTask.description }, { headers: { Authorization: `Bearer ${auth.token}` }})
                  .then(resp => setTasks(tasks.map(t => t._id === editTask._id ? resp.data.task : t)))
                  .catch(err => console.error('Error updating task', err));
                setEditTask(null);
              }} style={{background:'#007acc', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {confirm.visible && (
        <div style={{position: 'fixed', left: 0, top: 0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)'}}>
          <div style={{background:'#fff', padding:20, borderRadius:8, width:320}}>
            <p>{confirm.message}</p>
            <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
              <button onClick={()=>setConfirm({ visible:false, message:'', onConfirm:null })}>Cancel</button>
              <button onClick={()=>confirm.onConfirm && confirm.onConfirm()} style={{background:'#b00020', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6}}>Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TaskManagerTable;
