---
layout: post
title: "Performance tuning for java applications"
date: 2017-09-17T19:52:58+05:30
categories: [Tech, Java, Performance]
tags: [Tech, Java, Performance, Debugging]
summary: Basics of java performance tuning - understand heap
description: Understand java heap and how to tune it
comments:   true
featured: true
post_format: [ ]
---

> Special thanks to my colleague and friend **Anshul**, he has been indispensable in preparing this writeup.

In this blog, we will try and understand basic of jvm memory allocation, some jvm flags which should be put to use on production environments and sample programs to evaluate jvm strategy.

> Heck? Why is understanding jvm important? My app seems to work fine.

> Did you know that 20% java applications suffer from pauses of more than 5 seconds, not understanding jvm pauses may be inadvertently causing poor user experience.

It has been debated numerous times, what made java so special that it stood out of the park despite being invented in mid 90's as compared to its high level heavy weights - C/C++.

One of the prominent reason for distinct popularity and rise to fame is portability of application i.e. compile once run everywhere. Agreed that was a critical aspect which lead to creation of the language, however one may ask this question - is it really as important in today's paradigm with prominent use cases of language belonging to server side on the cloud with homogeneous platforms? Probably portability isnt the most important feature particularly for server side apps.

The other important aspect is java gives the developer nearly complete independence from managing memory, while memory leaks are certainly possible but possibility is reduced to minimum and thereby the time to develop and test an application is comparatively far lesser. No long running tests to check for that catastrophic missed free() call! And no explicit pointers means avoidance of the dreaded segmentation fault!

The programmer declares memory on the heap and jvm assumes responsibility to free memory in a background process called garbage collection. While it is certainly a gift and makes programming extremely less issue prone, it can lead to performance troubles if not understood and tuned appropriately(afterall gc is not controlled by the programmer), in this post we will try to understand how to tune a java application, understand the common jargons, avoid pitfalls and debug yourself out of one if you fall into it.

## Basics of JVM Heap:
Unlike C/C++/Python jvm maintains a max heap size beyond which it will not allow application to grow itself into this is called jvm parameter Xmx or MaxHeapSize. If not specified it is taken from default which can be found for your machine using `java -XX:+PrintFlagsFinal -version`. The jvm param Xms specifies the starting size of the heap which the jvm requests from OS to itself right at the beginning. As and when more memory is desired, jvm requests memory if possible from OS and allocates to itself till Xmx is reached.

When the garbage collector runs it causes the application threads to pause depending on the type of collector employed the pause can be short or quite long (the dreaded full GC).

There are several implementations of garbage collector algorithm like **Serial Collector, Parallel GC, Parallel old gc, CMS, G1GC**, etc. We will discuss default java8 implementation - Parallel collector for YoungGen & CMS for OldGen.

Java heap is broadly divided into 3 parts, namely **young gen, old gen & perm gen**. Young gen comprises of **Eden space** where new objects are allocated and 2 survivor spaces one of which is always empty. GC runs on young gen (eden + 1 used survivor) which is also reffered to as minor GC, the references which are old and are not in use are removed, the ones which are in use are transferred to remaining survivor space if it can fit in that space or promoted to old gen if either the age of objects has crossed the specified age limit or the size of used objects is more than the amount which can be fit in the empty survivor.

Its critical to understand why the algorithm is designed this way - in essence its to reduce the amount of space on which the GC algorithm operates on frequently. If we allow GC to run on full heap always and did not have a concept of old/yong gen we would have had long pauses leading to more unpredictable latencies and also there was a high probability of heap fragmentation - which is avoided by compacting collector. Majority of the times GC runs only on young gen allowing the application threads to run without large pauses.

## To tune your baby better - first understand it
One of the most common doubts people have while deploying server side java application is how much heap to allocate, what sould be the newGen/oldGen/survivorRatio, max pause times, etc.

While it is almost certain that there is no rule of thumb which can lead you to successful heap tuning(in kung fu panda terminology `There is no secret ingredient`), it is extremely critical to understand the kind of objects being allocated in order to determine the parameters. It is also important to have expectation of performance tuning activity either in terms of latency or throughput of application rarely ever can both be increased together.

For example - if improved latency is required, young gen size can be reduced. GC will run more frequently on young gen but application pauses will be short since the working set it will have to operate on will be less.

The larger heap you allocate, better the throughput will be in general but it will result in longer GC pauses as the algorithm will invariably run over larger memory space.

There are broadly 3 kinds of GC events - One on Young Gen, Minor GC as we have seen, CMS which operates on old gen and 3rd kind **Full GC**. Minor gc & Major GC are forgiving as far as thread pauses are concerned with minor pauses lasting few milliseconds to no greater than 1 sec if things are working fine and parallelism is exploited well. The third GC event - dreaded **Full GC** runs when jvm has absolutely run out of heap in order to allocate more memory and it is not possible to go further without pausing complete application. Full GC runs on the entire heap and can pause a 10GB+ heap application for 15-30 seconds, even more.

## Flags to use on production environment

`-server`

