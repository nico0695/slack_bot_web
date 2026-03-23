'use client';

import { adminLinks } from '@components/Header/constants/navLink.constants';
import { Profiles } from '@constants/users.constants';
import { useAuthStore } from '@store/useAuthStore';
import useStoreHydration from '@hooks/useStoreHydration/useStoreHydration';
import Link from 'next/link';
import React from 'react';

const AdminRoutes = () => {
  const data = useStoreHydration(useAuthStore, (state) => state.data);

  if (!data || data.profile !== Profiles.ADMIN) {
    return null;
  }

  return (
    <>
      {adminLinks.map(({ label, route }) => (
        <Link href={route} key={route}>
          <li>{label}</li>
        </Link>
      ))}
    </>
  );
};

export default AdminRoutes;
