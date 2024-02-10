import React from 'react';

import { getTextToSpeech } from '@services/textToSpeech/textToSpeech.server-service';

import TextToSpeech from './page.client';

const fetchData = async (page: number) => {
  const data = await getTextToSpeech(page);

  return data;
};

const TextToSpeechContainer = async () => {
  const initialData = await fetchData(1);

  return <TextToSpeech initialAudioList={initialData} />;
};

export default TextToSpeechContainer;
