import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

const ANIMALS = ["Lion", "Tiger", "Elephant", "Giraffe", "Zebra"];
const STORAGE_KEY = "chat_username";
const generateRandomUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return `anony${word}-${nanoid(5)}`;
}

export const useUsername = () => {
    const [username, setUsername] = useState("");

      useEffect(() => {
    const main = ()=>{
      const storedUsername = localStorage.getItem(STORAGE_KEY);
      if(storedUsername) {
        setUsername(storedUsername);
        return;
      }
      const generated = generateRandomUsername();
      localStorage.setItem(STORAGE_KEY, generated);
      setUsername(generated);
    }
    main();
  }, [])

  return {username}
}