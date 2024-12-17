import { Button, Group, useMantineColorScheme, Textarea, Title, Card, Container, Box, Flex, Text, Space } from '@mantine/core';
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { wrap } from 'module';
import { useState } from 'react';
import { DrawComponent } from '../DrawComponent/DrawComponent';

export function UschiConfigurator() {
    const [value, setValue] = useState('');
    const client = axios.create({baseURL:'http://192.168.1.11:3000'});
    const activateService = async (service: string) => {
        console.log(service);

        try {
            const response = await client.get('/startService/' + service);
            console.log(response);
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <>
            <Container>
                <Box maw={500} p="md" mx="auto">
                        <Group align='stretch'>
                            <Button  onClick={() => activateService('hud')}>HUD</Button>
                            <Button onClick={() => activateService('hudschool')}>School</Button>
                            <Button onClick={() => activateService('imageslider')}>Images </Button>

                            <Button onClick={() => activateService('screensaver')}>Screensaver </Button>
                            <Button onClick={() => activateService('video')}>Video</Button>
                            <Button onClick={() => activateService('schimpfolino')}>Schimpfolino</Button>

                            <Button onClick={() => activateService('off')}>aus</Button>
                        </Group>
                </Box>

                <Box style={{ overflow: 'hidden' }}>

                    <Box maw={500} p="md" mx="auto" bg="var(--mantine-color-blue-light)">
                        <Title order={4}>Drawing</Title>
                        <Button onClick={() => activateService('draw')}>Draw</Button>
                        <Space  h="md" ></Space>
                        <Text size="sm" mb={5}>
                        Write some Text
                        </Text>

                        <Group grow wrap="nowrap">
                        <Textarea
                            value={value}
                            onChange={(event) => {
                                setValue(event.currentTarget.value)
                                client.post('/message', { message: event.currentTarget.value })

                            }}
                        />
                        </Group>
                        <Button mb={5} w={"100%"}>clear</Button>
                        <DrawComponent />
                    </Box>
                    
                </Box>
                


            </Container>
        </>
        
        
          
    );
}





