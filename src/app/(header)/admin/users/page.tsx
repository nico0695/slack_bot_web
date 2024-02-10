import React, { Suspense } from 'react';
import Link from 'next/link';

import { FaSearch } from 'react-icons/fa';

import styles from '@styles/table.module.scss';

import { getUsers } from '@services/users/users.service';
import { IPaginationResponse } from '@interfaces/pagination.interfaces';
import { IUsers } from '@interfaces/users.interfaces';
import { formatDateString } from '@utils/formaters/dateFormaters';
import Loading from './loading';

const fetchData = async (
  page: number
): Promise<IPaginationResponse<IUsers>> => {
  const data = await getUsers({ page });

  return data;
};

const Users = async () => {
  const users = await fetchData(1);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <h4 className={styles.title}>Usuarios</h4>
        <div className={styles.simpleTable}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Username</th>
                <th>Name</th>
                <th>Slack</th>
                <th>Supabase</th>
                <th>Register</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users?.data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.username}</td>
                  <td>{`${item.lastName} ${item.name}`}</td>
                  <td>{item.slackId}</td>
                  <td className={styles.w10}>{item.supabaseId}</td>
                  <td>{formatDateString(item.createdAt)}</td>
                  <td>
                    <Link href={`/admin/users/${item.id}`}>
                      <FaSearch size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Suspense>
    </div>
  );
};

export default Users;
