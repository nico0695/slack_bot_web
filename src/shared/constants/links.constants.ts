export enum LinkStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

export const linkStatusText = {
  [LinkStatus.UNREAD]: 'Sin leer',
  [LinkStatus.READ]: 'Leído',
  [LinkStatus.ARCHIVED]: 'Archivado',
};

export const linkOptions = [
  { label: linkStatusText[LinkStatus.UNREAD], value: LinkStatus.UNREAD },
  { label: linkStatusText[LinkStatus.READ], value: LinkStatus.READ },
  { label: linkStatusText[LinkStatus.ARCHIVED], value: LinkStatus.ARCHIVED },
];

export const nextLinkStatus: Record<LinkStatus, LinkStatus | null> = {
  [LinkStatus.UNREAD]: LinkStatus.READ,
  [LinkStatus.READ]: LinkStatus.ARCHIVED,
  [LinkStatus.ARCHIVED]: null,
};

export const nextLinkStatusLabel: Record<LinkStatus, string | null> = {
  [LinkStatus.UNREAD]: 'Marcar leído',
  [LinkStatus.READ]: 'Archivar',
  [LinkStatus.ARCHIVED]: null,
};
