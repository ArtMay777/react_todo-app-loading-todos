/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import type { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter, FILTERS } from './components/TodoFilter/TodoFilter';
import { NewTodo } from './components/NewTodo/NewTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(newTodos => {
        setTodos(newTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);
  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(
    todo => todo.completed === false,
  ).length;
  const visibleTodos = todos.filter(todo => {
    if (filter === FILTERS.ACTIVE) {
      return todo.completed === false;
    }

    if (filter === FILTERS.COMPLETED) {
      return todo.completed === true;
    }

    return true;
  });

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed === true);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <NewTodo />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList todos={visibleTodos} />

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              {/* Active link should have the 'selected' class */}
              <TodoFilter filter={filter} onFilterChange={setFilter} />

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          onClick={() => setErrorMessage('')}
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        {errorMessage}
      </div>
    </div>
  );
};
