# Uschi

Uschi is a Raspberry Pi powered personal helper. You talk it does.

![Uschi on Desk](https://github.com/falsanu/uschi/blob/main/docs/IMG_9515.jpg?raw=true)

Big shout out to:

https://github.com/hzeller/rpi-rgb-led-matrix

https://github.com/alexeden/rpi-led-matrix

## Features:

- Tram Departures
- Weather
- Screensaver
- Videoplayer
- CLI

## Planned Features

- octoPi connection
- image slideshow
- TTS
- STT
- ChatGPT

## Installation

For development you need to install the whole thing locally and on the raspberry. You can than sync from local computer to raspberry. You probably need to update some config files.

### Install video player on Raspberry Pi

```
git clone https://github.com/hzeller/rpi-rgb-led-matrix.git /tmp/rpi-rgb-led-matrix
cd /tmp/rpi-rgb-led-matrix/utils
sudo apt-get update
sudo apt-get install pkg-config libavcodec-dev libavformat-dev libswscale-dev
make video-viewer
mv video-viewer ~/_Projects/Uschi/Video
rm -rf /tmp/rpi-rgb-led-matrix
```

# Contributing

Feel free to contribute, lets discuss what could be done better.

# Contribution

Weather Icons
https://dribbble.com/shots/3247006-Daily-UI-Weather-card-icons
