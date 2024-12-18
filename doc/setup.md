# Setup Uschi

For development you need to install the whole thing locally and on a raspberry pi. Then, you can sync from your local computer to Uschi (on raspberry). You probably need to update some config files.

## Raspberry Pi Installation
- Install Raspberry Pi via [raspberry Pi Imager](https://www.raspberrypi.com/software/)
- OS: `Raspberry Pi OS Lite (64Bit)`


### Install matrix (driver) needs on Raspberry Pi

```
git clone https://github.com/hzeller/rpi-rgb-led-matrix.git /tmp/rpi-rgb-led-matrix
cd /tmp/rpi-rgb-led-matrix/utils
sudo apt-get update
sudo apt-get install pkg-config libavcodec-dev libavformat-dev libswscale-dev
make video-viewer
mv video-viewer ~/_Projects/Uschi/Video
rm -rf /tmp/rpi-rgb-led-matrix
```

Further and better documentation you can find on @hzeller's documentation page: https://github.com/hzeller/rpi-rgb-led-matrix?tab=readme-ov-file


# LED-Panel setup

- Connect the controller board with pi
- Setup LEDs to 2 parallel and three chained panels
- Power LEDs from LED power supply
- Power Raspberry via controller board from LED power supply

## 3D-Prints

I printed some parts to hold the LED-Panels together and created some kind of a foot. Feel free to modify these files for your needs.

- [LED-Panel-Connector-v2](3DPrint/LED-Panel-Connector-v2.stl)
- [LED-Stand-v1](<3DPrint/LED-Stand v1.stl>)

Big shoutout to Adobe for the personal use policy of [Fusion360](https://www.autodesk.com/products/fusion-360/personal)


# Development Setup

## Connecting local environment with Uschi on Pi

- make sure nodejs is installed on local machine (recommending to use [nvm](https://github.com/nvm-sh/nvm))
- `git clone https://github.com/falsanu/uschi` on local machine
- `cd uschi`
- configure `/sync.config.json`according to your setup (Raspberry IP, Folder on Raspberry, etc)
- `npm install`
- `npm run sync`

If everything works as expected, your current uschi-Folder should be synced with your raspberry pi. 

**Attention:** If you plan to develop your own programs, you need to update the [nodemon.sync.json](../nodemon.sync.json). Make sure to add the folder for your new programm in the `watch` array

**But!** 
In order to run correctly on the raspberry, you need to compile all Programms (see below) on the raspberry itself. (It is possible to spawn the programs with ts-code but it took ages on RPi3 to compile the typescript). Check [Install on Pi Script](../installOnPi.sh) and adopt on your needs



## Management
[Uschi](../Uschi) 
This tool is the Dispatcher, running as a service on Raspberry Pi. Uschi is a CLI-Tool which comes with two tools.
1. uschi-cli
   within uschi you can run
2. uschi-webserver
   - Provides the frontend
   - API
   - Frontend will be read from /opt/uschi-frontend

Uschi comes with an environment file `/Uschi/.env.example`. 
- `mv .env.example .env`
- `vim .env`
- 
```bash
OCTO_API_KEY=YOUROCTOAPIKEY
OCTO_API_URL=http://IP-OF-OCTOPI/api
BVG_STATIONS="900140017 900141506"
IMAGE_FOLDER="/absolute/path/on/raspberry"
CALENDAR_URL=url_to_ical
```

To find corresponding BVG_Stations check: https://v6.bvg.transport.rest/getting-started.html

It is possible, that there is some error handling missing, if one of these env-variables is not set. If you have that issue, please contribute or set the env-Variables with nonsense



## Programs

These programms get spawned by Uschi (the cli-tool). Therefor don't forget to compile each typescript application on the raspberry.

### [Draw](../Draw)
- adds the possibility to draw on screen via websocket (socket.io) or API

### [HUD](../Hud) 
- shows calendar, public transport, weather, time, octoprint

### [HUDSchool](../HudSchool) 
- shows lesson plans for n kids

### [ImageSlider](../ImageSlider) 
- loads images from folder given by env variable in Uschis Management Software

### [Schimpfolino](../Schimpfolino) 
- throws bad words to you
  
### [ScreenSaver](../ScreenSaver) 
- An animation test based on my p5js sketch using `matrix.afterSync()`

### [Video](../Video)
- starts an C++ - Application and passes an path to a file
- The video should be prepared (scaled to LED screen size) in order to reduce flickering through heavy computing. See https://github.com/hzeller/rpi-rgb-led-matrix for further information.


## Uschi as service on Raspberry Pi

Create Service File in `/etc/systemd/system/`
- `vim /etc/systemd/system/uschi.service`

```ini
[Unit]
Description=Uschi runs on rpi
After=network.target

[Service]
ExecStart=/home/pi/_Uschi/uschi/Uschi/bin/run webserver
Restart=always
User=0
Group=0
Environment=NODE_ENV=production
WorkingDirectory=/home/pi/_Uschi/uschi/Uschi

[Install]
WantedBy=multi-user.target
```

- start service `sudo systemctl start uschi.service`
- enable service on raspbi start `sudo systemctl enable uschi.service`
- to stop uschi `sudo systemctl stop uschi.service`
- to check uschis status `sudo systemctl status uschi.service`
- logging Uschis STDOUT/STDERR 

## Working with uschi
I create some aliases in my .zshrc (or .alias)

```bash
alias uschi_stop="sudo systemctl stop uschi.service"
alias uschi_sart="sudo systemctl start uschi.service"
alias uschi_log="journalctl -u uschi.service -f"
```

