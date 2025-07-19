import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ItemForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id is a string or undefined
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      // Fetch item data for editing
      fetch(`http://localhost:3000/items/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch item');
          return res.json();
        })
        .then(data => {
          setName(data.name);
          setDescription(data.description || '');
        })
        .catch(err => setError(err.message));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const method = id ? 'PUT' : 'POST'; // PUT for update, POST for new
      const url = id
        ? `http://localhost:3000/items/${id}`
        : 'http://localhost:3000/items';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save item');
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>{id ? 'Edit Item' : 'Create New Item'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Name <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Description
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <button type="submit" style={{ marginRight: '1rem' }}>
        Save
      </button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
};

export default ItemForm;