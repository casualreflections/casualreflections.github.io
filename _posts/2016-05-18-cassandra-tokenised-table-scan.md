---
layout: post
title: "Use token ranges for fast table scans and count calculation"
date: 2016-05-18T22:52:58+05:30
categories: [Cassandra, Optimisation]
tags: [Cassandra, Optimisation]
summary: Using tokenised table scans for large cassandra tables
description: Counting in cassandra? Maybe not so difficult
comments:   true
featured: true
post_format: [ ]
---

> I have been using the default internal paging that Datastax Drivers provide, which was introduced in 2.0+ and works like a charm for small use cases. I have tried to count rows using the following code successfully for **`~350M rows in ~15Mins`**.

> But over a period of time I have observed that scans use up only one core and there lies a scope of improvement in the approach. Using cluster metadata and vnode token ranges multiple workers can be assigned different token ranges to work upon.

> The workers assigned can lie different cpu's/ client altogether thereby the possibility of good improvement.

## The code that I am currently using using a single worker can be found below:

{% highlight python%}
'''
Counts the number of rows in cassandra using inbuilt paging, uses only one worker
'''
def count_row_count(table_name):
    cassandra_session = get_cassandra_session()
    query = "select * from " + table_name
    rs = cassandra_session.execute(query)
    while rs.has_more_pages:
        try:
            rows = rs.current_rows
            count += len(rows)
            # Try fetching next page
            rs.fetch_next_page()
        except:
            # In case of Time out exception or if some mishappening occurs
            # Retry after 500 milliseconds
            time.sleep(.5)
            print "Exception Occurred while fetching page, retrying again with same page"
            continue
    # This needs to be done as last page count wont be calculated
    # and python does not support do while loops
    count += rs.current_rows
    return count
{% endhighlight%}


## The below code snippet is from **datastax java driver test cases**, this has the possibility of scaling out into multiple workers by distributing each token range to multiple workers
##  similar code can be used for python driver as well:

{% highlight java %}
public void should_expose_token_ranges() throws Exception {
    Metadata metadata = cluster().getMetadata();

.......
    // Iterate the cluster's token ranges. For each one, use a range query to ask Cassandra which partition keys
    // are in this range.
    String token_range_query = "SELECT i FROM foo WHERE token(i) > ? and token(i) <= ?";
    PreparedStatement rangeStmt = session().prepare(token_range_query);

    TokenRange foundRange = null;
    for (TokenRange range : metadata.getTokenRanges()) {
        List<Row> rows = rangeQuery(rangeStmt, range);
        for (Row row : rows) {
            if (row.getInt("i") == testKey) {
                // We should find our test key exactly once
                assertThat(foundRange)
                        .describedAs("found the same key in two ranges: " + foundRange + " and " + range)
                        .isNull();
                foundRange = range;
                // That range should be managed by the replica
                assertThat(metadata.getReplicas(ks1, range)).contains(replica);
            }
        }
    }
    assertThat(foundRange).isNotNull();
}

private List<Row> rangeQuery(PreparedStatement rangeStmt, TokenRange range) {
    List<Row> rows = Lists.newArrayList();
    for (TokenRange subRange : range.unwrap()) {
        Statement statement = rangeStmt.bind(subRange.getStart(), subRange.getEnd());
        rows.addAll(session().execute(statement).all());
    }
    return rows;
}
{% endhighlight %}

## Use Cases:
* When complete table scans are going to be performed
* Exact Counting rows in a table