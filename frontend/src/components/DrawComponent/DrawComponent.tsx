import { Box, Center, Container } from '@mantine/core';
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import Canvas from './Canvas';
import { socket } from '../../socket';
import { useEffect, useState } from 'react';
import { ConnectionState } from './ConnectionState';
import { Events } from './Events';
import { ConnectionManager } from './ConnectionManager';



export function DrawComponent() {

    const [isConnected, setIsConnected] = useState(socket.connected);

    // const [value, setValue] = useState('');
    const client = axios.create({ baseURL: 'http://192.168.1.11:3000' });
    useEffect(() => {
        function onConnect() {
          setIsConnected(true);
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }
    
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
    
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
        };
      }, []);



    return (
        <Container>
            {/* <Box maw={500} p="md" mx="auto" bg="var(--mantine-color-blue-light)"> */}
                {/* <Center> */}
                    <Canvas socket={socket}/>
                    <ConnectionState isConnected={ isConnected } />
                    <ConnectionManager />
                {/* </Center> */}
            {/* </Box> */}
        </Container>

    );

}