Usually -server flag is enabled by default esp on *nix platforms. It specifies that hotspot vm should tune the application as a long running server side application. The other option is -client, that enables quick startup and less aggressive JIT optimisations.

`-Xms and -Xmx` (or: -XX:InitialHeapSize and -XX:MaxHeapSize)

-Xmx specifies maximum heap for young gen and old gen combined. Xms is the amount of heap jvm will request at the time of application startup.

`-XX:+PrintGCTimeStamps -XX:+PrintGCDetails -Xloggc:[path to gc log file]`
`-XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M`

Use the above options to log GC details in a specified log with timestamp, 100MB max log file and 10 log files will be kept at max

`-XX:+PrintGCApplicationStoppedTime -XX:+PrintGCApplicationConcurrentTime`

This option will print the number of milliseconds application threads were stopped due to gc invocation.

`XX:MaxTenuringThreshold`

Determines number of gc cycles an object can go through before getting promoted to old gen.

`-XX:+PrintTenuringDistribution`

Prints the age distribution of objects after a gc is run. Output of this can be helpful in tuning survivor sizes, survivor ratio and MaxTenuringThreshold.

`-XX:+HeapDumpOnOutOfMemoryError and -XX:HeapDumpPath`

If in case the application goes out of memory and crashes, jvm will dump heap to a path specified in -Xx:HeapDumpPath, this can be useful in debugging which objects occupied large memory and could be leak suspects.

`-XX:PermSize and -XX:MaxPermSize`

While Xms and Xmx specify old and new gen heap sizes, we may want to specify and restrict PermGen size as well.

`-XX:InitialCodeCacheSize and -XX:ReservedCodeCacheSize`

Use these option to specify and restrict code cache, a memory area used by jvm for compilation and storage. This should rarely cause issues, but if it does it can potentially disable JIT compiler leading to glaring performance issues.

`-XX:+DisableExplicitGC`

