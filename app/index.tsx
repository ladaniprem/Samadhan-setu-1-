import React, { useEffect, useState } from 'react'
import * as SecurStore from 'expo-secure-store';
import { Redirect } from 'expo-router';

export default function index() {
     const [loggedInUser, setloggedInUser] = useState(false);
     const [Loading, setloading] = useState(true);

     useEffect(() => {
       const subscriber = async () => {
        const token = await SecurStore.getItem("access_token");
        setloggedInUser(token ? true : false);
        setloading(false);
       };
       subscriber();
     }, []);

     return (
    <>
      { Loading ? (
        <></>
        ) : (
            <Redirect href={!loggedInUser ? "/(routes)/onboarding/" : "/(tabs)"} />
           )
           }
    </>
    );
}