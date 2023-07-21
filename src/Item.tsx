import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

interface ItemProps {
  item: {
    id: string;
    name: string;
    price: number;
  };
  onBuy: (id: string) => void;
}

const Item: React.FC<ItemProps> = ({ item, onBuy }) => (
  <Card sx={{ minWidth: 275, m: 2 }}>
    <CardContent>
      <Typography variant="h5" component="div">
        {item.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: {item.price} BSV
      </Typography>
      <Button variant="contained" onClick={() => onBuy(item.id)}>Buy</Button>
    </CardContent>
  </Card>
);

export default Item;