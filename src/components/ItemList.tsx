import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Item {
  id: number;
  name: string;
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('http://localhost:3000/items');
        if (!res.ok) throw new Error('Failed to fetch items');
        const data: Item[] = await res.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) return <p>Loading items...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Items List</h1>
      <Link to="/items/new">
        <button style={{ marginBottom: '1rem' }}>Add New Item</button>
      </Link>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;