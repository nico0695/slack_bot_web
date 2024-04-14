'use client';
import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

import { INote } from '@interfaces/notes.interfaces';
import { getNotes } from '@services/notes/notes.service';

import styles from './notes.module.scss';

import { ActionTypes } from '@constants/form.constants';
import NoteForm from './components/NoteForm/NoteForm';

import { useToggle } from '@hooks/useToggle/useToggle';

import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import Dialog from '@components/Dialog/Dialog';
import IconButton from '@components/Buttons/IconButton/IconButton';

interface INotesProps {
  initialNotes: INote[];
}

const Notes = ({ initialNotes }: INotesProps) => {
  const [isOpen, , openDialog, closeDialog] = useToggle();

  const [selectionData, setSelectionData] = useState<{
    action: ActionTypes;
    data?: INote;
  }>({
    action: ActionTypes.DETAIL,
    data: undefined,
  });

  const [notes, setNotes] = useState<INote[]>(initialNotes);

  const fetchData = async () => {
    const data = await getNotes();

    setNotes(data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className={styles.notesHeader}>
        <h4>Notes</h4>

        <PrimaryButton
          label="Nueva nota"
          onClick={() => {
            openDialog();
            setSelectionData({
              action: ActionTypes.CREATE,
              data: undefined,
            });
          }}
        />
      </div>
      <ul className={styles.notesList}>
        {notes.map((note) => (
          <li key={note.id} className={styles.noteItem}>
            <h5>
              {note.title} <span>{note.tag}</span>
            </h5>
            <p>{note.description}</p>

            <div className={styles.actionButtons}>
              <IconButton
                onClick={() => {
                  openDialog();
                  setSelectionData({
                    action: ActionTypes.DELETE,
                    data: note,
                  });
                }}
              >
                <FaRegTrashAlt size={18} color={'var(--blue-bayoux-300)'} />
              </IconButton>

              <IconButton
                onClick={() => {
                  openDialog();
                  setSelectionData({
                    action: ActionTypes.UPDATE,
                    data: note,
                  });
                }}
              >
                <FaRegEdit size={18} color={'var(--blue-bayoux-300)'} />
              </IconButton>
            </div>
          </li>
        ))}

        {notes.length === 0 && (
          <li className={`${styles.noteItem} center`}>No hay notas</li>
        )}
      </ul>

      <Dialog title="Nueva nota" isOpen={isOpen} hideModal={closeDialog}>
        <NoteForm
          action={selectionData.action}
          data={selectionData.data}
          onSubmit={() => {
            fetchData();
            closeDialog();
          }}
        />
      </Dialog>
    </div>
  );
};

export default Notes;
