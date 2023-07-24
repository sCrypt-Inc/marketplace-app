import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Item } from './contracts/marketplaceApp';

interface ItemProps {
  item: Item
  idx: number
  onBuy: (idx: number) => void;
}

const ItemView: React.FC<ItemProps> = ({ item, idx, onBuy }) => (
  <Card sx={{ minWidth: 275, m: 2 }}>
    <CardContent>
      <Typography variant="h5" component="div">
        {Buffer.from(item.name, "hex").toString("utf8")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: {Number(item.price) / (100 * 10**6)} BSV
      </Typography>
      <Button variant="contained" onClick={() => onBuy(idx)}>Buy</Button>
    </CardContent>
  </Card>
);

export default ItemView;