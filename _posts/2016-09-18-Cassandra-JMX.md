---
layout: post
title: "JMX & Cassandra - Maintaining & Monitoring at Scale"
date: 2016-09-19T02:52:58+05:30
categories: [Tech, Cassandra, JMX, Monitoring, Administration, Java]
tags: [Tech, Cassandra, JMX, Monitoring, Administration, Java]
summary: Cassandra & JMX - Made for each other
description: Monitor and Administer cassandra using jmx
comments:   true
featured: true
post_format: [ ]
---

> JMX (Java Management Extensions - JSR 262)  Provides tools for web based, modular extensions for monitoring java based applications. Starting with Java 5 JMX is plugged into Java SE.

> JMX helps monitor java application in two key ways 1. It helps understand app health in terms of memory, heap, cpu usage, threads, garbage collection, etc. Secondly, JMX allows you to work with specific aspects of app through instrumentation, i.e. putting wrapper in application code in order to allow JVM to gather data that external tool can use.
> More on JMX can be obtained by going through java.lang.management package

> Being a Storage Server it becomes critical to provide means to expose metrics as well as a way to change node config during runtime without restarting the node. JMX quite easily is the preferred choice as its pretty extensible, as compared to SNMP which is not very extensible and can only expose what is provided in that MIB.

## Overview of MBeans:

A managed bean or MBean is a special type of Java Bean that represents a single manageable resource inside the JVM. MBeans interact with an MBean server to make their functions remotely available. When an MBean is registered with the MBean server, it specifies an object name that is used to identify the MBean to JMX clients. An object name consists of a domain followed by a list of key-value pairs, atleast one of which must identify a type. Typical convention is to use chose a domain name that is similar to the Java package name of the MBean, and to name the type after MBean interface name.
Some simple values in application are exposed as attributes for example attribute PeakThreadCount of Threading Bean, which stores the greatest number of threads present in application at anytime since startup. Other MBeans are configurable for example JMXConfigurator bean in logback is configurable and loglevel can be altered at runtime using method setLoggerLevel `nodetool status` internally calls this functionality for getting & setting loglevels.

Another type of MBean operation is one that doesnt simply show a value, but lets you execute some useful action. dumpAllThreads and resetPeakThreadCount are two such operations.

## Cassandra MBeans :
Once connected with a jmx client like JConsole / Java Mission Control the MBeans can be managed. Cassandra's beans are organized in packages which start with `org.apache.cassandra`, one such example that can be looked over here is CompactionManagerMbean interface:

{% highlight java %}
package org.apache.cassandra.db.compaction;

import java.util.List;
import java.util.Map;
import javax.management.openmbean.TabularData;

public interface CompactionManagerMBean
{
    /** List of running compaction objects. */
    public List<Map<String, String>> getCompactions();

    /** List of running compaction summary strings. */
    public List<String> getCompactionSummary();

    /** compaction history **/
    public TabularData getCompactionHistory();

    /**
     * Triggers the compaction of user specified sstables.
     * You can specify files from various keyspaces and columnfamilies.
     * If you do so, user defined compaction is performed several times to the groups of files
     * in the same keyspace/columnfamily.
     *
     * @param dataFiles a comma separated list of sstable file to compact.
     *                  must contain keyspace and columnfamily name in path(for 2.1+) or file name itself.
     */
    public void forceUserDefinedCompaction(String dataFiles);

    /**
     * Triggers the cleanup of user specified sstables.
     * You can specify files from various keyspaces and columnfamilies.
     * If you do so, cleanup is performed each file individually
     *
     * @param dataFiles a comma separated list of sstable file to cleanup.
     *                  must contain keyspace and columnfamily name in path(for 2.1+) or file name itself.
     */
    public void forceUserDefinedCleanup(String dataFiles);


    /**
     * Stop all running compaction-like tasks having the provided {@code type}.
     * @param type the type of compaction to stop. Can be one of:
     *   - COMPACTION
     *   - VALIDATION
     *   - CLEANUP
     *   - SCRUB
     *   - INDEX_BUILD
     */
    public void stopCompaction(String type);

    /**
     * Stop an individual running compaction using the compactionId.
     * @param compactionId Compaction ID of compaction to stop. Such IDs can be found in
     *                     the transaction log files whose name starts with compaction_,
     *                     located in the table transactions folder.
     */
    public void stopCompactionById(String compactionId);

    /**
     * Returns core size of compaction thread pool
     */
    public int getCoreCompactorThreads();

    /**
     * Allows user to resize maximum size of the compaction thread pool.
     * @param number New maximum of compaction threads
     */
    public void setCoreCompactorThreads(int number);

    /**
     * Returns maximum size of compaction thread pool
     */
    public int getMaximumCompactorThreads();

