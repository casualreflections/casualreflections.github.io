---
layout: post
title: "Sync vs Async write performance to Cassandra Server - A performance Evaluation"
date: 2016-05-21T10:52:58+05:30
categories: [Cassandra, Optimisation, Performance]
tags: [Cassandra, Optimisation, Performance]
summary: Performance improvement comparison between sync and async driver writes
description: Achieve best performance out of cassandra driver - async writes with error callbacks
comments:   true
featured: true
post_format: [ ]
---

> We had a requirement where we were ingesting a huge amount of data `~350M rows in 2-3 Hours` into a 3Node r3xlarge machine (64Gig Ram, 16 Cores). I used python driver at the client side and multiprocessing module to boot up a number of processes to ingest data into cassandra after picking up message from a queue and applying some operations on them.

> It worked great and we achieved decent speed, but while observing client performance logs, I observed that processes are using only 25-30% of CPU and possibly a lot of the time is spent in network IO waiting for response as I used `session.execute() instead of session.execute_async()`.

> I had known that execute_async would give best performance per worker and its obvious but I did not know how much and could not find a benchmark for the same. Also before going into production deployment it was extremely essential to test the failover cases with callbacks and implementation of threads per connection limitations so as to avoid uncalled for errors.

I created 2 tables, one for handling async writes and another for sync ones, the tables have 3 columns- `key bigint PRIMARY KEY, str text, value bigint`. All 3 of those were generated randomly per hit. I used google stopwatch to start stop timer and avoid unnecessary time which was spent in random data generation.

The results seem interesting, I have achieved approx `4x fast writes using async execution`. For Writing 1 Million records by a single worker it took `342.4s` for async writes, and `1229.5s` for synchronous ones. Time spent in random number generation came out to be `~35s` for both of these.

## Here is what I did for error handling:

{% highlight python%}
'''
errback function to be attached to future in case if some error occurs
'''
def errback_fn(error ,prepared_statement, statement_params):
    try:
        exception_count = 0
        global cassandra_session
        if cassandra_session is None or cassandra_session.is_shutdown or error:
            cassandra_session = get_cassandra_session()
        for key in cassandra_session.get_pool_state():
            for in_flight in cassandra_session.get_pool_state()[key]['in_flights']:
                print "in_flight count is ", in_flight
                if in_flight > 1000:
                    print "Future thread Sleeping for 500ms, in_flight is ", in_flight
                    time.sleep(.5)
            print "Open Count is ", cassandra_session.get_pool_state()[key]['open_count']

        while True:
            try:
                print "inside errback, after encountering error: ",error
                print "Statement is :",prepared_statement
                print "Params are :", statement_params
                # In case of errback I have used blocking execute statement with 5 retries.
                cassandra_session.execute(prepared_statement, statement_params)
                exception_count = 0
                break
            except:
                print traceback.format_exc()
                time.sleep(5)
                # Get a new cassandra session if the current session is exhausted or closed
                if cassandra_session is None or cassandra_session.is_shutdown:
                    cassandra_session = get_cassandra_session()
                exception_count += 1
                if exception_count > 5:
                    print "Severe Error Occured for statement: ", prepared_statement, " Params: ", statement_params, " Breaking out of loop"
                    break
                continue
    except:
        print traceback.format_exc()
{% endhighlight%}

> If there are more than 1000 queries which are in flight I am issuing a `sleep of 500ms` which sufficed the test conditions. This can be possibly lowered down in production.

## Generator approach for async can be found below:
{% highlight python %}
# Clear out existing rows if any
cassandra_session.execute("truncate table test.test_async;")
sw = stopwatch.StopWatch()
# Start the stopwatch for async test
sw.start('complete-async')
num_count_test = 1000000
for j in range(1, num_count_test):
    try:
        # start stopwatch for calculating time spent in random generation
        sw.start('async-randomgen')
        # Generate 2 random ints of size 1 to 1Million
        param1 = random.randint(1, 1000000)
        param2 = random.randint(1, 1000000)
        # Generate a random string of 20 Characters
        param3 = ''.join(random.choice(ascii_uppercase) for i in range(20))
        # stop the random gen stopwatch
        sw.stop('async-randomgen')
        for key in cassandra_session.get_pool_state():
            for in_flight in cassandra_session.get_pool_state()[key]['in_flights']:
                if in_flight > 1000:
                    print "Future thread Sleeping for 500ms, in_flight is ", in_flight
                    time.sleep(.5)
            # if cassandra_session.get_pool_state()[key]['open_count'] > 20:
            #     print "Future thread Sleeping for 500ms"
            #     time.sleep(.5)

        future = cassandra_session.execute_async(prepared_query,(param1,param2,param3))
        future.add_errback(errback_fn, prepared_query, (param1, param2, param3))
    except:
        print traceback.format_exc()
        if cassandra_session is None or cassandra_session.is_shutdown:
            print "Reinitializing Cassandra Session"
            cassandra_session = get_cassandra_session()
        continue

# Job is complete stop the async complete stopwatch
sw.stop('complete-async')
{%endhighlight%}


# For the other test - blocking execute one I used below approach:
{% highlight python %}
# Clearing out existing rows if any
cassandra_session.execute("truncate table test.test_non_async")
print "Truncated table test_non_async"

_start_non_async = time.time()
query = "INSERT INTO test_non_async(key,value,str) VALUES (?, ?, ?)"
prepared_query = cassandra_session.prepare(query)
prepared_query.consistency_level = ConsistencyLevel.LOCAL_ONE
print "Query Prepared for test_non_async"
sw.start('complete-non-async')
for l in range(1, num_count_test):
    # Start the stopwatch to find time spent in random gen
    sw.start('non-async-randomgen')
    # Generate 2 random ints of size 1 to 1Million
    param1 = random.randint(1, 1000000)
    param2 = random.randint(1, 1000000)
    # Generate a random string of 20 Characters
    param3 = ''.join(random.choice(ascii_uppercase) for m in range(20))
    # Stop the randomgen stopwatch
    sw.stop('non-async-randomgen')
    try:
        cassandra_session.execute(prepared_query, (param1, param2, param3))
    except:
        print traceback.format_exc()

sw.stop('complete-non-async')

print sw.accum

{% endhighlight %}

The line `sw.accum` at the very end prints the accumulated counts by each of the stopwatches used in the format:
{% highlight json %}
{complete-async': 342.4494869709015, 'complete-non-async': 1229.5772993564606, 'async-randomgen': 38.901955127716064, 'non-async-randomgen': 33.869492053985596}
{% endhighlight %}

Complete code can be found at [Github](https://gist.github.com/bhuvanrawal/502aa963cc9df25bc0a69ae0fb7be648)

## Use Cases:
* Almost everytime a write is performed, it can be done in async fashion in order for best performance
* Best case would be fast ingestion by limited client bandwidth

## Coming Up:
* Comparision with batched - Logged and Unlogged writes