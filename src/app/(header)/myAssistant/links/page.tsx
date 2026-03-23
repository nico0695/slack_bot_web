import React from 'react';

import { getLinks } from '@services/links/links.service';

import Links from './page.client';

const fetchData = async () => {
  const data = await getLinks();

  return data ?? [];
};

const LinksContainer = async () => {
  const initialData = await fetchData();

  return <Links initialLinks={initialData} />;
};

export default LinksContainer;
