import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function useWebSocket(triggers:string[]) {
  const { data: session } = useSession();
    const [message, setMessage] = useState<string|null>(null);


    const connectToSocket = (url:string)=>{
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log('WebSocket Connected');
      };

      socket.onmessage = (event) => {
        // Update the state when a message is received
        console.log('WebSocket Message Received');
        if(triggers.includes(event.data)){
            setMessage(event.data + new Date().getTime().toString());
        }
      };

      socket.onclose = () => {
        console.log('WebSocket Closed, Reconnecting');
        connectToSocket(url);
      };

      return socket;
    }

  useEffect(() => {
    
    if (!session?.user) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    if (!baseUrl) {
        console.error('API_BASE_URL is not defined in environment variables')
        return
    }
    const socketUrl = baseUrl.replace('https://', 'wss://').replaceAll('http://', 'ws://');
    const authorizedSocketUrl = socketUrl + '?token=' + session?.user.accessToken
        
    const socket = connectToSocket(authorizedSocketUrl);

    return(()=>{
      socket.close();
    })
  },[session?.user.accessToken]);

  return {
    message
  }
};


