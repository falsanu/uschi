#!/bin/sh

cwd=$(pwd)

export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

echo "Installing Uschi on Raspberry PI"

echo "Compiling Uschi"
cd Uschi && node_modules/typescript/bin/tsc

echo "Compiling HUD"
cd ../Hud && npm i --silent && node_modules/typescript/bin/tsc

echo "Compiling ImageSlider"
cd ../ImageSlider && npm i --silent && node_modules/typescript/bin/tsc

echo "Compiling ScreenSaver"
cd ../ScreenSaver && npm i --silent && node_modules/typescript/bin/tsc

echo "Compiling Schimpfolino"
cd ../Schimpfolino && npm i --silent && node_modules/typescript/bin/tsc
#scp -r dist/* pi@192.168.1.11:/home/pi/uschi-cli/Schimpfolino

echo "Compiling Frontend"
#cd ../frontend && nvm use 22 && npm i && npm run build

#scp -r dist/* pi@192.168.1.11:/opt/uschi-frontend

#cd ../Uschi 
#oclif pack tarballs
#scp dist/*arm64.tar.gz pi@192.168.1.11:/home/pi/uschi-cli


# echo "Installing VideoViewer"
# git clone https://github.com/hzeller/rpi-rgb-led-matrix.git /tmp/rpi-rgb-led-matrix
# cd /tmp/rpi-rgb-led-matrix/utils
# sudo apt-get update
# sudo apt-get install pkg-config libavcodec-dev libavformat-dev libswscale-dev
# make video-viewer
# mv video-viewer "$(pwd)/Video"
# rm -rf /tmp/rpi-rgb-led-matrix

# echo "copying rpi-led-matrix.node"
# cp "$(pwd)/Hud/node_modules/rpi-led-matrix/build/Release/rpi-led-matrix.node" "$(pwd)/Uschi/build"

echo "Installation done!"
echo "Connect to Uschi: ssh -l pi 192.168.1.11"
echo "start Uschi:"
