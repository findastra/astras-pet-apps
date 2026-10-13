# Smart pin ideas: wear the pets

Astra wants a small wearable pin with a screen, connected over Wi-Fi, that shows the pictures of her pets.
Researched by Claude Opus 5.5 (head chat) on 2026-10-12. Prices and stock change; check before buying.
On the System Map this is the planned device "Smart pin", looked after by the Friendly Farmer.

## Four ways to do it

| Option | Screen | Connects by | Shows the pets how | Cost | Good for |
|---|---|---|---|---|---|
| **1. Divoom Emodo Pixel Badge** (buy) | Full-color pixel-art screen, clip-on | Divoom phone app ("wireless transfer"; the protocol is not stated) | Send each pet's picture from your phone; holds about 6,000 images | $49.99 at Divoom | The quickest pretty option; pixel art suits the pets |
| **2. Round photo badge pins** such as the NIKKO Dynamic Electronic Badge (buy) | 1.7 to 1.8 inch round color touchscreen (NIKKO: 360×360) | Bluetooth and a phone app (NIKKO: Beambox) | Send pictures and GIFs from your phone; NIKKO has 16 MB of storage | About $32 for a generic one | Cheap and round, but loaded by hand |
| **3. Pimoroni Badger 2040 W** (buy, program) | E-ink badge, black and white | **Wi-Fi** (Raspberry Pi Pico W inside) | A small program fetches the pets from GitHub by itself | About £33; often sold out | Wi-Fi and long battery life, but no color and a lanyard badge, not a pin |
| **4. Build a Wi-Fi pin** (build) | 1.28 inch round color screen, 240×240 (Waveshare ESP32-S3-LCD-1.28, or Seeed's XIAO ESP32S3 with the Round Display for XIAO) | **Wi-Fi** and Bluetooth, with battery charging on the board | Firmware downloads every pet's icon and mood from GitHub and rotates them on its own | Board about $15 to $25, plus a small battery and a case with a pin back | The real match: Wi-Fi, color, round, and it shows all the pets automatically |

## How option 4 would work with Astra's PetOS

- **The pictures** are already public on GitHub: registered pets' idle frames in `art/frames/<pet>/` and every other pet's
  96 px icon in `art/icons/`. A 240×240 round screen fits them well.
- **The moods** come from the Friendly Farmer's daily round in `status/pets-status.json`. The pin could show a sick pet
  first (something needs Astra), and otherwise rotate through everyone.
- **The Farmer manages the pin**: it is one more screen for the pets, like the desktop and the Farm.
- **Build steps**: board, small lithium battery, a 3D-printed or bought round case, a pin or magnet back, and firmware
  (Arduino or ESP-IDF) that joins Wi-Fi, downloads the PNGs, decodes them and draws them. The round screen needs a
  round-aware layout.

## Recommendation

- **Want it soon:** the Divoom Emodo. It is made for pixel art and clips onto a bag or jacket; you load the pets from your phone.
- **Want it to know the pets by itself:** build option 4. It is a small project that could become its own pet app.
- Both can happen: wear the Emodo now, build the Wi-Fi pin later.

## Sources

- [Divoom Emodo Pixel Art Display Badge](https://divoom.com/products/divoom-emodo-pixel-art-display-badge) and its [bundle listing](https://divoom.com/products/divoom-emodo-pixel-badge-flowtoo-bundle)
- [NIKKO Dynamic Electronic Badge (DroiX)](https://droix.net/?p=200004); generic round badges on [Walmart](https://www.walmart.com/c/kp/custom-pin)
- [Badger 2040 W at The Pi Hut](https://thepihut.com/collections/latest-raspberry-pi-products/products/badger-2040-w-pico-w-aboard-badger-w-only) and the [Raspberry Pi magazine review](https://magazine.raspberrypi.com/articles/badger-2040-w-pico-w-aboard-review)
- [Waveshare ESP32-S3-LCD-1.28](https://waveshare.com/esp32-s3-lcd-1.28.htm) and [notes on the touch version](https://www.atomic14.com/esp32/boards/waveshare-esp32-s3-touch-lcd-1-28/)
- [Getting started with Seeed's Round Display for XIAO](https://wiki.seeedstudio.com/get_start_round_display/) and [CNX Software on the XIAO ESP32S3 with the round display](https://www.cnx-software.com/2023/03/29/xiao-esp32s3-sense-camera-and-a-microphone-round-touchscreen-display/)
