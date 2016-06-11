---
layout: post
title: "Synology Diskstation 1815+ - A Review"
date: 2016-06-11T10:52:58+05:30
categories: [Tech, Synology]
tags: [Tech, Synology]
summary: Diskstation Review - DSM, Hardware and a special review on Plex
description: To Plex or not to Plex
comments:   true
featured: true
post_format: [ ]
---

> I recently got hold of a Synology Diskstation Box after lurking over it for a long long time. I wanted a file organizer and I tried USB router with HDD but it caused more pains than easing off some.

Thanks to Amazon's brisk delivery I got the Diskstation + 4 HDDS delivered within a week when ordered from Amazon US to my Home in India, there were a couple of issues pertaining to Custom clearance other than that it was pretty smooth.

## DS-1815+ Specs:
* Quad Core CPU
* 450 MBPS+ Read / 400 MBPS+ Write
* 8 Drive Bays with max capacity of 8TB in each
* 4 LAN ports with link aggregation and failover support
* 2 DX-513 Supported for further expansion upto 150TB
* 4 USB-3 and e-SATA connections to connect with external drives
* RAID - 0/1/5/6/10 supported + SHR (Synology Hybrid RAID) support
* 2GB inbuilt RAM with Support till 6GB

I have configured the 4 hard drives that I bought with SHR with a disk tolerance of 1. So basically if a disk fails data remains intact and dead drive can be replaced to retain initial state. So right now SHR is utilising 25% Capacity (1 of four drives) but when all bays are utilized it will still be using 1 drive to provide failover.

I had a healthy comparison between QNAP, Freenas Devices and Synology and it appeared this one is a pretty good device at the price point. And on the day Amazon had a 100$ off additionally and I just went for it.

## DSM - OS
DSM is something really special about Synology, its a web based OS but pretty much feels like a desktop one. Its quirky and responsive. I have not had an issue with it and help docs are there at the right place. Just like spotlight in Mac it has a search bar where I can search for just anything - a file or help doc admin privileges or finding any App.

Files can be shared via FTP Server or mounted as NFS Drives or Samba for windows. If you have a fast enough wifi it just feels like an internal drive - A 24TB Internal Drive! :)

One feature that I really like a lot is quickconnect which Synology provides out of the box for free. Using this the web interface of NAS can be accessed via a link over the internet even remotely. If a direct connection can be established NAS is connected to directly otherwise it is routed via Synology Servers.

Synology has an Android as well as iOS app for managing it via Mobile. A number of web apps are present to be used out of the box like Surveillance Station, Download Station, Hyper Backup, Text Editor, Cloud Station Server, File Station,  High Availability manager to name a few.

![Some Apps](http://s33.postimg.org/4cvkv65pb/Screenshot_from_2016_06_11_20_20_11.png)

The current favorite app of mine is Plex, its an amazing software to organize and view Movie collection, Music, TV Series as well as Pictures. It automagically scans the Diskstation volumes specified for relavant media and fetches metadata from internet from various sources. With Quad core power of Diskstation 4+ optimised videos can be viewed at a time on different devices. It has an app for Samsung Smart tv, chromecast, Android, iOS.

![Movie Collection in Plex](http://s33.postimg.org/uvaf08nhb/Screenshot_from_2016_06_11_20_58_02.png)
Plex organises the collection beautifully, fetches Artwork, Trailers, Subtitles, Rating from number of sources and organises them. Content can be filtered by IMDB Rating, Genre, Release Date, Resolution , etc.

![Plex Music](http://s33.postimg.org/5nizmimlb/Screenshot_from_2016_06_11_21_00_36.png)
Plex Music Library

All in all its an amazing device for organising files and media, transform your home into smart home.

For any query about buying/setting up NAS/Plex, say Hello at : [Contact](/contact)