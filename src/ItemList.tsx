import React from 'react';
import { Box } from '@mui/material';
import ItemView from './ItemView';
import { Item } from './contracts/marketplaceApp';

interface ItemListProps {
  items: Item[];
  onBuy: (idx: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onBuy }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    {items.map((item, idx) => (
      !item.isEmptySlot && <ItemView key={idx} item={item} idx={idx} onBuy={onBuy} />
    ))}
  </Box>
);

export default ItemList;