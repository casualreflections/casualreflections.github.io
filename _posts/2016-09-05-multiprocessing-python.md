---
layout: post
title: "Python Multiprocessing - A design paradigm"
date: 2016-09-05T10:52:58+05:30
categories: [Tech, python]
tags: [Tech, python]
summary: Overview into multiprocessing in python & Global Interpreter Lock
description: Using the compute resources optimally to achive quick response times
comments:   true
featured: true
post_format: [ ]
---

> I was involved in a project recently which demanded writing a python module and a host of other scripts. It required writing a framework to ingest a good amount of data (Approx 120 GB every run) into program from cassandra & mysql and do certain reporting and data crunching tasks.
> One of the challenge that I faced was to find ways and means to scale out the program.

Being from a java background I went for multithreading. But that didnt seem working quite well as the module was bound to single core, it had to be redesigned differently.

I then googled a bit and found that its a pretty common problem around and there is quite some noise to remove it from python. In a nutshell it restricts the threads to share a single cpu core.

One of the solution was to scale the program using multiple multiprocesses. And that turned pretty easy although with some limitations.

A quick refresher for the ones who have been out of college for a while - **Multiple threads share memory space of parent process but multiple process dont.**

I tried multiprocessing Manager() to try for shared memory but it turned out to be not as efficient as the objects were found to be duplicated in the processes.

With limited scope available as far as sharing memory is concerned I decided to setup queues to transfer data from producers to consumers *multiprocessing.Queue()*, then created producers and consumers which shared the instance of the queue.

Also I used a shared memory bit as a flag to indicate to the consumers that producers have ended (and not wait indefinitely)

{% highlight python%}
# Boot up a Producer
queue = multiprocessing.Queue()
# A signal for consumer processes that producer has finished work
producer_completed     = multiprocessing.Value('i', 0)
producer_process = Process(target=mysql_access_layer.enqueue_rows, args=(queue, producer_completed, email_dictionary, logging_queue,))
producer_process.daemon = False
producer_process.name = 'mysql_producer'
producer_process.start()
logger.info("PID of Mysql Producer is : %d ", producer_process.pid)
{% endhighlight%}

{% highlight python%}
# Boot Consumer Processes to process Rows in input queue
consumer_proc_list = []
# consumer count as per requirement
consumer_count = 10
for i in range(0, consumer_count):
    consumer_proc = Process(target=row_consumer, args=(queue, producer_complete,))
    consumer_proc.daemon = False
    consumer_proc.name = 'cassandra_consumer-' + str(i)
    consumer_proc.start()        # Launch consumer_proc() as a separate python process
    consumer_proc_list.append(consumer_proc)
    logger.info("PID of Consumer %d is %d ", i, consumer_proc.pid)

# Join the processes into parent process
[consumer_proc.join() for consumer_proc in consumer_proc_list]
producer_process.join()
{% endhighlight %}

This design was used aggressively in multiple places to solve a number of problems and has given pretty good results

## Note:

#### 1. If the consumers are expected to be slow then it is extremely critical to rate limit producers by issuing sleep if `queue.qsize()` exceeds a certain limit otherwise queue may end up taking up entire memory and crash.

#### 2. Failover Mechanism - If producer process gets killed (OOM or some exception) then there has to be a way to signal the parent to restart it or if consumer shutdown is expected then to make the flag true

#### 3. High Scalability - To scale the program across multiple nodes zero mq / rabbit mq can be used as a queue in producer and consumers can be booted on physically different machines
