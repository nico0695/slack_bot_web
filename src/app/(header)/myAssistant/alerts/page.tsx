import { getAlerts } from '@services/alerts/alerts.service';
import React from 'react';
import Alerts from './page.client';

const fetchData = async () => {
  const data = await getAlerts();

  return data ?? [];
};

const AlertsContainer = async () => {
  const initialData = await fetchData();

  return <Alerts initialAlerts={initialData} />;
};

export default AlertsContainer;
