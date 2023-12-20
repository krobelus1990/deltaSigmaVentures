import * as React from "react";
import { useState } from "react";

import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MoreVert from "@mui/icons-material/MoreVert";
import ListDivider from "@mui/joy/ListDivider";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import { Stack, ModalDialog, Textarea } from "@mui/joy";
import { API_URL } from "../config";

const deleteNote = async (id, getNotes) => {
  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  getNotes();
};

const updateNote = async (id, title, description, getNotes) => {
  let response = await fetch(`${API_URL}/update/${id}`, {
    method: "put",
    body: JSON.stringify({ title, description }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  getNotes();
};

export default function NoteCard({
  title,
  description,
  updated,
  id,
  getNotes,
}) {
  const [open, setOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  function EditModal({ id, getNotes }) {
    const [updatedTitle, setUpdateTitle] = useState(title);
    const [updatedDescription, setUpdatedDescription] = useState(description);

    const handleUpdate = () => {
      updateNote(id, updatedTitle, updatedDescription, getNotes);

      setUpdateModal(false);
    };

    return (
      <Modal open={updateModal} onClose={() => setUpdateModal(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" level="h2">
            Update a Note
          </Typography>

          <Stack spacing={2}>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Add title..."
              value={updatedTitle}
              onChange={(event) => setUpdateTitle(event.target.value)}
            />
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Add description..."
              minRows={2}
              value={updatedDescription}
              onChange={(event) => {
                setUpdatedDescription(event.target.value);
              }}
            />
            <Button onClick={() => handleUpdate()}>Update Note</Button>
          </Stack>
        </ModalDialog>
      </Modal>
    );
  }

  return (
    <Sheet
      sx={{
        width: 300,
        py: 3,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "sm",
        boxShadow: "md",
        cursor: "pointer",
      }}
      variant="outlined"
    >
      <Box
        sx={{ position: "" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            level="h4"
            component="h1"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            <b>{title}</b>
          </Typography>
          {}
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                sx={{ maxHeight: 4 }}
                slotProps={{ root: { variant: "outlined", color: "neutral" } }}
              >
                <MoreVert />
              </MenuButton>
              <Menu>
                <MenuItem onClick={() => setUpdateModal(true)}>Edit</MenuItem>
                <MenuItem
                  color="danger"
                  onClick={() => deleteNote(id, getNotes)}
                >
                  Delete
                </MenuItem>
              </Menu>
            </Dropdown>
          </div>
        </Box>
        <Typography
          level="body-sm"
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* update moal */}
      <EditModal id={id} getNotes={getNotes} />

      {/* modal */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 700,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: "calc(-1/4 * var(--IconButton-size))",
              right: "calc(-1/4 * var(--IconButton-size))",
              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
              borderRadius: "50%",
              bgcolor: "background.surface",
            }}
          />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            {title}
          </Typography>
          <Typography id="modal-desc" textColor="text.tertiary">
            {description}
          </Typography>
          <Typography mt={3} level="body-xs" textColor="text.tertiary">
            {updated}
          </Typography>
        </Sheet>
      </Modal>
    </Sheet>
  );
}
