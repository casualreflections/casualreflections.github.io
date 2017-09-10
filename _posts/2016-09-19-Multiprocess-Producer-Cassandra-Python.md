---
layout: post
title: "Multiprocess producer for cassandra table in python"
date: 2016-09-19T02:52:58+05:30
categories: [Tech, Cassandra, Python]
tags: [Tech, Cassandra, Python]
summary: Achieve fast scan in python
description: Slice scan task across multiple processes for achieving quick scans
comments:   true
featured: true
post_format: [ ]
---

> Consider having to scan A large table with say 10 Million rows plus in cassandra. A single threaded producer will take its own time cycling through token ranges from `-2**63 -1 till +2**63 5000` rows a time or your specified `fetch_size`. There is potential to optimise how to do better off hand scans and we will explore it in this post.

A cassandra scan works in principle on a single thread with most of the time consumed by io between client-coordinator network hop as well as coordinator to participating nodes hop.

Things can be really fast if the token range can be split and divided across multiple processes. (Threads can be used in case of Java. Python - GIL limitation). In case of Java single cluster reference can also be used.

A simple use case is aggregation for `count(*)` while it is certainly possible using cqlsh, it times out most of the times for large tables. Reason being there is a full scan happening and large amount of data is being transferred to the coordinator.

While a simple hack can help doing count with cqlsh by connecting it with something like `cqlsh --connect-timeout=1000 --request-timeout=1000` it still puts a lot of pressure on coordinator to pull lot of data on its heap from other nodes, is incredibly slow and can impact other queries running on the cluster.

**Solution:** Why not count on client itself? Slice the rows give it to producers, share an atomic counter across to processes. The processes will distribute the load across the cluster evenly assuming TokenAwarePolicy is used. And almost always it is guaranteed to be faster.

### Usage - Call the method multiprocess_producer_paginated with below parameters:

* statement of the form - `SELECT col1,col2… from my_table where Token(x,y) >= %d AND token(x,y) < %d` here x,y are the partition key members
* A multiprocessor queue - `multiprocessor.Queue()` or `multiprocessor.Manager().Queue()`. It was found during dry runs that latter behaved slightly faster, more on that later
* keyspace - keyspace of the table
* num_producers - set appropriate number of processes to launch for fetching rows. Depends on size of cluster and speed with which fetches are to be performed
* email_dictionary - a multiprocessor dict which can be used to track progress. In this case i have used it to sent status via a mail by reading this dict
* logger_name - in case if this method is used in multiple places a loggername can be used for legibility
* is_completed_producer - A signal to processes reading queue that producers have been completed. In this case multiprocessing.Value() has been used multiprocessing.Event() can be also used to signal

