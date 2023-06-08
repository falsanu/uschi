# Uschi

Uschi is a Raspberry Pi powered personal helper. You talk she does.

## Installation

For development you need to install

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
