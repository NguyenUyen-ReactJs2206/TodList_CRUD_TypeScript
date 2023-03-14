import { useState } from 'react'
import { Todo } from '../../@types/todo.type'
import TaskInput from '../TaskInput/TaskInput'
import TaskList from '../TaskList/TaskList'
import styles from './todoList.module.scss'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const doneTodos = todos.filter((todo) => todo.done)
  const notDoneTodos = todos.filter((todo) => !todo.done)

  const addTodo = (name: string) => {
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }
    setTodos((prev) => [...prev, todo])
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    })
  }
  console.log('todos', todos)
  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addTodo={addTodo} />
        <TaskList doneTaskList={false} todos={notDoneTodos} handleDoneTodo={handleDoneTodo} />
        <TaskList doneTaskList todos={doneTodos} handleDoneTodo={handleDoneTodo} />
      </div>
    </div>
  )
}
