import React from 'react';

import { getNotes } from '@services/notes/notes.service';

import Notes from './page.client';

const fetchData = async () => {
  const data = await getNotes();

  return data ?? [];
};

const NotesContainer = async () => {
  const initialData = await fetchData();

  return <Notes initialNotes={initialData} />;
};

export default NotesContainer;
