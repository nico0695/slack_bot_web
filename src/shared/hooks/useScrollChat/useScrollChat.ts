import { useEffect, useRef, useState } from 'react';

const useScrollChat = <T>(list?: T[]) => {
  const [init, setInit] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (disableSmooth?: boolean) => {
    scrollRef?.current?.scrollTo({
      top: scrollRef?.current?.scrollHeight,
      behavior: disableSmooth ? 'instant' : 'smooth',
    });
  };

  useEffect(() => {
    if (list?.length && list?.length >= 0) {
      if (!init) {
        setInit(true);
        scrollToBottom(true);
        return;
      } else {
        scrollToBottom();
      }
    }
  }, [scrollRef, ...([list] ?? [])]);

  return [scrollRef];
};

export default useScrollChat;
