import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface NewItemProps {
  onAdd: (item: { name: string; price: number }) => void;
}

const NewItem: React.FC<NewItemProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd({ name, price: Number(price) });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ m: 2}}>
      <TextField
        id="name"
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        id="price"
        label="Price (BSV)"
        value={price}
        onChange={e => setPrice(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add New Item</Button>
    </Box>
  );
};

export default NewItem;