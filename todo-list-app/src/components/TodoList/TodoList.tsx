import { useEffect, useState } from 'react'
import { Todo } from '../../@types/todo.type'
import TaskInput from '../TaskInput/TaskInput'
import TaskList from '../TaskList/TaskList'
import styles from './todoList.module.scss'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const doneTodos = todos.filter((todo) => todo.done)
  const notDoneTodos = todos.filter((todo) => !todo.done)

  //when reset: keep the list todo
  useEffect(() => {
    //read items
    const todostring = localStorage.getItem('todos')
    //parse JSON->Object
    const todosObj: Todo[] = JSON.parse(todostring || '[]')
    console.log('todosObj', todosObj)
    setTodos(todosObj)
  }, [])

  const addTodo = (name: string) => {
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }
    setTodos((prev) => [...prev, todo])
    //read items
    const todostring = localStorage.getItem('todos')
    //parse JSON->Object
    const todosObj: Todo[] = JSON.parse(todostring || '[]')
    const newTodosObj = [...todosObj, todo]
    // More items -- JSON.stringify: object->string
    localStorage.setItem('todos', JSON.stringify(newTodosObj))
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
    const todostring = localStorage.getItem('todos')
    const todosObj: Todo[] = JSON.parse(todostring || '[]')
    const newTodosObj = todosObj.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done }
      }
      return todo
    })
    // More items -- JSON.stringify: object->string
    localStorage.setItem('todos', JSON.stringify(newTodosObj))
  }

  const startEditTodo = (id: string) => {
    const findedTodo = todos.find((todo) => todo.id === id)
    if (findedTodo) {
      setCurrentTodo(findedTodo)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const finishEditTodo = () => {
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === (currentTodo as Todo).id) {
          return currentTodo as Todo
        }
        return todo
      })
    })
    setCurrentTodo(null)

    const todostring = localStorage.getItem('todos')
    //parse JSON->Object
    const todosObj: Todo[] = JSON.parse(todostring || '[]')

    const newTodosObj = todosObj.map((todo) => {
      if (todo.id === (currentTodo as Todo).id) {
        return currentTodo as Todo
      }
      return todo
    })
    // More items -- JSON.stringify: object->string
    localStorage.setItem('todos', JSON.stringify(newTodosObj))
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    setTodos((prev) => {
      const findedIndexTodo = prev.findIndex((todo) => todo.id === id)
      if (findedIndexTodo > -1) {
        //Clone
        const result = [...prev]
        result.splice(findedIndexTodo, 1)
        return result
      }
      return prev
    })

    const todostring = localStorage.getItem('todos')
    //parse JSON->Object
    const todosObj: Todo[] = JSON.parse(todostring || '[]')
    const newTodosObj = () => {
      const findedIndexTodo = todosObj.findIndex((todo) => todo.id === id)
      if (findedIndexTodo > -1) {
        const result = [...todosObj]
        console.log('result', result)
        result.splice(findedIndexTodo, 1)
        return result
      }
      return todosObj
    }
    console.log('newwwTodo', newTodosObj())
    localStorage.setItem('todos', JSON.stringify(newTodosObj()))
  }
  // console.log('todos', todos)
  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          doneTaskList={false}
          todos={notDoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList={true}
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
