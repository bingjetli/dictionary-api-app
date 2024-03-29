import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from 'react';


const Lyric = ({ data, ...props }) => {
  return (
    <Box marginY={4}>
      <Typography variant="h5" component="h3">{data.songName} - {data.artist}</Typography>
      <Typography variant="body1" component="p">{data.lyrics}</Typography>
    </Box>
  );
};

export default Lyric; 