// App.tsx
import React, { useState } from 'react';
import ItemList from './ItemList';
import NewItem from './NewItem';

const App: React.FC = () => {
  const [items, setItems] = useState<{id: string; name: string; price: number;}[]>([]);

  const handleBuy = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAdd = (newItem: { name: string; price: number }) => {
    setItems([...items, { ...newItem, id: Math.random().toString() }]);
  };

  return (
    <div>
      <NewItem onAdd={handleAdd} />
      <ItemList items={items} onBuy={handleBuy} />
    </div>
  );
};

export default App;