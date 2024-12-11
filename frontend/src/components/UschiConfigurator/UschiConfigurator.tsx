import { Button, Group, useMantineColorScheme } from '@mantine/core';
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export function UschiConfigurator() {

    const activateService = async (service:string) => {
        console.log(service);

        const client = axios.create();
        
        try {
            const response = await client.get('/startService/'+service);
            console.log(response);
          } catch (error) {
            console.error(error);
          }

    }

    return (
        <Group justify="center" mt="xl">
            <Button onClick={() => activateService('hud')}>HUD</Button>
            <Button onClick={() => activateService('hudschool')}>School</Button>
            <Button onClick={() => activateService('imageslider')}>Images </Button>
            <Button onClick={() => activateService('screensaver')}>Screensaver </Button>
            <Button onClick={() => activateService('video')}>Video</Button>
            <Button onClick={() => activateService('schimpfolino')}>Schimpfolino</Button>
            <Button onClick={() => activateService('off')}>aus</Button>
        </Group>
    );
}





