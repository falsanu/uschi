# Uschi

Uschi is a Raspberry Pi powered personal helper. You talk it does.

![Uschi on Desk](doc/images/IMG_9515.jpg?raw=true)

Big shout out to:

**[Henner Zeller](https://github.com/hzeller)**  
for creating this awesome piece of software:  
https://github.com/hzeller/rpi-rgb-led-matrix

**[Alex Eden](https://github.com/alexeden)**  
for creating these awesome nodejs/typescript bindings:  
https://github.com/alexeden/rpi-led-matrix

## Features:

- **Public Transport:** BVG-Stations around you
- **3DPrinting:** Status of your running 3D-Print over OctoPrint
- **Calendar:** Display your personal or family Calender
- **School:** Display your childrens lLesson plans
- **Sports:** Display Soccer Results for your preferred leagues via openligaDB
- **Images:** Slide through a defined folder of images
- **Video:** Show (at least) one video
- **Screensaver:** An animation test based on my p5js sketch
- **Draw:** Possibility to draw on LED-Panel via web `Canvas` interface
- **Text:** Write on your Screen via web interface
- **Fun:** Let Uschi insult you with [Schimpfolino](https://github.com/NikolaiRadke/Schimpfolino)

## Planned Features

- creating one single Config-File to manage Uschi as a system
- Playing Games on this thing, propably snake
- Speach to text "Du, Uschi? - Show the Calander"
- Text To Speach
- ChatGPT

## Installation

see [Setup](doc/setup.md)


## Shopping List
(no affiliate links)
### Raspberry
Raspberry Pi 5 
[Reichelt](https://www.reichelt.de/raspberry-pi-5-b-4x-2-4-ghz-8-gb-ram-wlan-bt-rasp-pi-5-b-8gb-p359846.html?&trstct=vrt_pdn&nbc=1)  
Power Supply
[Reichelt](https://www.reichelt.de/raspberry-pi-netzteil-5-1-v-5-0-a-usb-type-c-eu-schwarz-rpi-ps-27w-bk-eu-p360111.html?&nbc=1&trstct=lsbght_sldr::359846)  
Cooling
[Reichelt](https://www.reichelt.de/raspberry-pi-luefter-fuer-raspberry-pi-5-rasp-active-cool-p360116.html?&nbc=1&trstct=lsbght_sldr::359846)  
SD-Card (any size > 16GB will be ok)
[Reichelt](https://www.reichelt.de/microsdhx-speicherkarte-256gb-sdsqxcd256ggn6ma-p358292.html?&trstct=pol_1&nbc=1)

### LEDs

6x RGB-LED-Matrix-Panel, 2 mm, 64 x 64 Pixel
[RoboShop](https://eu.robotshop.com/de/products/rgb-vollfarb-led-matrix-panel-2-mm-abstand-64-x-64-pixel-einstellbare-helligkeit)


## LED Power Supply
- without fan 
- a lot of watts, as 24,576 LEDs need to be powered in the end

[Ebay](https://www.ebay.de/itm/310840219652)
Must still be configured according to the LET-panels

_Uschi Uses:_
Output voltage: 1: +5V,
Structure: LED power supply (IP67), power supply series: 
08: LPV-100 (100W series)

*Propably a 45W alternative is working too, but I haven't tested yet*
[Amazon](https://www.amazon.de/gp/product/B00MWQF08C/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)


### Raspberry Pi Hat
Joy-IT Matrix-Controllerboard für RGB-LED-Matrix, inkl Lüfter
[ELV](https://de.elv.com/p/joy-it-matrix-controllerboard-fuer-rgb-led-matrix-inkl-luefter-P251185/?utm_source=google&utm_medium=cpc&utm_campaign=Gads_de)





# Contributing

Feel free to contribute, lets discuss what could be done better.



# Contribution

[Weather Icons](https://dribbble.com/shots/3247006-Daily-UI-Weather-card-icons  
)
[Socket.io](https://github.com/socketio/socket.io)  
[mantine.dev](https://mantine.dev)  
https://github.com/hzeller/rpi-rgb-led-matrix  
https://github.com/alexeden/rpi-led-matrix  
