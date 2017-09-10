---
layout: post
title: "Performance tuning for java applications"
date: 2017-09-09T19:52:58+05:30
categories: [Tech, Java, Performance]
tags: [Tech, Java, Performance, Debugging]
summary: Basics of java performance tuning - understand heap
description: Understand java heap and how to tune it
comments:   true
featured: true
post_format: [ ]
---

It has been debated numerous times, what made java so special that it stood out of the park despite being invented in mid 90's as compared to its high level heavy weights - C/C++.

One of the prominent reason for distinct popularity and rise to fame is portability of application i.e. compile once run everywhere. Agreed that was a critical aspect which lead to creation of the language, however one may ask this question - is it really as important in today's paradigm with majority use cases of language belonging to server side on the cloud with consistent platforms? Probably portability isnt the most catchy feature afterall for server side apps, in today's world.

The other important aspect is java gives the developer nearly complete independence from managing memory, while memory leaks are certainly possible but possibility is reduced to minimum and thereby the time to develop and test an application is comparatively far lesser. No long running tests to check for that catastrophic missed free() call! And no explicit pointers means avoidance of the dreaded segmentation fault!

The programmer declares memory on the heap and jvm assumes responsibility to free memory in a background process called garbage collection. While it is certainly a gift and makes java extremely less bug prone, it can lead to performance troubles if not understood and tuned appropriately, in this post we will try to understand how to tune a java application, understand the common jargons, avoid pitfalls and debug yourself out of one even if you fall into it.

## Basics of JVM Heap:
Unlike C/C++/Python jvm maintains a max heap size beyond which it will not allow application to grow itself into this is called jvm parameter Xmx or MaxHeapSize. If not specified it is taken from default which can be found for your machine using `java -XX:+PrintFlagsFinal -version`. The jvm param Xms specifies the starting size of the heap which the jvm requests from OS to itself right at the beginning. As and when more memory is desired, jvm requests memory if possible from OS and allocates to itself till Xmx is reached.

When the garbage collector runs it causes the application threads to pause depending on the type of collector employed the pause can be short or quite long (the dreaded full GC).

There are several implementations of garbage collector algorithm like **Serial Collector, Parallel GC, Parallel old gc, CMS, G1GC**, etc. We will discuss default java8 implementation - Parallel collector for YoungGen & CMS for OldGen.

Java heap is broadly divided into 3 parts, namely young gen, old gen & reserved cache for code, etc. Young gen comprises of **Eden space** where new objects are allocated and 2 survivor spaces one of which is always empty. GC runs on young gen (eden + 1 used survivor) which is also reffered to as minor GC, the references which are old and are not in use are removed, the ones which are in use are transferred to remaining survivor space if it can fit in that space or promoted to old gen if either the age of objects has crossed the specified age limit or the size of used objects is more than the amount which can be fit in the empty survivor.

Its critical to understand why the algorithm is designed this way - in essence its to reduce the amount of space on which the GC algorithm operates on frequently. If we allow GC to run on full heap always and did not have a concept of old/yong gen we would have had long pauses leading to more unpredictable latencies and also there was a high probability of heap fragmentation - which is avoided by compacting collector. Majority of the times GC runs only on young gen allowing the application threads to run without large pauses.

## To tune your baby better - first understand it
One of the most common doubts people have while deploying server side java application is how much heap to allocate, what sould be the newGen/oldGen/survivorRatio, max pause times, etc.

While it is almost certain that there is no rule of thumb which can lead you to successful heap tuning(in kung fu panda terminology `There is no secret ingredient`), it is extremely critical to understand the kind of objects being allocated in order to determine the parameters. It is also important to have expectation of performance tuning activity either in terms of latency or throughput of application rarely ever can both be increased together.

For example - if improved latency is required, young gen size can be reduced. GC will run more frequently on young gen but application pauses will be short since the working set it will have to operate on will be less.

The larger heap you allocate, better the throughput will be in general but it will result in longer GC pauses as the algorithm will invariably run over larger memory space.

There are broadly 3 kinds of GC events - One on Young Gen, Minor GC as we have seen, CMS which operates on old gen and 3rd kind **Full GC**. Minor gc & Major GC are forgiving as far as thread pauses are concerned with minor pauses lasting few milliseconds to no greater than 1 sec if things are working fine and parallelism is exploited well. The third GC event - dreaded `Full GC` runs when jvm has absolutely run out of heap in order to allocate more memory and it is not possible to go further without pausing complete application. Full GC runs on the entire heap and can pause a 10GB+ heap application for 15-30 seconds, even more.



## I tried hard, I gave my best tuning strategy but my app ditched me - that dreaded OOM error

From an ignorant perspective once an OOM strikes, the easiest way out would be to ignore it as an one off incident and restart the application. While that can solve the issue for that instant or probably some more but it cannot guarantee you sound sleep.

It is critical to enable heap dump on OOM error param of jvm in order to for the jvm to dump memory onto disk before killing itself and for you to have the ability to investigate what went wrong. For this two params need to be added `-XX:+HeapDumpOnOutOfMemoryError` and path of dump file generated `-XX:HeapDumpPath=/Users/bhuvanrawal/heap_dump/`

Usually -server flag is good enough for jvm to optimise.

java -Xmx100m -XX:SurvivorRatio=1 -XX:+PrintGCDetails -XX:+PrintTenuringDistribution -XX:+PrintGCDateStamps -XX:+UseParallelGC -XX:HeapDumpPath=/Users/bhuvanrawal/git/testModule/src/main/java/test -XX:+HeapDumpOnOutOfMemoryError App

DisableExplicitGC - disable system.gc() - it runs a full gc everytime
CMSInitiatingOccupancyFraction - at what percentage should CMS kick in
UseCMSInitiatingOccupancyOnly - prevents gc heretics and kicks in at CMSInitiatingOccupancyFraction
-XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M