    /**
     * Allows user to resize maximum size of the compaction thread pool.
     * @param number New maximum of compaction threads
     */
    public void setMaximumCompactorThreads(int number);

    /**
     * Returns core size of validation thread pool
     */
    public int getCoreValidationThreads();

    /**
     * Allows user to resize maximum size of the compaction thread pool.
     * @param number New maximum of compaction threads
     */
    public void setCoreValidationThreads(int number);

    /**
     * Returns size of validator thread pool
     */
    public int getMaximumValidatorThreads();

    /**
     * Allows user to resize maximum size of the validator thread pool.
     * @param number New maximum of validator threads
     */
    public void setMaximumValidatorThreads(int number);
}
{% endhighlight %}

The class `CompactionManager` implements this bean, it is exposed in the domain org.apache.cassandra.db under CompactionManager in jmx clients. It does all the work that it is intended to do, and has implementation of methods that are only necessary for talking to the MBean server. Here is how the CompactionManager registers itself in a static block as can be seen below:

{% highlight java %}
public class CompactionManager implements CompactionManagerMBean
{
    public static final String MBEAN_OBJECT_NAME = "org.apache.cassandra.db:type=CompactionManager";
    public static final CompactionManager instance;
    .......

    static
    {
        instance = new CompactionManager();
        MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
        try
        {
            mbs.registerMBean(instance, new ObjectName(MBEAN_OBJECT_NAME));
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    /**
     * Stop all running compaction-like tasks having the provided {@code type}.
     * @param type the type of compaction to stop. Can be one of:
     *   - COMPACTION
     *   - VALIDATION
     *   - CLEANUP
     *   - SCRUB
     *   - INDEX_BUILD
     */
    public void stopCompaction(String type)
    {
        OperationType operation = OperationType.valueOf(type);
        for (Holder holder : CompactionMetrics.getCompactions())
        {
            if (holder.getCompactionInfo().getTaskType() == operation)
                holder.stop();
        }
    }
    public void stopCompactionById(String compactionId)
    {
        for (Holder holder : CompactionMetrics.getCompactions())
        {
            UUID holderId = holder.getCompactionInfo().compactionId();
            if (holderId != null && holderId.equals(UUID.fromString(compactionId)))
                holder.stop();
        }
    }

    .......

{% endhighlight %}

## Cassandra DB MBeans:

### StorageServiceMBean

As cassandra is a database software, the first places to look in case of an issue is org.apache.cassandra.service.StorageServiceMBean, this allows you to see operation mode which is either of : `leaving, joining, decommissioned and client`. The set of live and unreachable nodes can also be found here.

To change the loglevel at runtime setLogLevel can be invoked. To get amount of data stored per node, getLoadMap() method can be invoked which presents a java map with key as ip address as node and value as corresponding storage load. Also effective ownership operation can be used to access the percentage of data in a keyspace owned by each node.

In order to find the node ownership of a partition key getNaturalEndpoints(String table, byte[] key) can be used. StorageServiceMBean offers many other maintenance operations like resumeBootstrap, joinRing, repairAsync, drain, removeNode, decommission and operations to start and stop gossip.

### StorageProxyMBean:
The `org.apache.cassandra.service.StorageProxy` provides a layer on top of StorageService to handle client requests and inter node communications. The StorageProxyMBean provides the ability to check and set timeout values for various operations including read and write.

This MBean also provides access to hinted handoff settings such as the maximum time window for storing hints. Hinted handoff statistics include getTotalHints, and getHintsInProgress. This can be disabled with the disableHintsForDC operation.

A particular nodes hints can be disabled via setHintedHandoffEnabled and status can be checked via getHintedHandoffEnabled. These are used by `nodetool enablehandoff / disablehandoff / statushandoff` commands. realoadTriggerClasses allows to install a new trigger without having to restart a node.


### ColumnFamilyStoreMBean
The table stats of cassandra are stored in org.apache.cassandr.db > Tables (Which previously was ColumnFamilies). This MBean provides access to compaction and compression stats for each table. This allows to temporarily override the setting on specific node. The values will be reset to those configured on the table schema when the node is restarted.

The MBean also exposes a lot of information about the node's storage of data for this table on disk. The getSSTableCountPerLevel() operation provides a list of how many sstables are in each tier. The estimateKeys() operation provides an estimate of number of partition stored on the node. Taken together this information can give some insight whether forceMajorCompaction operation for this table might help free up space and increase read performance.

There is also trueSnapshotSize method which allows finding the size of snapshots which are no longer valid. As cassandra stores indexes in tables, there is a ColumnFamilyStoreMBean instance for each indexed column available under IndexTables.

### CacheServiceMBean
The `org.apache.cassandra.service.CacheServiceMBean` provides access to Cassandra's key cache, row cache and counter cache under the domain name `org.apache.cassandra.db` > Caches. The info available for each caches includes maximum size and time duration to cache items and ability to invalidate each cache.

### CommitLogMBean
The `org.apache.cassandra.db.commitlog.CommitLogMBean` exposes attributes and operations that allow you to learn about the current state of commit logs. Default commitlog configuratios are defined in conf/commitlog_archiving.properties but can be overrided via MBean.

### CompactionManagerMBean
`org.apache.cassandra.db.CompactionManagerMBean` allows to get stats about compactions performed in the past and the ability to perform compactions of specific SSTable files we identify by calling the forceUserDefinedCompaction method of the CompactionManager class.

This MBean is leveraged by nodetool commands including compact, compactionhistory, and compactionstats.


### SnitchMBeans
Two MBeans are provided by cassandra to monitor and configure behaviour of snitch. The ``org.apache.cassandra.locator.EndpointSnitchInfoMBean` provides the name of the rack and data center for a given host, as well as the name of the snitch in use.

If DynamicEndpointSnitch is being used, the ``org.apache.cassandra.locator.DynamicEndpointSnitchMBean` is registered, this MBean exposes the ability to reset the badness threshold used by the snitch for making nodes as offline, as well as allowing you to see the scores of various nodes.

### HintedHandoffManagerMBean
Cassandra provides fine grained control of hinted handoff via `org.apache.cassandra.db.HintedHandoffManagerMBean`, the MBean exposes the ability to list nodes for which hints are stored by calling listEndpointsPendingHints(). You can then force delivery by calling scheduleHintDelivery() or delete hints via deleteHintsForEndpoint().

Additionally, you can pause and resume hint delivery to all nodes with pauseHintDelivery or delete stored hints for all nodes with the truncateAllHints operation. These are used by `nodetool's pausehandoff, resumehandoff and truncatehints`.

### Networking MBeans

The `org.apache.cassandra.net` domain contains MBeans to help cassandra manage Cassandra's network related activities includin phi failure detection and gossip, the Message Service, and Stream Manager.

### FailureDetectorMBean
The `org.apache.cassandra.gms.FailureDetectorMBean` provides attributes describing the states and Phi scores of other nodes as well as the Phi convict threshold.

### GossiperMBean
The `org.apache.cassandra.gms.GossiperMBean` provides access to gossiper. The method getEndpointDowntime() can be called to know for how long a particular node has been down. Cassandra uses this value internally to know when it can discard hints for that node.

The getCurrentGenerationNumber operation returns the generation number associated with the specific node. The generation number is included in gossip messages exchanged between nodes and is used to distinguish the current state of a node from the state prior to restart. Each time node restarts generation number is incremented.

assassinateEndPoint operation removes a node from the ring by telling the other nodes that the node has been permanently removed.

### StreamManagerMBean
`org.apache.cassandra.streaming.StreamManagerMBean` allows us to see the streaming activities that occur between a node and peers. There are two endpoints here - stream source and a stream destination. StreamManagerMBean supports two modes of operation - getCurrentStreams operation provides a snapshot of the current incoming and outgoing streams and the MBean also publishes notification associated with teh stream state changes.

### Metrics MBeans
The ability to access metrics related to application performance health and key activities has become an essential tool for maintaining web-scale applications. Fortunately cassandra collects a wide range of metrics on its own activities to help us understand the behaviour.
Some of these are :

* `Cache Metrices` - Key cache/ Counter cache / Row cache - hitrate , capacity , utilization
* `Client Metrices` such as number of connected clients and information about client requests such as latency, failures and timeouts
* `Commitlog Metrices` such as size, stats on pending and completed tasks
* `Compaction Metrices` such as total bytes compacted, and stats on pending and completed compactions
* `Connection Metrices` to each node in the cluster including gossip
* `Dropped message` metrices which are a part of nodetool tpstats
* `Read repair` metrices describing the number of background vs blocking read repairs performed
* `Storage` metrices including count of hints in progress and total hints
* `Thread pool`metrices including active, completed and blocked tasks for each threadpool
* `Table` metrices including memtables, SSTables and bloom filter usage and the latency of various read and write operations reported at one, five, and fifteen min intervals
* `Keyspace` metrices - provide aggregate of table metrices

### Threading MBeans
The `org.apache.cassandra.internal` domain houses MBeans that allow user to configure the thread pools associated with each stage in cassandra's staged event driven architecture. The stages include AntiEntropyStage, GossipStage, InternalResponseStage, MigrationStage and others

An easy way to use the jmx MBeans is via `nodetool` utility which provides access to a limited number of jmx functionalities.
