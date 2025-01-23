'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import * as ClubRoomData from '../../../utils/clubRoom';
import styles from './ClubRoomDetails.module.css';

const ClubRoomDetails = () => {
  const pathname = usePathname();
  const roomNumber = pathname.split('/').pop();
  const [currentRoom, setCurrentRoom] = useState<ClubRoomData.ClubRoom | null>(null);

  useEffect(() => {
    const roomKey = `Step_${roomNumber}` as keyof typeof ClubRoomData;
    if (ClubRoomData[roomKey]) {
      setCurrentRoom(ClubRoomData[roomKey]);
    }
  }, [roomNumber]);

  if (!currentRoom) {
    return <div className={styles.roomNotFound}>Room details not found.</div>;
  }

  const { image, imageDescription, steps } = currentRoom;

  return (
    <div style={{ marginTop: '150px' }}>
      <div className={styles.clubRoomContainer}>
        <h1 className={styles.clubRoomTitle}><strong>Club Room Details</strong></h1>
        <div className={styles.imageContainer}>
          <Image
            src={image as string}
            alt={imageDescription}
            className={styles.clubRoomImage}
            width={500}
            height={300}
          />
          <p className={styles.imageDescription}>{imageDescription}</p>
        </div>
        <ul className={styles.stepsList}>
          <li>
            <strong>Step {steps.stepNumber}:</strong> {steps.description}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClubRoomDetails;