> Joinable Queue can also be used for this purpose (task_done() method) but its much slower in comparison. [Ref.](http://stackoverflow.com/questions/8463008/python-multiprocessing-pipe-vs-queue)

### Note : For counting this method can be further simplified and queue can completely avoided, only counter needs to be updated in that case. This avoids message Serialization & Deserialization overhead.

{% highlight python %}

def multiprocess_producer_paginated(statement, queue, keyspace, num_producers, is_completed_producer, email_dictionary, logger_name=''):
    """
    Statement should be in the format Select x,y,z from sometable where token(x) >= '%d' AND token(k) < '%d';"
    Token range will be split into num producers and concurrent read will happen
    :param statement:
    :param queue:
    :param keyspace:
    :return:
    """
    logger = logging.getLogger()
    logger.info("Initiated Cassandra Producer")

    producer_proc_list = []
    _start = time.time()
    print "Start Time is - ",_start

    if num_producers == 0 or num_producers is None :
        num_producers = 1

    # consumer count as per requirement
    workers = num_producers
    multiprocessing.Array('i', range(workers))
    count = Counter(0)
    range_slice = 2**64 / workers
    start_range = -2**63
    for i in range(0, workers):
        # Hack for ending token range
        if start_range + range_slice == 2**63:
            logger.info("Worker %d, Start Range : %d , End Range : %d", i, start_range, 2**63 -1)
            consumer_proc = Process(target=multiprocess_row_producer, args=(keyspace,statement, queue, count, start_range, 2**63-1, email_dictionary, logger_name, True))
        else:
            logger.info("Worker %d, Start Range : %d , End Range : %d", i, start_range,start_range + range_slice )
            consumer_proc = Process(target=multiprocess_row_producer, args=(keyspace,statement,queue, count, start_range, start_range+range_slice, email_dictionary, logger_name, True))
        # Sleep for couple of seconds before starting next consumer, dont overwhelm the cluster
        time.sleep(2)
        start_range = start_range + range_slice
        consumer_proc.daemon = False
        consumer_proc.name = 'cassandra_consumer-' + logger_name + str(i)
        consumer_proc.start()        # Launch consumer_proc() as a separate python process
        producer_proc_list.append(consumer_proc)
        logger.info("PID of Consumer %d is %d ", i, consumer_proc.pid)

    # Join the processes into parent process
    [consumer_proc.join() for consumer_proc in producer_proc_list]
    is_completed_producer.value = 1

    logger.info("Count of bucket_content_attributes_mappings table is %d",count.value())
    logger.info("Time Taken For Counting

{% endhighlight %}



### Each subprocess works on the method multiprocess_row_producer

In case if a Timeout or some other exception is encountered, exponential retry mechanism is used and previous result’s paging state is reinjected back.

{% highlight python %}

def multiprocess_row_producer(keyspace,query, queue, counter, start_range, end_range, email_dictionary, logger_name, check_spillover=False):

    global cassandra_session
    logger = logging.getLogger('multiprocess')
    logger.info("Initiated Cassandra Producer")

    if cassandra_session is None or cassandra_session.is_shutdown:
        cassandra_session = connection_manager.get_cassandra_session()
        cassandra_session.set_keyspace(keyspace)

    row_count = 0
    cql_command = query % (start_range, end_range)
    exception_count = 0
    slice_count = 0
    previous_paging_state = None
    exception_occurred = True
    simple_statement = SimpleStatement(cql_command, fetch_size=5000)
    cassandra_session.row_factory = tuple_factory

    while True:
        try:
            if previous_paging_state is None:
                rs = cassandra_session.execute(simple_statement)
            elif exception_occurred == True:
                logger.error("Retrying query %s with Paging State %s", str(query), str(previous_paging_state))
                rs = cassandra_session.execute(cql_command, paging_state=previous_paging_state)

            rows = rs.current_rows
            previous_paging_state = rs.response_future._paging_state
            queue.put(rows)

            if queue.qsize() > 1000:
                logger.info("Sleeping for 10 Seconds as Queue Size Large")
                time.sleep(10)

            counter.update(len(rows))
            email_dictionary['Count Processed ' + logger_name] = str(counter.value())
            logger.info("Process : %s Fetched %d", str(multiprocessing.current_process().name), len(rows))
            logger.info("Process : %s Total Rows Fetched by all processes %d", str(multiprocessing.current_process().name), counter.value())

            sw = stopwatch.StopWatch()
            sw.start('fetch-loop-initiated')
            if not rs.has_more_pages:
                # No More Pages to fetch
                break
            rs.fetch_next_page()
            sw.stop('fetch-loop-initiated')

            # After every Fetch Sleep for 100 ms to avoid pushing limits
            time.sleep(.1)
            logger.debug("Time taken to fetch %d rows is %s", len(rs._current_rows) ,str(sw.accum))
            exception_occurred = False
            exception_count = 0

        except Exception as ex:
            exception_occurred = True
            exception_count +=1
            if exception_count > 64:
                logger.exception("Breaking out of producer due to exception")
                break
            # In case of Time out exception or if some mis happening occurs
            # Exponential retry till 64**2 in the worst case thats more than 1 Hour
            time.sleep(exception_count**2)
            logger.exception("Exception occurred while fetching page, retrying again with same page")
            continue

    # Close cassandra session as work is completed by producer
    cassandra_session.shutdown()

{% endhighlight %}
THE ATOMIC COUNTER USED IS OF THE BELOW TYPE:
{% highlight python %}
class Counter(object):
    '''
    Counter implementation for counting across multiple processes
    Multiprocess Lock is taken on count variable before any operation
    '''
    def __init__(self, initval=0):
        self.val = Value('i', initval)
        self.lock = Lock()

    def increment(self):
        with self.lock:
            self.val.value += 1

    def update(self, delta):
        with self.lock:
            self.val.value += delta

    def value(self):
        with self.lock:
            return self.val.value
{% endhighlight %}

### Parent process could be of the below form:

{% highlight python %}
manager = multiprocessing.Manager()
content_queue = manager.Queue()
is_completed_producer = multiprocessing.Value('i', 0)
producer_process = Process(target=multiprocess_producer_paginated, args=("SELECT col1,col2 from my_table where token(x) >= '%d' AND token(k) < '%d' ", content_queue, "my_keyspace", 30, is_completed_producer, email_dictionary, 'my_table_producer' ))
producer_process.daemon = False
producer_process.name = 'cassandra_standard_mapping_producer'
producer_process.start()
logger.info("PID of standard count creation producer is %d", producer_process.pid)

num_consumers = 10
# Boot up consumers to pick up messages pushed by cassandra consumers
for i in range(0, num_consumers):
    consumer_proc = Process(target=queue_processor, args=(content_queue, is_completed_producer,  email_dictionary))
    consumer_proc.daemon = False
    consumer_proc.name = 'cassandra_standard_count_middleware' + str(i)
    consumer_proc.start()        # Launch reader() as a separate python process
    logger.info("Sleeping for 10 Seconds before booting up a consumer")
    consumer_proc_list.append(consumer_proc)
    logger.info("PID of Cassandra standard Count Consumer %d is %d", i, consumer_proc.pid)

# Join the processes back into parent process
[consumer_proc.join() for consumer_proc in consumer_proc_list]
producer_process.join()

{% endhighlight %}

### Each consumer process calls queue_processor method which listens to queue and does work on input queue

{% highlight python %}
def queue_processor(content_queue, is_completed_producer,  email_dictionary):
    """
    :param content_queue: Input queue with containing messages to be processed. Each message is a set of rows from cassandra producer
    :param is_completed_producer: Signal from cassandra process that it has finished producing rows
    :param email_dictionary: Push tracking information into this dict
    """
    logger = logging.getLogger()
    logger.info("Cassandra Queue Processor")
    while is_completed_producer.value is 0 or content_queue.qsize() > 0:
        try:
            try:
                # Get a message containing set of rows
                message = content_queue.get(block=False, timeout=.5)
            except Queue.Empty:
                logger.info("Give Me work Ive gone jobless")
                time.sleep(.1)
                continue
            except Exception as ex:
                logger.exception("Exception while fetching from queue, retrying")
                time.sleep(1)
                continue

            logger.info("Queue Status %d ", content_queue.qsize())
            # Message fetched is a set of rows producer by cassandra producer process

            # Do some work on the message, say print each row

            for row in message:
                print row

        except Exception as ex:
            logger.exception("Exception Occurred during processing cassandra message")
            continue
{% endhighlight %}


Complete source can be found at [Github](https://gist.github.com/bhuvanrawal/93c5ae6cdd020de47e0981d36d2c0785)


