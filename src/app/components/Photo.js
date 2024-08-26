import React from 'react';
import Image from 'next/image';

const Photo = ({ url, onClick }) => {
  return (
    <div>
      <div>
        <Image src={url} alt='image' width={100} height={100} priority />
      </div>

      <button type='button' onClick={onClick}>
        Delete
      </button>
    </div>
  );
}

export default Photo;
