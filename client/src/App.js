import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DictionaryResult from "./components/DictionaryResult";
import Lyric from './components/Lyric';
import { TextField } from '@mui/material';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SuggestionBox from './components/SuggestionBox';


function App() {

  //State
  const [dictionary_result, setDictionaryResult] = useState(null);
  const [lyric_result, setLyricResult] = useState(null);
  const [search_word, setSearchWord] = useState("");
  const [suggestions, setSuggestions] = useState(null);


  //References
  const timeout_ref = useRef(null);


  //Functions
  const lookupWord = () => {
    if (search_word.length < 3) {

      //Don't bother running a fetch request if the word is not long enough.
      return;
    }


    fetch(`/api/define?word=${search_word}`)
      .then(res => res.json())
      .then(json => {

        //Verify if the search was successful.
        if (json.data.length === 0 && "suggestions" in json) {

          console.log(json);
          setDictionaryResult(null);
          setLyricResult(null);
          setSuggestions(json.suggestions);
        }
        else {

          //Otherwise, draw the dictionary response.

          //Begin another fetch request to find the lyrics.
          fetch(`/api/search-lyrics?word=${search_word}`)
            .then(res => res.json())
            .then(json => {
              console.log(json);
              setLyricResult(json.lyrics);
            })
            .catch(error => console.log(error));


          //Redraw the component.
          setDictionaryResult(json.data);
          setSuggestions(null);
        }

      })
      .catch(error => console.log(error));
  };


  const handleChange = (event) => {
    setSearchWord(event.target.value);
  };


  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {

      //Kill the timer to avoid double fetch requests.
      clearTimeout(timeout_ref.current);
      lookupWord();
    }
  };



  //SideEffects
  useEffect(() => {
    if (search_word.length >= 3) {

      //If there is an existing timer, kill it first.
      if (timeout_ref.current !== null) {
        clearTimeout(timeout_ref.current);
      }


      //Try to search the dictionary for a word automatically after 1s.
      timeout_ref.current = setTimeout(() => {
        console.log("Performing search for word..");
        lookupWord();
      }, 1000);
    }
    else {

      //If there is an existing timer, kill it.
      if (timeout_ref.current !== null) {
        clearTimeout(timeout_ref.current);
      }

    }
  }, [search_word]);


  return (
    <main>
      <Container maxWidth="sm">
        <Stack>
          <Box marginTop={5}>
            {
              dictionary_result === null ?
                <>
                  <Typography sx={{ textAlign: "center" }} variant='h1' component='h1'>Afficher</Typography>
                  <Typography sx={{ textAlign: "center", color: "InactiveCaptionText" }} marginBottom={4} variant='h6' component='h2'>Powered by Merriam-Webster Dictionary and OpenAI.</Typography>
                </> : null
            }
            <TextField fullWidth label="Lookup the definition of" margin="dense" value={search_word} onChange={handleChange} onKeyDown={handleKeyDown} />
          </Box>
          {/*search_word.length > 3 ? <Typography variant="h1" component="h1">{search_word}</Typography> : null*/}
          {suggestions !== null ? <SuggestionBox data={suggestions} /> : null}
          {dictionary_result !== null ? <DictionaryResult data={dictionary_result} /> : null}
          {lyric_result !== null ?
            <>
              <Divider>LYRIC EXAMPLE</Divider>
              <Lyric data={lyric_result[0]} />
            </> : null
          }

        </Stack>
      </Container>
    </main>
  );
}

export default App;
