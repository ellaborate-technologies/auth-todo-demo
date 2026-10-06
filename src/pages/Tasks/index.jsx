import React, { useState, useEffect } from 'react'
import MainLayout from '../../layouts/MainLayout'
import { getTasks, saveTasks } from '../../utils/taskStorage'

const Tasks = () => {
  const [tasks, setTasks] = useState(() => getTasks())
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState('')

  const [editingSubtaskId, setEditingSubtaskId] = useState(null)
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('')

  const [subtaskInputs, setSubtaskInputs] = useState({})

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const handleCreateTask = (e) => {
    e.preventDefault()
    const trimmed = newTaskTitle.trim()
    if (!trimmed) return

    const newTask = {
      id: Date.now(),
      title: trimmed,
      completed: false,
      subtasks: []
    }

    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
  }

  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleSaveTaskEdit = (taskId) => {
    const trimmed = editingTaskTitle.trim()
    if (!trimmed) return

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: trimmed } : task
      )
    )
    setEditingTaskId(null)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleAddSubtask = (taskId) => {
    const title = (subtaskInputs[taskId] || '').trim()
    if (!title) return

    const newSubtask = {
      id: Date.now(),
      title: title,
      completed: false
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
          : task
      )
    )

    setSubtaskInputs({ ...subtaskInputs, [taskId]: '' })
  }

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          subtasks: (task.subtasks || []).map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          )
        }
      })
    )
  }

  const handleSaveSubtaskEdit = (taskId, subtaskId) => {
    const trimmed = editingSubtaskTitle.trim()
    if (!trimmed) return

    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          subtasks: (task.subtasks || []).map((sub) =>
            sub.id === subtaskId ? { ...sub, title: trimmed } : sub
          )
        }
      })
    )
    setEditingSubtaskId(null)
  }

  const handleDeleteSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          subtasks: (task.subtasks || []).filter((sub) => sub.id !== subtaskId)
        }
      })
    )
  }

  return (
    <MainLayout>
      <div>
        <h2>Task Management</h2>

        <form onSubmit={handleCreateTask}>
          <input
            type='text'
            placeholder='Add new task...'
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type='submit'>Add Task</button>
        </form>

        {tasks.length === 0 ? (
          <p>No tasks yet. Create a task above to get started.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <div>
                  <input
                    type='checkbox'
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                  />

                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type='text'
                        value={editingTaskTitle}
                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => handleSaveTaskEdit(task.id)}
                      >
                        Save
                      </button>
                      <button
                        type='button'
                        onClick={() => setEditingTaskId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{task.title}</span>
                      {' '}
                      <button
                        type='button'
                        onClick={() => {
                          setEditingTaskId(task.id)
                          setEditingTaskTitle(task.title)
                        }}
                      >
                        Edit
                      </button>
                      {' '}
                      <button
                        type='button'
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                <div>
                  <h4>Subtasks:</h4>

                  {task.subtasks && task.subtasks.length === 0 ? (
                    <p>No subtasks yet. Add one below.</p>
                  ) : (
                    <ul>
                      {(task.subtasks || []).map((sub) => (
                        <li key={sub.id}>
                          <input
                            type='checkbox'
                            checked={sub.completed}
                            onChange={() => handleToggleSubtask(task.id, sub.id)}
                          />

                          {editingSubtaskId === sub.id ? (
                            <>
                              <input
                                type='text'
                                value={editingSubtaskTitle}
                                onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                              />
                              <button
                                type='button'
                                onClick={() => handleSaveSubtaskEdit(task.id, sub.id)}
                              >
                                Save
                              </button>
                              <button
                                type='button'
                                onClick={() => setEditingSubtaskId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <span>{sub.title}</span>
                              {' '}
                              <button
                                type='button'
                                onClick={() => {
                                  setEditingSubtaskId(sub.id)
                                  setEditingSubtaskTitle(sub.title)
                                }}
                              >
                                Edit
                              </button>
                              {' '}
                              <button
                                type='button'
                                onClick={() => handleDeleteSubtask(task.id, sub.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div>
                    <input
                      type='text'
                      placeholder='Add a subtask...'
                      value={subtaskInputs[task.id] || ''}
                      onChange={(e) =>
                        setSubtaskInputs({ ...subtaskInputs, [task.id]: e.target.value })
                      }
                    />
                    <button
                      type='button'
                      onClick={() => handleAddSubtask(task.id)}
                    >
                      Add Subtask
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainLayout>
  )
}

export default Tasks
