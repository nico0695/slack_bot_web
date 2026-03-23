'use client';
import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaLink, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { ILink } from '@interfaces/links.interfaces';
import { getLinks, updateLink } from '@services/links/links.service';
import {
  LinkStatus,
  linkOptions,
  linkStatusText,
  nextLinkStatus,
  nextLinkStatusLabel,
} from '@constants/links.constants';
import { ActionTypes } from '@constants/form.constants';
import { useToggle } from '@hooks/useToggle/useToggle';

import styles from './links.module.scss';
import LinkForm from './components/LinkForm/LinkForm';

import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import Dialog from '@components/Dialog/Dialog';
import IconButton from '@components/Buttons/IconButton/IconButton';

interface ILinksProps {
  initialLinks: ILink[];
}

const getLinkTitle = (link: ILink): string => {
  if (link.title) return link.title;
  try {
    return new URL(link.url).hostname.replace('www.', '');
  } catch {
    return link.url.slice(0, 40);
  }
};

const Links = ({ initialLinks }: ILinksProps) => {
  const [isOpen, , openDialog, closeDialog] = useToggle();

  const [selectionData, setSelectionData] = useState<{
    action: ActionTypes;
    data?: ILink;
  }>({
    action: ActionTypes.DETAIL,
    data: undefined,
  });

  const [links, setLinks] = useState<ILink[]>(initialLinks);
  const [statusFilter, setStatusFilter] = useState<LinkStatus | 'all'>('all');

  const fetchData = async () => {
    const data = await getLinks();
    setLinks(data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusAdvance = async (link: ILink) => {
    if (!link.id) return;
    const next = nextLinkStatus[link.status];
    if (!next) return;

    const ok = await updateLink(link.id, { status: next });
    if (ok) {
      fetchData();
    } else {
      toast.error('Error al actualizar el link');
    }
  };

  const filterOptions = [{ label: 'Todos', value: 'all' as const }, ...linkOptions];
  const filteredLinks =
    statusFilter === 'all' ? links : links.filter((l) => l.status === statusFilter);

  return (
    <div>
      <div className={styles.linksHeader}>
        <h4>Links</h4>

        <PrimaryButton
          label="Nuevo link"
          onClick={() => {
            openDialog();
            setSelectionData({ action: ActionTypes.CREATE, data: undefined });
          }}
        />
      </div>

      <div className={styles.filterChips}>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`${styles.chip}${statusFilter === option.value ? ` ${styles.chipActive}` : ''}`}
            onClick={() => setStatusFilter(option.value as LinkStatus | 'all')}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul className={styles.linksList}>
        {filteredLinks.map((link) => {
          const nextStatus = nextLinkStatus[link.status];
          const nextLabel = nextLinkStatusLabel[link.status];

          return (
            <li key={link.id} className={styles.linkItem} data-status={link.status}>
              <div className={styles.linkContent}>
                <h5>{getLinkTitle(link)}</h5>
                <span className={styles.linkUrl}>{link.url}</span>
                {link.tag && <span className={styles.linkTag}>{link.tag}</span>}
              </div>

              <div className={styles.linkMeta}>
                <span className={styles.statusBadge} data-status={link.status}>
                  {linkStatusText[link.status]}
                </span>

                {nextStatus && nextLabel && (
                  <button
                    className={styles.statusChip}
                    onClick={() => handleStatusAdvance(link)}
                  >
                    {nextLabel}
                  </button>
                )}
              </div>

              <div className={styles.actionButtons}>
                <IconButton onClick={() => window.open(link.url, '_blank')}>
                  <FaExternalLinkAlt size={16} color={'var(--blue-bayoux-300)'} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    openDialog();
                    setSelectionData({ action: ActionTypes.DELETE, data: link });
                  }}
                >
                  <FaRegTrashAlt size={18} color={'var(--blue-bayoux-300)'} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    openDialog();
                    setSelectionData({ action: ActionTypes.UPDATE, data: link });
                  }}
                >
                  <FaRegEdit size={18} color={'var(--blue-bayoux-300)'} />
                </IconButton>
              </div>
            </li>
          );
        })}

        {filteredLinks.length === 0 && (
          <li className={styles.emptyState}>
            <FaLink size={32} />
            {links.length === 0 ? (
              <>
                <p>No tenés links guardados todavía</p>
                <button
                  className={styles.emptyStateAction}
                  onClick={() => {
                    openDialog();
                    setSelectionData({ action: ActionTypes.CREATE, data: undefined });
                  }}
                >
                  Guardar primer link
                </button>
              </>
            ) : (
              <p>No hay links con ese estado</p>
            )}
          </li>
        )}
      </ul>

      <Dialog title="Link" isOpen={isOpen} hideModal={closeDialog}>
        <LinkForm
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

export default Links;