This option will disable manual GC triggered anywhere in the application. Whenever we issue System.gc(), jvm can trigger a full gc leading to long STW pauses. One of the blogs illustrating problems faced with this flag disabled - [link](http://java-n-stuff.blogspot.in/2009/08/turn-on-disableexplicitgc-now.html).

`-XX:+PerfDisableSharedMem`

This will effectively disable tools like jstat, jps getting data out of your application, however this has seen improvements and has been discussed widely in community. More details on this [blog](http://www.evanjones.ca/jvm-mmap-pause.html).

`CMSInitiatingOccupancyFraction=[%of oldgen] UseCMSInitiatingOccupancyOnly`

CMSInitiatingOccupancyFraction will instruct the jvm to start CMS when specific percentage of oldgen is utilized, UseCMSInitiatingOccupancyOnly will disable gc heuristics and will kickin cms only when CMSInitiatingOccupancyFraction limit is reached.


## I tried hard, I gave my best tuning strategy but my app ditched me - that dreaded OOM error

From an ignorant perspective once an OOM strikes, the easiest way out would be to ignore it as an one off incident and restart the application. While that can solve the issue for that instant or probably some more but it cannot guarantee you sound sleep.

It is critical to enable heap dump on OOM error param of jvm in order to for the jvm to dump memory onto disk before killing itself and for you to have the ability to investigate what went wrong. For this two params need to be added `-XX:+HeapDumpOnOutOfMemoryError` and path of dump file generated `-XX:HeapDumpPath=[output heapdump path]`

It is also important to have approprate gc logging enabled which can give insight into the potential issues that could be present in application.

Websites such as [gceasy](http://gceasy.io/) analyze log files and display in a graphical format and recommend potential issues with jvm heap.

## Sample programs for understanding heap analysis tools

### Sample Program-1
Healthy application with only short lived objects
{% highlight java%}
    public static void newHealthy() {
        Random r = new Random();
        String[] x = new String[100];
        while (true) {
            for (int i = 0; i < 100; i++) {
                x[i] = String.valueOf(r.nextDouble());
            }
        }
    }
{% endhighlight %}

![](https://image.ibb.co/kxtXR5/Screen_Shot_2017_09_18_at_1_14_26_AM.png)
![](https://image.ibb.co/n7Jctk/Screen_Shot_2017_09_18_at_1_15_05_AM.png)

It can be observed that very few objects are getting promoted to oldgen and almost all are collected by minor collections. In screenshot of jstat the OU column (Oldgen Utilised) is continuously showing 0, while Eden Utilised (EU) is filling up continuously.
This is evident from code as we are continuously inserting random string at same array index thereby freeing earlier references and making them eligible for garbage collection.

### Sample Program-2
{% highlight java %}
    public static void oldHealthy() {
        Map map = System.getProperties();
        Random r = new Random();
        String[] x = new String[100];
        // large initial hashmap to occupy some old heap
        Map<String, String> oldMap = new HashMap<>(10000000);
        while (true) {
            //map.put(r.nextInt(), "value");
            for (int i = 0; i < 100; i++) {
                x[i] = String.valueOf(r.nextDouble());
            }
        }
    }
{% endhighlight %}

This program is similar to sample-1 with the only difference being a hashmap with large memory being allocated which will be promoted to oldgen and occupy space there.


### Sample program-3
{% highlight java %}
    public static void oldUnhealthy() {
        Random r = new Random();
        String[] x = new String[100];
        Map<String, Myclass> oldMap = new HashMap<>(1000000);

        while (true) {
            for (int i = 0; i < 100; i++) {
                Myclass myclass = new Myclass("ABC");
                //x[i] = String.valueOf(r.nextDouble());
                if (i == 50) {
                    //oldMap.put(String.valueOf(r.nextDouble()),
                    //    String.valueOf(r.nextDouble()));
                    oldMap.put(String.valueOf(r.nextDouble()), myclass);
                    LockSupport.parkNanos(15000);
                }
            }
        }
    }

    static class Myclass {
        private String myStr;

        Myclass(String myStr) {
            this.myStr = myStr;
        }
    }

{% endhighlight %}

This program causes heap pressure on old gen leading to OOM error and jvm exiting. We are continuously inserting strong references into oldMap HashMap and memory is thus being leaked. The application tries to run for a while before falling into full gc trap eventually leading to OOM.

![](https://preview.ibb.co/niN1m5/Screen_Shot_2017_09_18_at_1_26_25_AM.png)

Once jvm is unable to recover memory it goes down with OOM as can be seen in logs below:

        Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
            at java.util.HashMap.newNode(HashMap.java:1742)
            at java.util.HashMap.putVal(HashMap.java:630)
            at java.util.HashMap.put(HashMap.java:611)
            at App.oldUnhealthy(App.java:147)
            at App.main(App.java:194)

Also heapdump file is created as we had enabled it in jvm params.

Heap dump file created [5748492 bytes in 2.021 secs]


### Sample program-4
{% highlight java %}
class DeadlockSample {

    String str1 = "str1";
    String str2 = "str2";

    Thread trd1 = new Thread("My Thread 1"){
        public void run(){
            while(true){
                synchronized(str1){
                    // Acquired lock on str1
                    Thread.sleep(1000l);
                    synchronized(str2){
                        try{

                            System.out.println("Inside thread1, I wanna deadlock sleeping for 10000ms" + str1 + str2);
                            Thread.sleep(10000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }

                    }
                }
            }
        }
    };

    Thread trd2 = new Thread("My Thread 2"){
        public void run(){
            while(true){
                synchronized(str2){
                    // Acquired lock on str2
                    Thread.sleep(100l);
                    synchronized(str1){
                        while (true) {
                            try {
                                System.out.println(
                                    "Inside thread2, I wanna deadlock sleeping for 5000ms"
                                        + str1
                                        + str2);
                                Thread.sleep(5000);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }
            }
        }
    };
}

{% endhighlight %}

This sample displays deadlock here we are creating two threads, both of which lock one object and are waiting for the other object locked by other thread, thereby they are locked forever.

When viewed in visualvm, it clearly detects that deadlock has happened, this can be observed in threaddump as well.

![](https://image.ibb.co/c7EQDk/Screen_Shot_2017_09_18_at_1_31_47_AM.png)

### Sample program-5
{% highlight java %}
class ThreadAWaiting {
    public static void testWaiting(){
        ThreadBWaiting b = new ThreadBWaiting();
        b.setName("Thread B");
        b.start();

        synchronized(b){
            try{
                System.out.println("Waiting for b to complete...");
                b.wait();
            }catch(InterruptedException e){
                e.printStackTrace();
            }

            System.out.println("Total is: " + b.total);
        }
    }
}

class ThreadBWaiting extends Thread{
    int total;
    @Override
    public void run(){
        synchronized(this){
            for(int i=0; i<10000 ; i++){
                System.out.println(i);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            notify();
        }
    }
}
{% endhighlight %}

This sample displays an example of a thread taking lock on an object and other thread which is waiting for its completion, finally relinquishing control. This can be observed in screenshot below as well:

![](https://image.ibb.co/fSAFDk/Screen_Shot_2017_09_18_at_1_33_33_AM.png)

## References

[1. Oracle JVM Tuning guide](https://docs.oracle.com/cd/E21764_01/web.1111/e13814/jvm_tuning.htm#PERFM150)
[2. Oracle garbage collection tuning](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/)
[3. Understanding memory management](https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/garbage_collect.html)
[4. Disable perf shared mem](http://www.evanjones.ca/jvm-mmap-pause.html)
[5. Turn on DisableExplicitGC now](http://java-n-stuff.blogspot.in/2009/08/turn-on-disableexplicitgc-now.html)
[6. Best kept secret in jdk - jvisualvm](https://dzone.com/articles/best-kept-secret-jdk-visualvm)
[7. Jvm statistics with jstat](https://www.javacodegeeks.com/2017/05/jvm-statistics-jstat.html)
[8. Deadlock detection with java](https://meteatamel.wordpress.com/2012/03/21/deadlock-detection-in-java/)

Here is a talk Anshul and me had given on JVM Tuning.
<script async class="speakerdeck-embed" data-id="9a9c6f11dea445d38498934a8183bd8e" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>
