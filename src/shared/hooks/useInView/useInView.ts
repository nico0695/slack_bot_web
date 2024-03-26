import { useEffect, useRef, useState } from 'react';

const useInView = (threshold = 0.5) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      const observer = new IntersectionObserver(
        (entries) => {
          setIsVisible(entries[0].isIntersecting);
        },
        { threshold }
      );
      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }
  }, [ref, threshold, isVisible]);

  return { ref, isVisible };
};

export default useInView;
