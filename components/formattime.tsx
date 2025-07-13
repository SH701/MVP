import { Timestamp } from "firebase/firestore";

export function formatTime(time: any) {
  if (!time) return '';
  const date = (time instanceof Timestamp)
    ? time.toDate()
    : new Date(time.seconds ? time.seconds * 1000 : time);

  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // 초 차이

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;
}
