import React from 'react'
import { useAppSelector, useAppDispatch } from "../../reduxhooks";



export default function Login() {

    const email = useAppSelector((state) => state.login.email);
    const dispatch = useAppDispatch();
  return (
    <div>
   <h1>Shopping List</h1>
   {email}
    </div>
  )
}
