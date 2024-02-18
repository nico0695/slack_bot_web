import Image from 'next/image';
import Link from 'next/link';

import notFoundImage from '../assets/images/not-found-image.png';

export default function NotFound() {
  return (
    <div className="not-found">
      <Image src={notFoundImage} alt={'404 - Not Found'} />

      <Link href="/">Go Home</Link>
    </div>
  );
}
