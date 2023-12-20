import { useEffect, useState } from "react";
import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import ModeToggle from "./components/ModeToggle";
import Grid from "@mui/joy/Grid";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

// new note modal
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import NoteCard from "./components/NoteCard";
import IconButton from "@mui/joy/IconButton";
import empty from "../src/assets/empty.gif";

import { API_URL } from "./config";

function App() {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalopen] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  // getting notes
  const getNotes = async () => {
    console.log("get notes called");
    let result = await fetch(`${API_URL}/list`);
    result = await result.json();
    setNotes(result);
  };

  // searching notes
  const searchHandle = async (e) => {
    let key = e.target.value;
    if (key) {
      let result = await fetch(`${API_URL}/search/${key}`);
      result = await result.json();
      if (result) setNotes(result);
    } else {
      getNotes();
    }
  };

  function NewNoteModal() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const newNote = async () => {
      const response = await fetch(`${API_URL}/new`, {
        method: "POST",
        body: JSON.stringify({ title, description }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      getNotes();
      setTitle("");
      setDescription("");
      setModalopen(false);
    };

    return (
      <>
        <Button
          variant="solid"
          color="primary"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
          startDecorator={<Add />}
          onClick={() => setModalopen(true)}
        >
          New Note
        </Button>
        <IconButton
          sx={{
            position: "fixed",
            zIndex: 10,
            bottom: 60,
            right: 30,
            display: { sm: "none", xs: "inline-flex" },
          }}
          size="lg"
          variant="solid"
          onClick={() => setModalopen(true)}
          color="primary"
        >
          <Add />
        </IconButton>

        <Modal open={modalOpen} onClose={() => setModalopen(false)}>
          <ModalDialog
            aria-labelledby="basic-modal-dialog-title"
            aria-describedby="basic-modal-dialog-description"
            sx={{ maxWidth: 500 }}
          >
            <Typography id="basic-modal-dialog-title" level="h2">
              Create new note
            </Typography>

            <Stack spacing={2}>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Add title..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Add description..."
                minRows={2}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
              <Button onClick={() => newNote()}>Add Note</Button>
            </Stack>
          </ModalDialog>
        </Modal>
      </>
    );
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />

      <Box
        sx={{
          margin: 2,
          marginBottom: 4,
          paddingX: { sm: 1, md: 4 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <NewNoteModal />
        <Input
          type="text"
          sx={{ marginX: 2 }}
          placeholder="Type in here…"
          onChange={searchHandle}
          startDecorator={<SearchIcon />}
        />
        <ModeToggle />
      </Box>
      <Grid
        spacing={2}
        sx={{ flexGrow: 1, padding: { sm: 1, md: 4 }, marginBottom: 10 }}
      >
        {notes.length > 0 ? (
          <Grid
            md={10}
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ flexGrow: 1, paddingX: 4 }}
            gap={2}
          >
            {notes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                description={item.description}
                updated={item.updatedAt}
                id={item._id}
                getNotes={getNotes}
              />
            ))}
          </Grid>
        ) : (
          <div
            style={{
              height: "60vh",
              width: "50vw",
              borderRadius: 20,
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{
                height: "60%",
                width: { sm: "60%", md: "40%" },
                borderRadius: 20,
              }}
              src={empty}
              alt="empty"
            />
            <Typography
              level="h1"
              sx={{ fontSize: { xs: "0.7rem", md: "1.5rem" } }}
            >
              Nothing to see here, add notes.
            </Typography>
          </div>
        )}
      </Grid>
    </CssVarsProvider>
  );
}

export default App;
