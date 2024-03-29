!> hide

<head>
    <title>Building a search engine</title>
    <meta name="permalinks" content="not-titles"> <!-- part of JS on icelk.dev & kvarn.org, options: disabled|enabled|not-titles -->
    <meta name="description" content="The challenges and strategies of building a full text search engine. In Rust.">
</head>

# Building a search engine

So [I built a search engine](https://github.com/Icelk/elipdotter). In two and a
half weeks. During Christmas.

> Yes, I have a life. Thanks for asking!

Following
[a course on Brilliant](https://brilliant.org/courses/search-fundamentals/), I
decided to code my own full text search engine. How hard can it be? 3K lines of
code in (for just the backend), I can confirm, it's educational, but a pain in
the ass.

${toc}

## The basics

The thing in common between search engines is their index. That's how they
quickly know where to look for the searched content.

They achieve this through storing map of words and the documents they are in
(and sometimes also exactly where each occurrence is). Now, we can quickly (by
indexing the map) query where the word we're looking for is. Then, read the data
and return the hit with context.

I've expanded these principles a bit to provide a nicer searching experience,
what you've grown used to in [DuckDuckGo](https://duck.com/) and
[Google](https://youtu.be/dQw4w9WgXcQ).

## Goals

As any good project manager, I set up some goals before starting the theory work
and coding.

-   Prioritize memory/disk use over performance. This implies searching through
    each of the matching files, for every query.
-   Typo tolerance. You should be able to get results if you search for the
    start of a word or if you missed some characters.
-   Fast enough for updating the results for each key press. The server
    shouldn't be the bottleneck, rather the network is.
-   Rank hits
    -   How close the used word is to the guessed (using typo tolerance).
    -   AND occurrences closer together is better.
    -   AND NOT occurrences closer together is worse.
    -   More links to the page is better.

I've implemented all of these goals, except the last part of the rating. I'm
simply not crawling the site. I'll [get back](#kvarn-integration) to that below.

## Platform

I'm building a platform-agnostic search engine. I'll integrate it with
[Kvarn](https://kvarn.org/), to provide a simple way to add search to any
website.

That means I'm writing it in Rust, a systems language. That means I have
absolute control over how data behaves and how I search it.

I'll be using no dependencies, except for a string similarity library and a
library providing set operations for sorted iterators. Speaking of that
confusing jargon...

## Efficient logic

Queries are split up into string segments contained in logic primitives.

`hello world` becomes
`Part::And(Part::String("hello"), Part::String("world"))`.\
`icelk -(kvarn or agde)` becomes `Part::And(Part::String("icelk"), Part::Not(Part::Or(Part::String("kvarn"), Part::String("agde"))))`

> Parsing the query actually took like 10 hours of programming. Parsers are hard
> :|

Then, I get the documents in which the single string occur. That returns a
sorted map, covered in the next chapter. I then iterate over the occurrences,
and use the aforementioned library to do logic on them.

It's actually quite intuitive. If I have an occurrence in document 1 & 2 & 3 for
the first item (say `hello`) in the AND statement, and 1, 3, 4 in the second, we
iterate over the items. If item of iterator `a`> item of iterator `b`, take the
next value of `b`. Then, if they are equal (the same document ID), we return the
result.

If we store the iterators `a` and `b` in the iterator object, we can continue
iteration next time we're requested to give a document ID.

In a similar fashion, OR and NOT operations are handled.

> NOT operations can however not be _alone_. Then, we'd have an iterator of all
> other documents. That's not feasible. Or efficient. Only AND NOT queries can
> be resolved. They use the difference between `a` and `b` - iterate the items
> in `a`, check if that item's in `b`. This will present a
> [challenge](#unexpected-caveats) that took be long to solve. (foreshadowing)

## Data structures - binary trees

So how do we store the lists? They need to be sorted, and in the index, quickly
accessible. We don't want to use hash maps, as they come with a lengthy hashing
process, **for each lookup**, and aren't sorted. That's important for
[optimizations](#ignoring-some-of-the-words).

Here come our hero, binary trees! They act like a list that sorts it's content
on insertions. When you then get an item, it'll check the middle of the list. If
the key is less than the middle, it'll check the middle of the first half. And
so it continues. Instead of a
[O(n)](https://en.wikipedia.org/wiki/Big_O_notation) lookup time of a list,
binary trees have a lookup time of O(log n). In English, that means FAST when
the size is big. At 5 items, it takes 5 comparisons for a list, and 2 (or 1) for
a binary tree. But at 1000 items, it'll take 1000 comparisons for the list, but
only 10 for the binary tree!

> I've described them as lists. That's not true. They store their data in
> multiple segments. That means you won't have to move ALL the elements of a
> list if your new item has to be at index `0`.

We use the iterators of these to get the sorted iterators.

## Ignoring certain letters

To get everybody on the same page, a character is any letter, symbol, or so
called control character (e.g. line break) you can use on a computer.

We don't want to include some these characters in our index or words. That means
we have to convert all other pieces of text we use to this format too. But rest
assured, iterators are our hero again. I've created an iterator which ignores
the unwanted characters. Then, we equate and compare those iterators. This is
all encapsulated in a convenient object (called `struct` in Rust).

The reason is [typo tolerance](#typo-tolerance) and consistency. If we have an
apostrophe at the end, `friends'`, we probably want to treat it the same. Also,
we remove the issue of punctuation directly after a word being part of it.

## SPEEED

To increase performance, I first diagnosed the timings of the library.

As to be expected, the searching of occurrences in files took quite a bit of
time. That can't be avoided. I use a splitting iterator, and then a binary tree
to look up if a word is in our wanted list.

When getting the HTML documents from Kvarn and parsing them, it turned out the
big performance hog was the HTML parsing. Chockers. So I implemented a cache for
the processed HTML documents (plain text to search) which resets every 10
minutes.

If the total count of words is too large, I only check some of them for
proximity. More on that [later](#ignoring-some-of-the-words).

This all took response times (in a debug build, where performance is quite bad,
but it highlights this well) from up to 500ms down to a measly 25ms.

## Unexpected caveats

Testing my brand spanking new search engine, I noticed something. Some queries
that should yield obvious results (I had them in front of me on the website),
but some were completely missing. I don't filter any hits. _Oh shit!_

After hours of the bugging, I came to a conclusion. Not an epiphany, simply
slowly connecting dots. That's what most often happens. You realize how dumb you
are.

In this case, it was the [typo tolerance](#typo-tolerance) which cause the
issue. See, when I get documents containing a word, I look every similar word to
the target up serially. That means the document IDs aren't sorted in the
iterator. That breaks the system.

The solution was to create a
[binary tree set](https://doc.rust-lang.org/std/collections/struct.BTreeSet.html)
from the iterator, and then iterate that. This method isn't optimal. We allocate
for temporary values. Another solution I might pursue is only using the word
most proximate to the user input.

---

Another oddity was AND NOT not working. That rooted in the fact the closest
occurrence of the NOT iterator should lower the rating of the AND item.

Using the aforementioned iterator approach with one NOT occurrence in a document
with several AND occurrences resulted in only the first AND occurrence getting a
lower rating.

This can be fixed by controlling when items are removed from the iterator. If
the AND and NOT are on the same document, we peek the next NOT occurrence. If
that's closer, use it. Repeat the previous step. Then, don't remove the item
from the iterator. To achieve this, I'd have to modify the functions in the
library providing the set operations on iterators.

---

> This section was added later in the search engine's development.

The issue above was resolved by turning the NOT part into a BTreeSet. For each
AND occurrence, we then check the BTreeSet. This is bad, as intermediate
allocations can get large. I recently fixed this by writing
[a function which looks for the "closest" pairs in ordered iterators](https://doc.icelk.dev/elipdotter/src/elipdotter/set.rs.html#113-237).
That also improved relevance, as closer NOT occurrences can be found.

Another issue was when we search for `next gen` in a document which has 5
occurrences of `next` but only one occurrence of `generation`. This causes the
AND iterators to emit the first occurrence of `next` together with the only
`generation`. Even if `generation` is closer to any later `next`s. Here, I use
the same function as mentioned above. When the first and only `generation` is
iterated, it notices there are no more left, and therefore holds on to it. We
now get more results which are given a [rating](#ratings) based on the proximity
of the other AND words. This solves the problem without having much of a
performance impact.

## Index

Before making queries, you need to feed the engine with data (the documents).
Now, it looks at every word in every document. For every word, the document is
appended to the entry of the word in the map. If the entry already contains the
document, it isn't added.

The map is a binary tree, and the entry we spoke about is a binary tree set.
That gives us a sorted iterator of documents, and guarantees there aren't
duplicates (that's part of the formal definition of a set).

> I'll come back to why the word map isn't a hash map.

---

We've been talking about documents a lot. But do I store the name of each
document in all the maps? No.

The two main engine-related objects of my search engine library are
[`Simple`](https://docs.rs/elipdotter/0.1.1/elipdotter/index/struct.Simple.html)
and
[`DocumentMap`](https://docs.rs/elipdotter/0.1.1/elipdotter/index/struct.DocumentMap.html).
`Simple` got it's name from the type of index (the antagonist being lossless).
The `DocumentMap` contains maps between internal
[`Id`](https://docs.rs/elipdotter/0.1.1/elipdotter/index/struct.Id.html) and
their corresponding names.

The ids are used for storage but the map contains fast methods to get the name
of the document.

### Typo tolerance

Wanting solid typo tolerance available by default, I opted for a method
independent of language, namely string similarity.

I iterate every recorded word (which we can do with trusted data, if an user
could write to the index it could flod it with thousands of words, slowing this
part way down) and get the similarity. If it's above a threshold, I return it
from the iterator. Now, another iterator which contains the aforementioned
iterates all the documents for each accepted word.

This enables several similar words to give hits. That can be important when
non-latin alphabetical words are translated (e.g. Chernobyl) as they can have
numerous variations in spelling.

### Ignoring some of the words

But what if we have 10,000 words in our index?

Then, we only compare the words which start with the same character as the word
from the query. This often reduces the number of words to compare with 10x.

Now, it's important the index is a binary tree map. Then all items are sorted,
and we can take a range of it containing the words starting with a specific
character. Then, we don't even have to check every word, as we assume its first
character matches.

## Ratings

We often get > 5 hits for simple queries such as `icelk kvarn`. How do we know
which one is the best? From the origin of the occurrence (when it's found in a
document), it get a rating attached to it. I modify the rating in several simple
steps.

-   Lower it if the word is less similar to the one in the query (this is the
    similarity I get from the library).
-   If two occurrences are within 100 character, they're merged and get a higher
    rating.
-   If a NOT occurrence is found in the same document, decrease the rating the
    closer it is.
-   If an AND occurrence is in the same document, increase the rating the closer
    it is.

This provides good relevance. On complex queries, it's preferred that the
occurrences of all the words are close.

## Kvarn integration

Lastly, let's take a look at the
[Kvarn integration](https://github.com/Icelk/kvarn-search/).

This provides an easy way to use this search engine on your site.

To give clients access to the data, I thought it'd be best to use an API. Then,
you (the JS programmer), can call the API and implement the frontend yourself.
The response is in JSON and documented at [my API reference](/api/#search).

Aside from returning the data, it also manages the index, both creating it on
startup (it takes only ~20ms for this whole site. Even with
[a massive article](beginner-programming.)) and when files are
moved/created/modified/removed.

It also provides HTML parsing (to get plaintext to search), a cache (as HTML
parsing takes a LONG time), and a simple configuration interface.

---

To get the list of pages on the website, the integration both uses the file
system (it that's enabled in the host) and the
[list of single-page extensions](https://doc.kvarn.org/kvarn/extensions/struct.Extensions.html#method.get_prepare_single).
This means no reverse-proxy, or more generally, no
[function bound extensions](https://doc.kvarn.org/kvarn/extensions/struct.Extensions.html#method.add_prepare_fn),
are indexed. PHP documents **are**, however (as they exist on the disk). If you
want to index document from the exceptions above, use the
[`Options.additional_paths`](https://github.com/Icelk/kvarn-search/blob/main/src/lib.rs#L60-L65)
option of the integration.

Getting the responses from Kvarn is super-simple. The
[`handle_cache`](https://doc.kvarn.org/kvarn/fn.handle_cache.html) function
takes a request; remote IP address; and the host, and returns a response. It's
so nice to work with [a good framework](/kvarn/)! (I'm not patting myself on the
back, what are you talking about?)

---

Signing off,
[your 10x developer](mailto:Icelk<main@icelk.dev>?subject=Freelance%20job%20offer).

<br>
<br>
<br>
