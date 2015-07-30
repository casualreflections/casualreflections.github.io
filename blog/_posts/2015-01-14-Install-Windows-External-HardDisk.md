---
layout:     post
title:      Boot windows from external USB hard drive for UEFI motherboards
date:       2015-01-14 23:21:29
summary:    Booting windows from an external hard disk drive of your laptop if you dont want to install it in your primary laptop hard disk.
categories: [main_blog]
post_format: [ ]
---

## This post will help you install windows on an external USB hard disk and boot from it

Recent motherboards come with UEFI bios. Other methods which i found on the internet did not work when tried to install windows on my own computer which has Fedora in its primary hard disk. Hence this tutorial!

## Requirements

* A windows PC
* Windows iso version earlier than xp, Windows 10 is supported.
* A spare hard drive

## Making your external hard drive bootable with windows: 

* Create an extra partition on your hard drive with 500MB space and filesystem FAT-32
* Go to [link](http://download.cnet.com/WinToUSB/3000-2094_4-76061723.html?part=dl-&subj=dl&tag=button) and download the WinToUSB software.
* Run the software, install it on your computer, connect the external hard drive where you want to install windows.
* Select the iso image of windows in the first page.
* In the second page select the newly created 500 MB fat32 partition as the system partition and the other partition as boot partition.
* Click on next. Windows will be installed on your secondary hard drive.
* When the process is finished connect the hard disk into a computer where you want to install windows, in the boot menu select external hard drive.
* Windows installation will start.

### Note: Do not plug in the hard drive into any other computer than the intended one as during the first boot as it will start installing drivers for that system.
