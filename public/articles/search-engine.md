!> hide

<head>
    <title>Building a search engine</title>
    <meta name="permalinks" content="not-titles"> <!-- part of JS on icelk.dev & kvarn.org, options: disabled|enabled|not-titles -->
    <meta name="description" content="The challenges and strategies of building a full text search engine. In Rust.">
</head>

# **IMPORTANT: This article isn't finished yet! Check back in a few days.**

# Building a search engine

So [I built a search engine](https://github.com/Icelk/elipdotter). In two and a half weeks. During Christmas.

> Yes, I have a life. Thanks for asking!

Following [a course on Brilliant](https://brilliant.org/courses/search-fundamentals/), I decided to code my own full text search engine.
How hard can it be?
3K lines of code in (for just the backend), I can confirm, it's educational, but a pain in the ass.

${toc}

# The basics

The thing in common between search engines is their index.
That's how they quickly know where to look for the searched content.

They achieve this through storing map of words and the documents they are in (and sometimes also exactly where each occurrence is).
Now, we can quickly (by indexing the map) query where the word we're looking for is.
Then, read the data and return the hit with context.

I've expanded these principles a bit to provide a nicer searching experience, what you've grown used to in [DuckDuckGo](https://duck.com/) and [Google](https://youtu.be/dQw4w9WgXcQ).

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

`hello world` becomes `Part::And(Part::String("hello"), Part::String("world"))`.\
`icelk -(kvarn or aged)` becomes `Part::And(Part::String("icelk"), Part::Not(Part::Or(Part::String("kvarn"), Part::String("agde"))))`

> Parsing the query actually took like 10 hours of programming. Parsers are hard :|

Then, I get the documents in which the single string occur. That returns a sorted map, covered in the next chapter.
I then iterate over the occurrences, and use the aforementioned library to do logic on them.

It's actually quite intuitive.
If I have a occurrence in document 1 & 2 & 3 for the first item (say `hello`) in the AND statement, and 1, 3, 4 in the second, we iterate over the items. If item of iterator `a`> item of iterator `b`, take the next value of `b`. Then, if they are equal (the same document ID), we return the result.

If we store the iterators `a` and `b` in the iterator object, we can continue iteration next time we're requested to give a document ID.

In a similar fashion, OR and NOT operations are handled.

> NOT operations can however not be _alone_. Then, we'd have a iterator of all other documents. That's not feasible. Or efficient.
> Only AND NOT queries can be resolved. They use the difference between `a` and `b` - iterate the items in `a`, check if that item's in `b`.
> This will present a [challenge](#unexpected-caveats) that took be long to solve. (foreshadowing)

# Data structures - binary trees

So how do we store the lists? They need to be sorted, and in the index, quickly accessible. We don't want to use hash maps, as they come with a lengthy hashing process, **for each lookup**, and aren't sorted. That's important for [optimizations](#ignoring-some-of-the-words).

Here come our hero, binary trees! They act like a list that sorts it's content on insertions. When you then get an item, it'll check the middle of the list. If the key is less than the middle, it'll check the middle of the first half. And so it continues. Instead of a O(n) lookup time of a list, binary trees have a lookup time of O(log n). In English, that means FAST when the size is big.
At 5 items, it takes 5 comparisons for a list, and 2 (or 1) for a binary tree. But at 1000 items, it'll take 1000 comparisons for the list, but only 10 for the binary tree!

> I've described them as lists. That's not true. They store their data in multiple segments. That means you won't have to move ALL the elements of a list if your new item has to be at index `0`.

We use the iterators of these to get the sorted iterators.

# Ignoring certain letters

First of all, a character is any letter symbol, or so called control character (line break) you can use on a computer.

We don't want to include certain of these letters in our index or words. That means we have to convert all other pieces of text we use to this format too. But rest assured, iterators are our hero again. I've created an iterator which ignores the unwanted characters. Then, we equate and compare those iterators. This is all encapsulated in a convenient object (called `struct` in Rust).

The reason is [typo tolerance](#typo-tolerance) and consistency. If we have an apostrophe at the end, `friends'`, we probably want to treat it the same. Also, we remove the issue of punctuation directly after a word being part of it.

# SPEEED

To increase performance, I first diagnosed the timings of the library.

As to be expected, the searching of occurrences in files took quite a bit of time. That can't be avoided. I use a splitting iterator, and then a binary tree to look up if a word is in our wanted list.

When getting the HTML documents from Kvarn and parsing them, it turned out the big performance hog was the HTML parsing. Chockers.
So I implemented a cache for the processed HTML documents (plain text to search) which resets every 10 minutes.

If the total count of words is too large, I only check some of them for proximity. More on that [later](#ignoring-some-of-the-words).

This all took response times (in a debug build, where performance is quite bad, but it highlights this well) from up to 500ms down to a measly 25ms.

# Unexpected caveats

Testing my brand spanking new search engine, I noticed something. Some queries that should yield obvious results (I had them in front of me on the website), but some were completely missing. I don't filter any hits. _Oh shit!_

After hours of the bugging, I came to a conclusion. Not an epiphany, simply slowly connecting dots. That's what most often happens. You realize how dumb you are.

In this case, it was the [typo tolerance](#typo-tolerance) which cause the issue. See, when I get documents containing a word, I look every similar word to the target up serially. That means the document IDs aren't sorted in the iterator. That breaks the system.

The solution was to create a [binary tree set](https://doc.rust-lang.org/std/collections/struct.BTreeSet.html) from the iterator, and then iterate that.
This method isn't optimal. We allocate for temporary values.
Another solution I might pursue is only using the word most proximate to the user input.

---

Another oddity was AND NOT not working. That rooted in the fact the closest occurrence of the NOT iterator should lower the rating of the AND item.

Using the aforementioned iterator approach with one NOT occurrence in a document with several AND occurrences resulted in only the first AND occurrence getting a lower rating.

# Index

## Typo tolerance

Not only one suggested word, but all above a similarity threshold.

### Ignoring some of the words

# Ratings

# Kvarn integration
