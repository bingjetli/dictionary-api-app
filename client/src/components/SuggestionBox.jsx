import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from 'react';
import Definition from './Definition';
import { stripAsterisks } from '../utils';
import { Divider } from '@mui/material';


const SuggestionBox = ({ data, ...props }) => {
  return (
    <Box marginY={5}>
      <Divider />
      <Typography sx={{ color: "InactiveCaptionText" }} marginTop={3} variant="h3" component="h2">Word Not Found</Typography>
      <Typography sx={{ color: "InactiveCaptionText" }} marginBottom={3} variant="h6" component="h3">Here are the closest words we have</Typography>
      {data.map((s, i) => <Typography marginY={1} key={i} variant='subtitle1' component="p">{s}</Typography>)}
    </Box>
  );
};

export default SuggestionBox;