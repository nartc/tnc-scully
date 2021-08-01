---
title: MacOS Dev Environment Setup 2021
description: Setting up a MacOS for web development in 2021
publishedAt: 2021-08-01
updatedAt: 2021-08-01
published: true
slug: 'macos-dev-setup'
tags: ['Programming']
authors: ['Chau Tran']
---

Hey there, welcome to my MacOS Setup guide 👋. Whether you have just got yourself a new laptop, or you've decided to wipe your machine and start over, congratulations on making the decision to improve your workflow. This guide is definitely not the best because there is no _one-size-fit-all_ setup for everyone. However, this guide has been serving me well over the past couple of years and I am sharing this with you all, as well as myself when I need to set up my machine again in the future.

> I use [https://sourabhbajaj.com/mac-setup/](https://sourabhbajaj.com/mac-setup/) as my reference but this particular guide focuses more on Web Dev.

## 1. Stay Up-to-date

The first thing you would want to do is to keep your Mac up-to-date. Go to `About this Mac -> Software Update` to update to the latest version of MacOS. New versions of MacOS usually contains security updates and bug fixes. This might take a while so if you plan to go out, run the update beforehand, or take a walk 🏃‍

## 2. Xcode

Next _tedious_ step is to install `Xcode`. Open `AppStore`, look for `Xcode` and install it. This, again, might take a while. However, a good thing is you can start working on step 3 while waiting on `Xcode` to finish installing.

After `Xcode` finishes, go ahead and run `Xcode` so you have `Xcode` setup for first time use. Next, open `Terminal` and run the following command to install `Xcode Command Line Tools` which is needed to install other tools.

```bash
xcode-select --install
```

## 3. System Preferences

Please check out [this guide](https://sourabhbajaj.com/mac-setup/SystemPreferences/) for your preferences on how to set up your Mac system-wide like `Dock`, `Trackpad` etc...

> Whatever preference you might have/do to your Mac, I'd highly recommend adjusting Repeat Key speed in `Keyboard`. Turn `Key Repeat` to **Fast** and `Delay Until Repeat` to **Short**

## 4. Homebrew


