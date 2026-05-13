import React, { useState } from 'react';
import type { Todo, User } from '../../types';

type Props = {
  todos: Todo[];
  users: User[];
  onAdd: (todo: Todo) => void;
};

export const TodoForm: React.FC<Props> = ({ todos, users, onAdd }) => {
  const [titleError, setTitleError] = useState(false);
  const [userError, setUserError] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const selectedUserObj = users.find(
    (user: User) => user.id === Number(selectedUser),
  )!;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const hasTitleError = !title.trim();
    const hasUserError = !selectedUser;

    setTitleError(hasTitleError);
    setUserError(hasUserError);

    if (!hasTitleError && !hasUserError && selectedUserObj) {
      onAdd({
        id: Math.max(...todos.map(todo => todo.id)) + 1,
        title,
        completed: false,
        userId: Number(selectedUser),
        user: selectedUserObj,
      });
      setTitle('');
      setSelectedUser('');
    }
  };

  return (
    <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="todo-title">Title:</label>
        <input
          type="text"
          data-cy="titleInput"
          value={title || ''}
          onChange={event => {
            setTitle(event.target.value);
            setTitleError(false);
          }}
        />
        <span className="error" hidden={!titleError}>
          Please enter a title
        </span>
      </div>

      <div className="field">
        <label htmlFor="todo-user">User:</label>
        <select
          data-cy="userSelect"
          value={selectedUser}
          onChange={event => {
            setSelectedUser(event.target.value);
            setUserError(false);
          }}
        >
          <option value="" disabled>
            Choose a user
          </option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <span className="error" hidden={!userError}>
          Please choose a user
        </span>
      </div>

      <button type="submit" data-cy="submitButton">
        Add
      </button>
    </form>
  );
};
