!> hide

<head>
    <title>Building a search engine</title>
    <meta name="permalinks" content="not-titles"> <!-- part of JS on icelk.dev & kvarn.org, options: disabled|enabled|not-titles -->
    <meta name="description" content="The challenges and strategies of building a full text search engine. In Rust.">
</head>

# **IMPORTANT: This article isn't finished yet! Check back in a few days.**

# Building a search engine

So [I built a search engine](https://github.com/Icelk/elipdotter).

Following [a course on Brilliant](https://brilliant.org/courses/search-fundamentals/), I decided to code my own full text search engine.
How hard can it be?
3K lines of code in (for just the backend), I can confirm, it's educational, but a pain in the ass.

${toc}

# Goals

As any good project manager, I set up some goals before starting the theory work and coding.

-   Prioritize memory/disk use over performance. This implies searching through each of the matching files, for every query.
-   Typo tolerance. You should be able to get results if you search with the start of a word.
-   Fast enough for updating the results for each key press. The server shouldn't be the bottleneck, rather the network is.
-   Rank hits
    -   How close the used word is to the proposed using typo tolerance.
    -   And occurrences closer together is better.
    -   And not occurrences closer together is worse.
    -   More links to the page is better.

I've implemented all of these goals, except the last part of the rating. I'm simply not crawling the site. I'll [get back](#kvarn-integration) to that.

# Platform

I'm building a platform-agnostic search engine. I'll integrate it with [Kvarn](https://kvarn.org/), to provide a simple way to add search to any website.

That means I'm writing it in Rust, a systems language. That means I have absolute control over how data behaves and how I search it.

I'll be using no dependencies, except for a string similarity library and a library providing set operations for sorted iterators. Speaking of that confusing jargon...

# Efficient logic

Queries are split up into string segments contained in logic primitives.

> Parsing the query actually took like 10 hours of programming. Parsers are hard :|

Then, I get the documents in which the single string occur. That returns a sorted map, covered in the next chapter.
I then iterate over the occurrences, and use the aforementioned library to do logic on them.

It's actually quite intuitive.
If I have a occurrence in document 1, 2, 3 for the first item in the and statement, and 1, 3, 4 in the second, we iterate over the items. If item of iterator `a`> item of iterator `b`, take the next value of `b`.

# Data structures - binary trees

# SPEEED

# Unexpected caveats

# Index

## Typo tolerance

# Ratings

# Kvarn integration
