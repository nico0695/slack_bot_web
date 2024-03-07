'use client';
import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { IAlert } from '@interfaces/alerts.interfaces';
import { getAlerts } from '@services/alerts/alerts.service';

import styles from './alerts.module.scss';

import { ActionTypes } from '@constants/form.constants';

import { useToggle } from '@hooks/useToggle/useToggle';

import Dialog from '@components/Dialog/Dialog';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import IconButton from '@components/Buttons/IconButton/IconButton';
import AlertForm from './components/AlertForm/AlertForm';
import { format } from '@formkit/tempo';

interface IAlertsProps {
  initialAlerts: IAlert[];
}

const Alerts = ({ initialAlerts }: IAlertsProps) => {
  const [isOpen, , openDialog, closeDialog] = useToggle();

  const [selectionData, setSelectionData] = useState<{
    action: ActionTypes;
    data?: IAlert;
  }>({
    action: ActionTypes.DETAIL,
    data: undefined,
  });

  const [alerts, setAlerts] = useState<IAlert[]>(initialAlerts);

  const fetchData = async () => {
    const data = await getAlerts();

    setAlerts(data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className={styles.alertsHeader}>
        <h4>Alertas</h4>

        <PrimaryButton
          label="Nueva alerta"
          onClick={() => {
            openDialog();
            setSelectionData({
              action: ActionTypes.CREATE,
              data: undefined,
            });
          }}
        />
      </div>
      <ul className={styles.alertsList}>
        {alerts.map((alert) => (
          <li key={alert.id} className={styles.alertItem}>
            <h5>{alert.message}</h5>

            <p>{alert.date && format(alert.date, 'YYYY-MM-DD HH:mm')}</p>
            <div className={styles.actionButtons}>
              <IconButton
                onClick={() => {
                  openDialog();
                  setSelectionData({
                    action: ActionTypes.DELETE,
                    data: alert,
                  });
                }}
              >
                <FaRegTrashAlt size={18} color={'var(--blue-bayoux-300)'} />
              </IconButton>
            </div>
          </li>
        ))}

        {alerts.length === 0 && <li>No hay alertas</li>}
      </ul>

      <Dialog title="Nueva alerta" isOpen={isOpen} hideModal={closeDialog}>
        <AlertForm
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

export default Alerts;
