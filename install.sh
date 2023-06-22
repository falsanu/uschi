#!/bin/sh

cwd=$(pwd)

echo "Installing Uschi on Raspberry PI"
npm i

cd Uschi && npm i

echo "Installing HUD"
cd ../Hud && npm i

echo "Installing ScreenSaver"
cd ../Hud && npm i

echo "Installing VideoViewer"
git clone https://github.com/hzeller/rpi-rgb-led-matrix.git /tmp/rpi-rgb-led-matrix
cd /tmp/rpi-rgb-led-matrix/utils
sudo apt-get update
sudo apt-get install pkg-config libavcodec-dev libavformat-dev libswscale-dev
make video-viewer
mv video-viewer "$(pwd)/Video"
rm -rf /tmp/rpi-rgb-led-matrix

echo "copying rpi-led-matrix.node"
cp "$(pwd)/Hud/node_modules/rpi-led-matrix/build/Release/rpi-led-matrix.node" "$(pwd)/Uschi/build"

echo "Installation done!"
