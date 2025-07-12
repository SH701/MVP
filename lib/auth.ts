import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '../lib/firebase';

interface Props{
    email:string;
    password:string;
}

export const userLogin = async({email,password}:Props)=>{
    return await signInWithEmailAndPassword(auth,email,password)
}
export const userSignup = async ({ email, password }: Props) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, 'users', user.uid), {
    email,
    createdAt: serverTimestamp(),
  });

  return userCredential;
};
export const userLogout = async () => {
  return await signOut(auth);
};