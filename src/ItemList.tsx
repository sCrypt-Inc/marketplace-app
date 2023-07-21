import React from 'react';
import { Box } from '@mui/material';
import Item from './Item';

interface ItemListProps {
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  onBuy: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onBuy }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    {items.map(item => (
      <Item key={item.id} item={item} onBuy={onBuy} />
    ))}
  </Box>
);

export default ItemList;