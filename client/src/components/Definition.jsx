import { Chip } from '@mui/material';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import React from 'react';


const Definition = ({ data, ...props }) => {

  const formatHeadword = (unformatted_headword) => {
    return unformatted_headword.replaceAll("*", " • ");
  };

  return (
    <Box marginTop={1} marginBottom={4}>
      <Stack direction="row" spacing={2}>
        <Chip sx={{ textTransform: "uppercase" }} label={data.functionalLabel} />
        <Typography sx={{ color: "InactiveCaptionText" }} variant="h5" component="h2">{formatHeadword(data.headword)}</Typography>
      </Stack>
      {data.definitions.map((def, i) => (<Typography key={i} marginTop={5} marginLeft={2} variant="body1" component="p">{def}</Typography>))}
    </Box>
  );
};

export default Definition; 