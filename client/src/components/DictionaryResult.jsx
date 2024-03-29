import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from 'react';
import Definition from './Definition';
import { stripAsterisks } from '../utils';
import { Divider } from '@mui/material';


const DictionaryResult = ({ data, ...props }) => {
  const word = stripAsterisks(data[0].headword);

  return (
    <Box marginTop={5}>
      <Divider />
      <Typography sx={{ textTransform: "capitalize" }} marginTop={3} variant="h2" component="h1">{word}</Typography>
      {data.map((def, i) => <Definition key={i} data={def} />)}
    </Box>
  );
};

export default DictionaryResult;