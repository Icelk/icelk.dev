!> hide

<head>
    $[highlight]
    <title>An introduction to full-stack development.</title>
    <meta name="description" content="Get started with full-stack development,
    web programming both UI in HTML, CSS, and JavaScript
    and building web servers in Rust">
    <meta name="permalinks" content="not-titles">
</head>

# An introduction to programming

> Covers basic concepts and guides you through three projects, using web technologies and Rust.

Welcome to my **introduction to programming**!
This is targeted to those who have **no previous experience**; everybody can follow along!

> If you find any errors or sections in need of improvement, [mail me](mailto:Icelk<main@icelk.dev>?subject=Article:%20Introduction%20to%20programming&body=I%20have%20some%20suggestions...).
> Also, if you find this introduction helpful, **consider sharing**.

First I'll cover how you can follow along in this guide.
Then, I'll cover the basics and answer what a programming language is.

## Jump to...

${toc}

# Follow along

Trying it out for yourself is the best way to learn programming.

An overwhelming number of tools exist, so it's tough to choose one broad enough (and good enough) to get started with and learn.
I recommend _VS Code_ (or rather [Codium](https://github.com/VSCodium/VSCodium/), a completely free (as in freedom) variant)
as it supports virtually all languages and has excellent features.

> See [this section](https://github.com/VSCodium/VSCodium/#why-does-this-exist) for info on why it's important to not use Microsoft's "official" download.

Press the `Releases` button on the middle right and download the file for your operating system.

## Code online

If you want to educate a broader audience and found this article, consider using my
[VS Code setup for online development](https://icelk.dev/articles/code-online.).
All users get their own VS Code in the browser with all the features of the desktop version.

> To set it up requires you to have technical know-how and comfort with the shell.

# The basics

First we'll cover the basics.
This will give you the knowledge needed to build a simple counter which increments (adds) when you press a button.

> **_Note on running the examples_**: The following examples can be ran by right-clicking on this web page, then `Inspect`.
> You have now opened the `Developer tools`. Find the _console_ tab in the top. There, you can paste the code you find here.

For some reason (probably lazyness, it's hard to write capitals) programmers usually use all lowercase names.
Try to keep this in mind.

## Functions

A function takes data (anything; text, numbers, lists, other data structures),
changes it and also possibly it's environment (anything you see the program doing; changing files on your computer, showing info to you),
and returning something (which can be nothing).

Example:

```javascript
// We define a function called `multiply`, which takes two arguments; `x` and `y`.
function multiply(x, y) {
    return x * y
}

// Read "let eight be multiply two with four
let eight = multiply(2, 4)
// `eight` is 8!
```

We often use parentheses `()` to call (run) them.
The text between the parentheses is the input to the function.
You can have multiple inputs, separated by `,`. The type of data and count of arguments have to match in the function definition and where it's called.

In the example above, `2` is `x` and `4` is `y` in the function.

> These _arguments_ are sensitive to order; if a function takes two inputs, you have to write them in the right order.

## Variables

Variables store data. See `eight` above, a variable holding the number `8`.

## Comments

It's crucial to write reminders and reasons for the code you write.
This is called _comments_.
In these examples, anything after `//` is a comment; excluded from the logic of the code.

## Accessing properties and methods

The data variables store can have _properties_ and _methods_.
Properties are data part of the "bigger object".
Methods are functions (which use parentheses to take data or arguments)
which use the data of the "bigger object", both viewing it and changing it.
You can think about it as the method taking a reference to the "bigger object".

These both are accessed by a dot `.`

```javascript
let person = {
    name: "Icelk",
}
console.log(person.name)
```

This creates a `person` with a name `Icelk`.
We log (write the text from the function input to the `console`) the `name` _property_ of `person`.
`console` is a _object_ with several methods and properties, one of them being `log`, which takes text (called a `string`), in this example `Icelk`.

## Control flow

It's good to do different things depending on input; otherwise all computer programs would do the exact same thing every time.
It would mean no input, no new websites, no new features. That's not good!

The main concept of control flow is _if else_. Take this example:

```javascript
// Math.random() returns a number between 0 and 1
let randomValue = Math.random()

if (randomValue > 0.8) {
    console.log("We are very lucky! 🥠🍀")
} else if (randomValue >= 0.5) {
    console.log("50-50")
} else {
    console.log("We had bad luck 😔")
}
```

The same `{ }` brackets are used for separating code in control flow as in functions.

> Why the `( )` parentheses are used around the _predicate_ (logic resulting in `true` or `false`),
> nobody knows. We'll cover this later, but in the meantime, just add them.

## Example: Saying hello[]

```javascript
function sayHello(names) {
    // Lists have a method called `forEach`,
    // which runs the code in the { } for every element in the list.
    names.forEach(function (name) {
        // The `${name}` becomes the value of the variable named `name` when it's ran.
        console.log(`Hello ${name}!`)
    })
}

let friends = ["Arnold", "Carl", "Bob"]
sayHello(friends)
```

Here, we define a function called `sayHello`, which takes one _argument_ (input), a _array_ (list) of names.

It calls the _method_ `forEach` on `names`. We then define a "anonymous" function
which will be ran for each element in the list, with the element as the first and only _argument_.

We then `console.log` the name.

Notice the \` (backticks) around `Hello`.
This enables us to use ${name} to show the name variable in the text.

This code, if run, prints

```text
Hello Arnold!
Hello Carl!
Hello Bob!
```

# Sharing code

It would be impossible to build everything from the ground up every time we developers want to make a new product.
We therefore reuse most of the code our product uses, and only write a fraction ourselves.

This is enabled by a concept called _open source_, that you share your work under a permissive license
(anyone can use the code for anything).

> Building apps on the web is a relatively easy thing to do; a lot of code goes in to making it easy to program and fast for the user.

See [this video](https://youtu.be/JMWNYfPIF2U) for a overview of the layers of code used to run your website.

# Similarities; what is a "programming language"?

You have probably heard the term "programming language" before.

Like languages, programming languages all strive after the same goal (communication or software) but achieve it
with different quirks, style, grammatical rules (called _syntax_ in programming),
and vocabularies (in a programming language, there exists several _keywords_, reserved words used)

> These _keywords_ include the `if else` we've used, `function`, and `let` to define a variable.

## Syntax

The formal "rules" of a programming language is called the syntax.
It's where and when the parentheses `( )`, `{ }`, and `[ ]` should be placed,
where commas and dots should be, how the keywords are used (`function`, `if else`).

This differers between languages, though must languages are "C-like";
they follow syntactic rules inherited from the "first" programming language, C.

## Built-ins

To enable basic functionality (e.g. reading files, showing text in the console, networking),
each programming language provides some "built-in" functions, objects, and methods.

These naturally differ between languages.

This and syntax is virtually the only differences between programming languages.

## Style

To make code appear nicer, we programmers build formatters to automatically set right indentation,
break apparat long lines, move parentheses, and much much more.

There also exits _naming conventions_; how to capitalise words. In the language you've seen examples in so far,
the norm is to name everything like this `icelkFavouritePet`, with capitalised words after the first.
In Rust, VS Code (if you've installed the `Rust` extension) tells you to change the name, and provides a button which does it for you.

Note how this is handled in Rust later on.

> Variables can't have spaces in them, else the computer would have a _very_ hard time understanding what you wrote,
> which results in these odd _naming conventions_.

> Some languages, such as Python, are sensitive to indentation. Where the examples we've seen have `{ }`, Python only reads the indentation level.

## Example: Saying hello[] in multiple languages

To show the differences, I'll write the example from above in Rust too.

JavaScript (the previous example)

```javascript
function sayHello(names) {
    names.forEach(function (name) {
        console.log(`Hello ${name}!`)
    })
}

let friends = ["Arnold", "Carl", "Bob"]
sayHello(friends)
```

Rust

```rust
fn say_hello(names: &[&str]) {
    for name in names {
        println!("Hello {}!", name);
    }
}

fn main() {
    let friends = ["Arnold", "Carl", "Bob"];
    say_hello(&friends);
}
```

We have a few things to note.

First, `function` becomes `fn`.

Second, we add `;` semicolons to the end of declarations of variables and function calls.

Third, we use the `&` and sign to pass a _reference_. This tells Rust the `say_hello` function only needs to read the names, not change them.

Fourth, the code which calls `say_hello` is in another function called `main`. This function is called when you execute (run) the program,
while JavaScript runs all code not in functions.

Fifth, the `say_hello` function has a lowercase n with a underscore between the words. This is the norm in Rust.

Sixth, the `say_hello` function takes `names: &[&str]`. In a faster language such as Rust, this is needed to avoid complications in the program.
It tells the computer to take a reference of an array (list) `[ ]` of `&str`, **str**ing references (`&`). This, as I told before, tells the program
to only take a readable reference; we won't change the names.

> Some say the sixth point increase robustness and readability, as the types of the data is explicit.

Seventh, the code to loop each element in the array `names` is different. This is built in to Rust (which is a newer language), but a method is needed in JavaScript.

Eighth, and last, after the function `println` (print line), a exclamation mark `!` is placed before it's parentheses. This is because it's a _macro_.
You don't need to know this, so skip this if you're not curious. A macro generates more code; the `println!("Hello {}!", name)` expands to more code before it's run.
This enables special arguments to be used. The `{}` becomes the value of `name`. This wouldn't be possible using standard functions, as they have to take a defined number of arguments.

# Project: Let's learn how to count!

It's high time to practical learning. You are going to build a button which increments (adds) a number shown on the screen.

HTML (HyperText Markup Language) is the syntax of how to tell the browser to display certain elements.

> Spaces and newlines do (mostly, don't worry!) not matter. Keep this in mind;
> you can split sentences over multiple lines in your code to make it easier to read without effecting the product shown in the browser.

You can compare HTML, JavaScript, and CSS (styling to make the website look pretty) to writing a document.
CSS being the style,
HTML the position of paragraphs and grouping of text,
and JavaScript the animations and other complex behaviour.
JavaScript can do everything, including changing the HTML, handling payments, and executing game logic.

## Boilerplate

To set up the document, you can type the `!` exclamation mark in VS Code and hit tab, `↹`.

Now, tab through the selected values (which leaves them by their defaults) but change the title; it's the text in the tab on the top of your browser.

> As you see, every tag which contains text or other elements have a corresponding closing tag. This is **important**.

The `<head>` section contains metadata (data or information not shown in the website but used by the browser and search engine to compose the page).
We will not touch it for now.

The `<body>` section contains all elements. In HTML (the markup language you're going to write your website in) a element is a tag, such as `<button>` which can have attributes, `<button id="my-button">`, and often a text or other elements with a closing tag, in this case `</button>`.

## div, h1, p, and button

To start with HTML, it's good to know 4 tag types.

`<div>` is a container; it's invisible but contains other elements. Each div takes up the whole vertical space; you can't have two divs beside each other.

`<h1>` stands for "heading 1", the first heading type. There exists 6, with 1 being the largest.

`<p>` stands for "paragraph". Well, it's a paragraph...

`<button>` can trigger JavaScript code when it's pressed and appears as a button to the user.

Divs, headings, and paragraphs share a important property. When the browser lays out the text and content, these all take up 100% of the horizontal space. If you changed the background of a heading, only the height it takes up would be the set color, but the whole horizontal space would become said colour.

This is unlike the button, which by default (yes, this can be changed, both for buttons and all the above) is _inline_; when placing two after each other they appear on the same "line".

> Remember, spaces and newlines do not matter in HTML.

## Let's add some elements

After typing `!` (and saving the document as `index.html`), your document should look something like this

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My website!</title>
    </head>
    <body></body>
</html>
```

To reduce the clutter, you can remove the first two `<meta>` tags. They are mostly redundant.

The `name="viewport"` meta tag makes the website look larger on smaller displays (mobile devices).

> If you have access to a phone and if your code is stored online,
> try changing the value of `initial-scale`, **after we've added some content**,
> and see how it changes the scale of the elements.

Now, lets add a `<h1>` (do this by typing `h1` and pressing tab in VS Code) tag
and a `<button>` (same as before, type `button` and press tab) under it.
Type a `0` between the opening and closing tags of the heading and `Add to counter` as the buttons text.
Your HTML should now look like this

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My website!</title>
    </head>
    <body>
        <h1>0</h1>
        <button>Add to counter</button>
    </body>
</html>
```

> If you do not have colours in your editor, make sure it's saved a file ending in `.html`.
> The _file extension_ (the text after the last period) defines how the syntax highlighting
> (colours. Syntax from how the code is structured and highlighting from the definition of highlighting; to make it clear)
> should be applied.

If you access the file, you should see a large `0` and a button which does nothing. Let's fix it!

## Store references globally

To interact with the HTML, we need to store references to the elements. To get a reference, the elements need to have id's.

Set the heading to have the id `heading` and the button to have the id `button`. These id's only need to be specified in the opening tag.

Now, the elements you added should look like this.

```html
<h1 id="heading">0</h1>
<button id="button">Add to counter</button>
```

After the button and heading, add a `<script>` tag. In it, you can write JavaScript
(the programming language the examples in this article are written in)
which is executed as it's read in the document.

Spaces and newlines mostly do not matter in JavaScript. We use them to make it easier to read.

> Notice the `"`. They mean the text inside is a string. A id is a string.
> If you put the closing parentheses `)` inside the `""`, JavaScript thinks it's part of the id.

In the script tag, put this

```javascript
let heading = document.getElementById("heading")
let button = document.getElementById("button")
```

Now, we've acquired references to JavaScript _objects_ with [methods and properties](#accessing-properties-and-methods) which we can interact with.

## Events

We want to execute some code when the user clicks the button. In JavaScript, this is handled with _events_;
we attach a function which is ran every time the _event_ we are listening to happens.

Add this after the references (the `let ... = ...` code you've just added).

```js
button.addEventListener("click", function () {
    // The user clicked the button.
    // Increment the heading's text.
    heading.innerText = heading.innerText + 1
})
```

The heading has a property called `innerText` which contains the text of the heading.

Now, open your file in a browser. See what happends when you press the button.

Your file should look like this.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My website!</title>
    </head>
    <body>
        <h1 id="heading">0</h1>
        <button id="button">Add to counter</button>

        <script>
            let heading = document.getElementById("heading")
            let button = document.getElementById("button")

            button.addEventListener("click", function () {
                // The user clicked the button.
                // Increment the heading's text.
                heading.innerText = heading.innerText + 1
            })
        </script>
    </body>
</html>
```

## Oh no! \* 1

The number isn't incremented, a `1` is just added to the end of the text.

To increment the number, we first need to convert it to a number, then increment it,
and then set that number as the text
(JavaScript handles the conversion from a number to a string (text)).

To convert text to a number, we can multiply the text with one.
This is a mathematical operation only available on numbers; JavaScript has to convert the text to a number.

> Because multiplying a number with 1 does nothing, this won't change the number.

Change the line setting the text to this

```js
heading.innerText = heading.innerText * 1 + 1
```

Now it should work!

To make this more flexible, we can move the code to a separate function.

Add this beneath the end of the `addEventListener` call.

```js
function addToHeader(amount) {
    heading.innerText = heading.innerText * 1 + amount
}
```

and call this function from the event listener instead of changing the value manually;

```js
button.addEventListener("click", function () {
    addToHeader(1)
})
```

Now the code should look like this

```js
let heading = document.getElementById("heading")
let button = document.getElementById("button")

button.addEventListener("click", function () {
    // The user clicked the button.
    // Increment the heading's text.
    addToHeader(1)
})

function addToHeader(amount) {
    heading.innerText = heading.innerText * 1 + amount
}
```

> Try changing the input `amount` in the call to `addToHeader` to be any other number;
> the counter will increment with that amount every time you press the button.

## Optional: Double the number every time instead

You need to change the `addToHeader` function.

> Tips: Multiply by amount and remove the `+ amount`. Now pass `2` to the `addToHeader` function.

## Optional: Styling

If you want to make the website look pretty, you can add CSS. This is defined in the `<head>` of the document.

Paste this code after the closing `</title>` tag.

> Remember, it can be on the next line, spaces and newlines do not matter in HTML.

```css
<style>
    /* Notice that the comments need a closing part too!
    This means they can span several lines. */
    :root {
        /* Set the height to 100% so the body can take up all the space (else centrering won't work) */
        height: 100%;
    }

    body {
        /* See comment above */
        height: 100%;

        /* This is a advanced layouting option */
        display: flex;
        /* Set the layout to be in columns (we want one column, the button under the heading), not rows which is the default */
        flex-direction: column;
        /* These two center the content vertically and horizontally */
        align-items: center;
        justify-content: center;

        /* Self-explanatory */
        background-color: black;
        /* Sets the text colour to `wheat` */
        color: wheat;
    }

    button {
        /* Set the background colour and text colour */
        background-color: wheat;
        color: black;
    }
</style>
```

You can change the colours to hex colours (a colour on computers are represented as three values for each chanel in RGB (red, green, blue).
Hex colours is a format to store this in a compact 6-character long string).

[Search for "colour picker"](https://duck.com/?q="colour+picker") and change the colour. Then copy the value at the bottom with a `#` prefixed.

You can then paste the hex colour in the places where a colour is applicable with a `#` prefixed.
`#3f3f3f` is a grey.
`#6699dd` is a light blue colour not unlike the one used on [icelk.dev](https://icelk.dev).

# Summary

So far, you've learned all the basics needed to build complex web apps.

Next, we are going to learn a bit about how the web works, the client-server and request-response model,
and Git.

In a few minutes, you're going to start building a to-do list.

# What is the web?

Not so long ago (before I went head-first into the backbone of the web with my project [Kvarn](https://kvarn.org)), I thought of the web
as a static thing. Websites are always available. I didn't think further.

When you open a website (for example this very page), a request is sent from your browser to the server hosting the website.
That request is encoded to protect your data, sent through countless servers which relay your data
(also called the Internet. Don't know if you've heard of it ¯\\\_(ツ)\_/¯).

At the other end a _web server_, such as Kvarn (which is handling your requests to this site), handles the request and creates a response,
which it sends back to you, with the same procedure as when you sent the request.
Your browser then interprets this and eventually shows a website to you. This all usually takes under a second.

To recap, my code takes the info your browsers code transmitted on your request and sent a response back to you.
**It's all code!**

When the content is showed to you on your browser, three main languages are used;
HTML for the markup text (what is showed),
JavaScript for interactive changes,
and CSS for styling, layouting, colour, font, and all other appearance-related things.

# Git it?

A prerequisite to Git (which you'll learn more about soon) is the terminal.
Assuming you're using VS Code, you can access the integrated terminal (there also exists separate programs to access it)
by hovering over the top edge of the bottom bar (you should see a arrow pointing up), pressing and holding, and dragging it up.

This is a **very powerful tool** and should be handled with care. **_Never_** Paste in **any** code you do not completely understand.
It can destroy the entire system. Git is _completely safe_.

You are always inside a _directory_ (folder on you computer).
The directory you are in is called the _current working directory_ (CWD).
You can test it by typing `pwd` (print working directory) and hitting enter.
Most actions are relative to it, including Git.

To interact with the system, we execute programs by their name and give them arguments, and hit enter.

> To see the files in the CWD, type `ls` and hit enter. Try `ls -lA` for more info.
> Here, `ls` is the program and `-la` a argument to get a list with all items.
> You should see the same files as the explorer in VS Code.

To change directory, use the `cd` program. To navigate to a folder named `web` in the CWD, type `cd web`.
To go to the parent directory (up one folder), use `cd ..`. `..` is always the parent directory.

> Say you are in the previously mentioned `web` directory, executing `cd ../web` would do nothing;
> you first go to the parent, then back down to the directory you are already in.

If a program takes a long time to finish, you can press and hold `Ctrl` and press `c` to terminate a program.
This can be used to abruptly stop the program.

To start of, watch [this great video from the YouTube channel Fireship](https://youtu.be/hwP7WQkmECE).
His channel has tons of great content, for all levels of skill.

> Feel free to pause and try out what he's talking about.

You can also play around in VS Code's Git integration.
It's located in the left _Activity Bar_
and looks like three dots connected by two lines.

Here are some of the Git commands mentioned.

> The `$` at the start means it should be executed by a user,
> not a administrator (called superuser or root in programming)
> and should not be included in the command you execute.

To initiate a new Git repo, use

```shell
$ git init
```

To stage changes in files for a commit

```shell
$ git add <file or . (a dot) for all files in the current working directory>
```

To commit them to Git use

```shell
$ git commit -m "Message"
```

I recommend making frequent commits; if you've changed something and your code works, commit it.
Begin doing this in VS Code, as it's simpler.

# Project: What to do? A to-do list!

Since [the basics](#the-basics) were quite comprehensive, you don't really need to learn anything more to make a to-do list.

> I'll short JavaScript to JS in this chapter. This is widely used.

I'll list a few [built-ins](#builtins) in JS you'll need here. Try to do some of this on your own!

-   `document.getElementById(id)` gets the element with `id`
-   `<input type="text">` shows a small text input field.
-   `<input>`s can have a `placeholder` attribute to show a default text when the user hasn't written anything yet.
-   `<hr>` shows a vertical bar, to separate sections.
-   `document.createElement(tagName)` creates a element with the format `<tagName></tagName>`.
    To create a paragraph, use `document.createElement("p")`.
    You have to declare this as a variable and later append it to another element. See below.
    To create a header and set it's test: `let header = document.createElement("h1")` and on the next line `header.innerText = "Fun stuff"`.
-   `parentElement.appendChild(childElement)` adds the element `childElement` just before the closing tag of `parentElement`.
    To add the previously created `header` (see above) to the end of the document (specifically the end of `<body>`), add this `document.body.appendChild(heading)`

## Structure

We need to define the structure of the document.
Begin with the boilerplate by typing `!` and pressing tab in a new document.

Try to make a structure which suits this. We need a container (`<div>`) for the items,
another for the inputs to create a new item,
and another one for the completed items.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>To-do list</title>
    </head>

    <body>
        <div id="list">
            <div id="to-do-items">
                <!-- Items -->

                <!-- Template item: -->
                <div class="item">
                    <input type="text" placeholder="Item" />
                    <input type="checkbox" />
                    <!-- a fun character -->
                    <span>✘</span>
                </div>
            </div>
            <div id="new-item">
                <input type="text" id="new-item-name" placeholder="Add new item..." />
            </div>
            <hr />
            <div id="done-items">
                <!-- Items which are checked -->
            </div>
        </div>
    </body>
</html>
```

## Modifying HTML

To add items to our list, we'll need to add HTML from JS.

This can be achieved by using the `document.createElement` and `element.appendChild` methods.
See the `built-ins` list in the start of [this chapter](#project-what-to-do-a-todo-list).

To create a new element visible to the user, we have to:

1. Create the element in JS
2. Optionally change it's parameters, such as `innerText`, `id`, etc.
3. Add it to a already existing element, such as the document body (which can be accessed with `document.body`)

## Connect JavaScript

To start changing the HTML, we need references to the elements we are going to use.

We are going to declare variables which contain references to the `to-do-items` container, the `new-item-name` text input, and the `done-items` container.

Add a `<script>` just before the end of the `<body>` tag.
In said script tag, declare a variable (in the example below, I used `todoItems`) set to a reference to the element with id `to-do-items`.
Do the same for all other elements mentioned above.

Your document should now look something like this.

```html
...
<body>
    ...
    <script>
        let todoItems = document.getElementById("to-do-items")
        let newItemName = document.getElementById("new-item-name")
        let doneItems = document.getElementById("done-items")
    </script>
</body>
```

## Generate content

Let's try to add a new item to the `to-do-items` container.

> Keep in mind we are working inside the script tag after the `list` container, before the closing `</body>` tag.

Declare a function which takes a argument named `value`.
In the function, add this.

```js
// Create the item element
let item = document.createElement("div")
// Add a class to it. Classes are groups of elements which you can apply styles to.
item.classList.add("item")

let name = document.createElement("input")
// Set the input type to text
name.type = "text"
// Placeholder when the field is empty
name.placeholder = "Item"
// Set it's value to the argument of the function
name.value = value

let completed = document.createElement("input")
// The type of this input is a checkbox
completed.type = "checkbox"

// Span is a container, like div, but for inline elements; it won't be a separate line.
let remove = document.createElement("span")
// Set it's text
remove.innerText = "✘"
remove.classList.add("remove")
// This is to make it tabbable; so it's a stop when you press tab on the website. Important for assistive technologies.
remove.setAttribute("tabindex", "0")

// Append all the elements in order to the item div
item.appendChild(name)
item.appendChild(completed)
item.appendChild(remove)

// Append the div to the todoItems container
todoItems.appendChild(item)

// Return a reference to input.
return name
```

This function returns a refernce to the input element of the new item.

After the function, call it. I assume it's name is addItem.

```js
// This variable declaration isn't needed. You can remove the `let newItem = ` if you aren't going to use it.
let newItem = addItem("Tell my friends about the great resource icelk.dev!")
// Focus on the element
newItem.focus()
```

This should now have added a new item!

Remove the template item from your HTML; it does not have any functionality that we added in the JS with the event listeners,
we never added them to the template item.

The inside of your script tag should now look like this, but perhaps with some comments.

```js
let todoItems = document.getElementById("to-do-items")
let newItemName = document.getElementById("new-item-name")
let doneItems = document.getElementById("done-items")

function addItem(value) {
    let item = document.createElement("div")
    item.classList.add("item")

    let name = document.createElement("input")
    name.type = "text"
    name.placeholder = "Item"
    name.value = value

    let completed = document.createElement("input")
    completed.type = "checkbox"

    let remove = document.createElement("span")
    remove.innerText = "✘"
    remove.classList.add("remove")
    remove.setAttribute("tabindex", "0")

    item.appendChild(name)
    item.appendChild(completed)
    item.appendChild(remove)

    todoItems.appendChild(item)

    return name
}

let newItem = addItem("Tell my friends about the great resource icelk.dev!")
newItem.focus()
```

## Tying it all together

The logic of the to-do list can be split into multiple funcitons (as in I have a funciton, not JS functions).

1. When the user starts typing a new item (in the `new-item-name` input), make a new item and refocus the user input to the new item's input field.
2. Make the remove buttons work.
3. Move item when it's checked or unchecked.
4. Disable editing of items in the `done-items` container.
5. Most importantly; add some sweet visuals!

Things we will not do in this tutorial:

1. Drag and drop to change order
2. Sub-items

---

To add a new item when the user starts writing in the input, we'll have to listen for the `input` event.

Add this outside the function, in the same identation level (spaces left of the code).

> Here we use the `() => { code... }` syntax instead of `function () { code... }`.
> It's essentially the same, but the first is cleaner.
> You can add arguments in the parentheses `()` in both.

```js
// Listen on the `input` event (which is called every time the user entered something)
newItemName.addEventListener("input", () => {
    // Add a new item with the name of the input field that changed
    let newItem = addItem(newItemName.value)
    // Set the `newItemName` value to be nothing. We "moved" the text to another input.
    newItemName.value = ""
    // Focus the new input; the user will get moved of the `newItemName` immediately.
    newItem.focus()
})
```

---

To make the remove button work, lets add this after the `let remove = document.createElement("span")`.

```js
remove.addEventListener("click", () => {
    item.remove()
})
```

We'll also add some style to make the cursor (mouse pointer on the screen) signal the `<span>` is clickable.

Add a `<style>` tag at the end of the head. This should be inside the style tag.

```css
.remove {
    cursor: pointer;
}
```

This sets the cursor type of all elements with the class `remove` (which we added when we created the remove element).

---

Next, we'll move the item element from the `to-do-items` container to the `done-items` container.

Add this after the `completed` element creation. The order doesn't really matter,
but it looks better when we change things on one element close to other changes.

```js
completed.addEventListener("change", () => {
    // This `.checked` property only exists on checkbox input types.
    let done = completed.checked

    // Reomve the item element from it's parent element.
    item.parentElement.removeChild(item)

    // If the item is done (the checkbox is checked), we
    if (done) {
        // Add it to the doneItems contaner
        doneItems.appendChild(item)
    } else {
        // Else, add it to the todoItems container.
        todoItems.appendChild(item)
    }
})
```

---

Now, let's remove the ability to remove or change the item once it's done.

Add the following code to the end of the last event listener we added.

```js
name.disabled = done
remove.classList.toggle("disabled")
```

This disables the input (`name.disabled`) and adds the class `disabled` to the remove element.

We'll need to check if the remove class is present on the `remove` element before we remove it; else, it'll always be removed.

Replace the event listener of the `remove` element with this. Note that we only added a `if` surrounding the removal.

```js
if (!remove.classList.contains("disabled")) {
    item.remove()
}
```

To signal to the user that the disabled remove button is disabled, and not just ignore the input, let's add this CSS in the `<style>` tag you added before.

> Make sure to add it as a new rule (the blocks with the thing to act on and the style to apply).

```css
.remove.disabled {
    /* Makes the remove button less opaque */
    opacity: 0.5;
    /* Makes the cursor be a "not-allowed" style */
    cursor: not-allowed;
}
```

---

Next, let's add some nice visuals. Here, the explanations are entirely in the code, as comments. This is how you would do it in real life.

We've added the attribute
(key-value pairs inside the starting tag, after the tag name; `<tagName attribute="value">`)
`id` to some elements. An id identifies an element (shocking... i know.)
Ids can be used in three main ways.

-   First is to get a reference to the element, as we've done several times in JS.
-   The second thing we can do is to apply styles to a specific object.
    This should only be used when you only need to target one element, ever, with the styles.
    You can target this by using this syntax: `#id { styles... }`.
-   Third, you can make the browser go down to where they are located on the page.
    Let's say we have heading with id `resources` on `https://icelk.dev/`.
    If we want to share that part of the site, we can give our friends the link `https://icelk.dev/#resources`;
    a hash `#` followed by the id added to the URL.

This code should be copy and pasted to the end of the style tag.

```css
.item {
    /* Increase the size of the item. Font-size is the general size of a element; if the text increases in size, everything else does. */
    /* An em is 100% of the current font size, so 1.3em = 130%. A rem is the root em, the size of the default font size.
        It's good to specify margins and paddings with rem if you don't want spacing to increase with font size. */
    font-size: 1.3em;
    /* Padding is space between the content inside the item and the border where the background color ends. */
    padding: 0.2rem;
    /* This is the space between the borders of the items */
    margin: 0 0.5rem;

    /* This fixes a lot of issues. This and the next line centers the elements in the item vertically */
    display: flex;
    align-items: center;
}
/* We can use the > to specify children. See this web page for more details about the so called selectors. */
/* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors */
.item > input[type="text"] {
    /* Sets inputs of type text to try to occupy 100% width. */
    /* This doesn't take the whole screen because of the #list rule below. */
    /* It also doesn't take the whole width of the item because of the `display: flex;` above. It's useful! */
    width: 100%;
}
.item > input[type="checkbox"] {
    /* The checkbox doesn't like the `font-size` (it doesn't change anything), so we'll set the height and width manually. */
    /* It's 1.5 and not 1.3 because of the padding of the text input, which doesn't apply here. I know, confusing. It's easiest to just play around. */
    height: 1.5em;
    width: 1.5em;
    /* This disabes automatically shrinking due to the parent (.item) being of type flex. */
    flex-shrink: 0;
}
.item > input {
    /* Make sure the font-size is inherited from the parent .item element. This is needed as browsers force a font size on input elements. We revert that here. */
    font-size: inherit;
    padding: 0.1rem;
}
.item > .remove {
    /* Makes the font size of the remove button 120% of it's parent. Now, it's 1.3 * 1.2 size, because the parent (.item) has a 1.3em font size. */
    font-size: 1.2em;
}
.item > * {
    /* Add a margin to all .item's children */
    margin: 0 0.2rem;
}

body {
    /* Center the lists on the body with flex and justify-content */
    /* Experiment with justify-content and align-items to see which works. I don't know, so trying my way forward is helpful. */
    /* You can also search on `css flex justify-content` and click on the `developer.mozilla.org` search result. There you can find all the info. */
    display: flex;
    /* We want it to be a column of items. */
    flex-direction: column;
    align-items: center;

    /* Set the colours */
    background-color: black;
    color: white;
}
/* This specifies the element with id `list` */
#list {
    /* Make the list's width whatever is the maximum of 100% and 10rem */
    width: max(10rem, 50%);
    /* Add some padding */
    padding: 0.75rem;
}
```

My whole document now looks like this. Yours doesn't need to exactly match, this is only here as a guide to compare to if something went wrong.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>To-do list</title>
        <style>
            .remove {
                cursor: pointer;
            }
            .remove.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .item {
                font-size: 1.3em;
                padding: 0.2rem;
                margin: 0 0.5rem;

                display: flex;
                align-items: center;
            }
            .item > input[type="text"] {
                width: 100%;
            }
            .item > input[type="checkbox"] {
                height: 1.5em;
                width: 1.5em;
                flex-shrink: 0;
            }
            .item > input {
                font-size: inherit;
                padding: 0.1rem;
            }
            .item > span {
                font-size: 1.2em;
            }
            .item > * {
                margin: 0 0.2rem;
            }

            body {
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: black;
                color: white;
            }
            #list {
                width: max(10rem, 50%);
                padding: 0.75rem;
            }
        </style>
    </head>
    <body>
        <div id="list">
            <div id="to-do-items">
                <!-- Items -->
            </div>
            <div id="new-item" class="item">
                <input type="text" id="new-item-name" placeholder="Add new item..." />
            </div>
            <hr />
            <div id="done-items">
                <!-- Items which are checked -->
            </div>

            <script>
                let todoItems = document.getElementById("to-do-items")
                let newItemName = document.getElementById("new-item-name")
                let doneItems = document.getElementById("done-items")

                newItemName.addEventListener("input", () => {
                    let newItem = addItem(newItemName.value)
                    newItemName.value = ""
                    newItem.focus()
                })

                function addItem(value) {
                    let item = document.createElement("div")
                    item.classList.add("item")

                    let name = document.createElement("input")
                    name.type = "text"
                    name.placeholder = "Item"
                    name.value = value

                    let completed = document.createElement("input")
                    completed.type = "checkbox"

                    completed.addEventListener("change", () => {
                        // This `.checked` property only exists on checkbox input types.
                        let done = completed.checked

                        item.parentElement.removeChild(item)

                        if (done) {
                            doneItems.appendChild(item)
                        } else {
                            todoItems.appendChild(item)
                        }

                        name.disabled = done
                        remove.classList.toggle("disabled")
                    })

                    let remove = document.createElement("span")
                    remove.innerText = "✘"
                    remove.classList.add("remove")
                    remove.setAttribute("tabindex", "0")

                    remove.addEventListener("click", () => {
                        if (!remove.classList.contains("disabled")) {
                            item.remove()
                        }
                    })

                    item.appendChild(name)
                    item.appendChild(completed)
                    item.appendChild(remove)

                    todoItems.appendChild(item)

                    return name
                }
            </script>
        </div>
    </body>
</html>
```

It should now work. Congratulations!

# Iterative improvement: S#¡t, I reloaded. Let's save our lists!

If you reload, the list isn't saved!

Let's fix this by saving the list locally (on the users computer).
You've maybe heard of cookies (specially if you live in the EU with GDPR...)
which is a way for the web server to store info on the client.
We want to store data on the client from JS. Here, `localStorage` is a great choice.

The `localStorage` API (application programmable interface, what we've called built-ins, but API can be code from others too)
consists of getting and settings names to values where both are strings.

See [this MDN page about the feature](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#example).

Now we know how to save the data, but how do we get it?

## Getting the data

We have all the items in a container, so we can iterate (for each ... do ...) over the children of the container and extract the values.

An alternative is to make a list of all items and add a reference to the input to the list when we create a new item.
This is faster (as in fractions of milliseconds faster) but more error-prone; if the item is deleted without being removed from the list,
we'll try to get data from a non-existent input. Also, removing items from lists take some time
(but this is naturally done when we moved the item, but by the browser).

Today, we'll go with the first option.

Make a function called `saveList` with no arguments, at the end of the script tag. It should look like the following.

```js
function saveList() {
    let todoChildren = todoItems.children
    let doneChildren = doneItems.children

    // Here, we create a object called data with two properties, a list named todo and another list named done.
    let data = {
        todo: [],
        done: [],
    }

    // A function within a function to add all values of the inputs of `children` to the `list`
    function addNameToList(list, children) {
        // This is a loop. Type `for` and press tab to make the loop appear.
        // Here, we can't use `children.forEach` because of some weird JS standards.

        // let i = 0 declares i to be 0
        // the loop will continue as long as `i < children.length`
        // (this can be tricky if you remove items from the children list in the loop, then the child count is lowered.)
        // `i++` increases i by one at the end of each iteration (each time the code inside is ran).
        for (let i = 0; i < children.length; i++) {
            // Get a refernce to the child.
            // `children` is a array-like object, which means we can access the item at position i with this syntax.
            let child = children[i]

            // Gets the first child, which is the input
            let input = child.firstElementChild

            let name = input.value

            // `array.push` adds to the end of the list
            list.push(name)
        }
    }

    addNameToList(data.todo, todoChildren)
    addNameToList(data.done, doneChildren)

    // The `data` object now contains all the names.
    // To store it as a string, we're going to have to serialize it.
    // This can easily be achieved by using `JSON.stringify()`

    let string = JSON.stringify(data)

    localStorage.setItem("savedList", string)

    // Add the contents of `string` after `Saved `. Note the space, we have to specify it manually.
    alert("Saved " + string)

    return data
}
```

If you run this (by calling the function after the function), you should see a pop-up containing the data saved.

Remove the `alert` line (and it's comment, if you copy-pasted).

## Reading the saved items

For the saved data to have any meaning, we're going to read it and add items.

**See if you can do this with the `todo` items.**
To get a JS object from the text we saved, use `JSON.parse`.

> If you want to try this with the `done` items too, remember how we moved the items when pressing the `completed` checkbox.
> The same code should be useful here.

> For further help with this, consider adding the done items with the `addItem` funciton, then moving each
> (make sure to move the parent of the returned element; the function returns a reference to the input, we want to remove the item container).

Let's view my solution.

```js
function loadList() {
    let data = JSON.parse(localStorage.getItem("savedList"))

    data.todo.forEach((todoItem) => {
        addItem(todoItem)
    })

    data.done.forEach((doneItem) => {
        let input = addItem(doneItem)
        let itemContainer = input.parentElement

        // This moves the item from the `todoItems` container to `doneItems`.
        itemContainer.parentElement.removeChild(itemContainer)
        doneItems.appendChild(itemContainer)

        // This disabled input
        input.disabled = true
        // When we get a item from a array, the first item has the position `0`.
        // Therefore, the checkbox, which is the second item, has a index of 1.
        // This makes the checkbox checked.
        itemContainer.children[1].checked = true
        // Here, we are accessing the third item, with a index of `2`
        // This disabled the remove button
        itemContainer.children[2].classList.add("disabled")
    })
}

loadList()
```

Note the `loadList()` call at the end. This loads the list when the document is loaded.

To save the list every time we change something, let's add this code to the item creation function.

```js
// After the creation of `name`
name.addEventListener("input", () => {
    saveList()
})

// After the event listener attached to (listening to events from) `completed`
completed.addEventListener("change", () => {
    saveList()
})

// After the event listener attached to `remove`
// Note the event here is `click`, not `change` since this isn't a input, just a element.
remove.addEventListener("click", () => {
    saveList()
})
```

And just like that, your todo-list should not be saved. Try writing something and reload. Everything should be there!

---

This is how my `<script>` tag looks now, here for your reference if something goes wrong.

```html
<script>
    let todoItems = document.getElementById("to-do-items")
    let newItemName = document.getElementById("new-item-name")
    let doneItems = document.getElementById("done-items")

    newItemName.addEventListener("input", () => {
        let newItem = addItem(newItemName.value)
        newItemName.value = ""
        newItem.focus()
    })

    function addItem(value) {
        let item = document.createElement("div")
        item.classList.add("item")

        let name = document.createElement("input")
        name.type = "text"
        name.placeholder = "Item"
        name.value = value
        name.addEventListener("input", () => {
            saveList()
        })

        let completed = document.createElement("input")
        completed.type = "checkbox"

        completed.addEventListener("change", () => {
            let done = completed.checked

            item.parentElement.removeChild(item)

            if (done) {
                doneItems.appendChild(item)
            } else {
                todoItems.appendChild(item)
            }

            name.disabled = done
            remove.classList.toggle("disabled")
        })
        completed.addEventListener("change", () => {
            saveList()
        })

        let remove = document.createElement("span")
        remove.innerText = "✘"
        remove.classList.add("remove")
        remove.setAttribute("tabindex", "0")

        remove.addEventListener("click", () => {
            if (!remove.classList.contains("disabled")) {
                item.remove()
            }
        })
        remove.addEventListener("click", () => {
            saveList()
        })

        item.appendChild(name)
        item.appendChild(completed)
        item.appendChild(remove)

        todoItems.appendChild(item)

        return name
    }

    function saveList() {
        let todoChildren = todoItems.children
        let doneChildren = doneItems.children

        // Here, we create a object called data with two properties, a list named todo and another list named done.
        let data = {
            todo: [],
            done: [],
        }

        // A function within a function to add all values of the inputs of `children` to the `list`
        function addNameToList(list, children) {
            // This is a loop. Type `for` and press tab to make the loop appear.
            // Here, we can't use `children.forEach` because of some weird JS standards.

            // let i = 0 declares i to be 0
            // the loop will continue as long as `i < children.length`
            // (this can be tricky if you remove items from the children list in the loop, then the child count is lowered.)
            // `i++` increases i by one at the end of each iteration (each time the code inside is ran).
            for (let i = 0; i < children.length; i++) {
                // Get a refernce to the child.
                // `children` is a array-like object, which means we can access the item at position i with this syntax.
                let child = children[i]

                // Gets the first child, which is the input
                let input = child.firstElementChild

                let name = input.value

                // `array.push` adds to the end of the list
                list.push(name)
            }
        }

        addNameToList(data.todo, todoChildren)
        addNameToList(data.done, doneChildren)

        // The `data` object now contains all the names.
        // To store it as a string, we're going to have to serialize it.
        // This can easily be achieved by using `JSON.stringify()`

        let string = JSON.stringify(data)

        localStorage.setItem("savedList", string)

        return data
    }

    function loadList() {
        let data = JSON.parse(localStorage.getItem("savedList"))

        data.todo.forEach((todoItem) => {
            addItem(todoItem)
        })

        data.done.forEach((doneItem) => {
            let input = addItem(doneItem)
            let itemContainer = input.parentElement

            // This moves the item from the `todoItems` container to `doneItems`.
            itemContainer.parentElement.removeChild(itemContainer)
            doneItems.appendChild(itemContainer)

            // This disabled input
            input.disabled = true
            // When we get a item from a array, the first item has the position `0`.
            // Therefore, the checkbox, which is the second item, has a index of 1.
            // This makes the checkbox checked.
            itemContainer.children[1].checked = true
            // Here, we are accessing the third item, with a index of `2`
            // This disabled the remove button
            itemContainer.children[2].classList.add("disabled")
        })
    }

    loadList()
</script>
```

# Iterative improvement: Saving our list on a server

Let's say we want to use this list from several devices. It requires syncing to a server and fetching the data.

**_Let's implement it!_**

---

We need to change three things.

1. On load, the client needs to fetch data from the server.
2. On save, the client needs to send data to the server.
3. We should limit the calls to `saveList` to one per second so the server doesn't get flooded.

> This is really hard to do with the `code-online` setup.
> Read the [third project](#project-i-dont-trust-this-serverowner-imma-build-my-own) before this in that case.

## Prelude (download Rust!)

I've built a server which responds to our requests and saves our data.

You need to download the language `Rust` which I've built the server in.
Follow the instructions on [their official site](https://www.rust-lang.org/learn/get-started) to install.

Next, open the terminal (drag up from the top of the bottom bar) and type this. Hit enter to run the program.

```shell
$ git clone https://github.com/Icelk/beginner-programming-server server
```

This clones (makes a local copy of) [this project](https://github.com/Icelk/beginner-programming-server)
to the folder `server` (after the last space).

Now `cd` into the directory (`cd server`). Now, start the server by typing `cargo run`.

> If this doesn't run, try to execute `rustup default stable`.

Now, you can drag the terminal down again. It'll still be there, running, so you can drag it up any time.

## The Fetch API

Now, let's go back to the JS side of things.

But first, let's learn the API.

If we make a `GET` request to the URL (the thing in the address bar of your browser) `/list?id=<your id>` we get the list data of `<your id>`.
If our site is at `https://example.org` and our id is `icelk`, the request should be `https://example.org/list?id=icelk`.
Since we started the request with `/` we can omit `https://example.org`; it's relative to the current website.
The `?id=` part is the _query_. A query can add parameter to a page. We still request the page `/list`, but add some more basic data.
The question mark `?` specifies the beginning of the query, which is key-value pairs (`key=value`) separated by commas `,`.

To save the data, we make a `PUT` request to the same URL. Since the server only saves the raw data, we don't need to send
the data in any special format; the server only sends back the data we saved.

You probably don't know what `GET` and `PUT` means.
`GET` is a type of request which gets data. Going to a website makes the browser execute a `GET` request.
`PUT` is for putting data to the URL requested. The data is sent as the _body_. A `GET` response from the server contains the website in it's body,
but a `PUT` request contains the data sent in the request body.

To make requests we need to load our document from the same web server as the API is located at, for security concerns.
Make a folder (in the folder view in the left in VS Code) names `public` in `server`. Move your document there, and rename it to `index.html`.

Now, go to `http://localhost:8080/`. You should see the same web page as before
(if it says the page can't be reached, make sure the web server is running in a terminal).

> `localhost` is the domain, such as `icelk.dev`. `localhost` is the computer you're using. `:8080` defines the port.

Now, let's make a function which loads our list from the server.

> Here we use asynchronous code (not running from beginning to end, but in parallel);
> < the response from the server takes some time to get back,
> during which time we want our page to be responsive.
> Calling a `async function` immediately returns a `Promise`, which can
> be _awaited_ (waited for to finish) by writing `await` before it.
> Note that you can only `await` a `Promise` in a `async` function.

```js
async function loadListFromServer(id) {
    let response = await fetch("/list?id=" + id)

    if (!response.ok) {
        alert("id contains invalid characters, can't fetch list")
    }

    let string = await response.text()
    let data = JSON.parse(string)

    clearChildren(todoItems)
    clearChildren(doneItems)
    loadList(data)
}
```

If you read the code (and didn't just copy and paste, never copy code you don't understand),
you maybe noticed we called a function called `clearChildren`, which we havent written.
Neither is it part of the built-ins, so let's define it.

```js
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild)
    }
}
```

Next, change the call to `loadList` at the end of the script, which is ran at load, to `loadListFromServer`.

We also need to change the `loadList` function to take the data object instead of loading it from localStorage.
Remove the first line (`let data = JSON.parse(localStorage.getItem("savedList"))`) and add a `data` argument to the function.

But what id do we use? In order to save several lists on the same server (for different users), we naturally need ids.
Check the next heading for how to do this.

## **Put**ting it in the right place

Next, we need to save our list.

We'll do three things:

1. Add a ID input field in the document.
2. Save the id locally.
3. Send the data to the server.

First, let's add a input to get the ID from.

I've added this before the `item` container, but as long as it's a text input with the id `idInput`, my code should work for you.

```html
<body>
    <!-- This part is new. And this is a comment in HTML. -->
    <input id="idInput" type="text" placeholder="ID" />
    <div id="list">...</div>
</body>
```

Let's add a reference to this item in JS, after the other references.

```js
let idInput = document.getElementById("idInput")
```

And then add some event listeners when the value changes (not on each input) using the (appropriately named) `change` event.

```js
idInput.addEventListener("change", () => {
    let id = idInput.value
    localStorage.setItem("id", id)
    loadListFromServer(id)
})
```

This changes the `localStorage` entry for `id` too, so the user doesn't need to retype it every time.

Next, let's load the id and request the data from the server on load.
This code should be in the global scope, where we've previously defined all our functions.
Else, it won't be ran.

```js
let savedId = localStorage.getItem("id")

// A check to see if the value exists (if it's null, there is no id saved) and isn't empty
if (savedId != null && savedId != "") {
    loadListFromServer(savedId)
    // Set the idInput value to the loaded id
    idInput.value = savedId
}
```

---

Now, to push data to the server we need to limit the request count.
The easiest (but by far not best) way to do this is to have a interval of 1 second.
We can use a true / false value to track if any change happened since the last request to the server.

Add a variable named `changedSinceLastRequest` set to `false` (without `""`; it's not test) after the reference variables.
Next, change all the calls (there should be 3 in total) from `saveList` to `saveListToServer`.
Now, declare a function named `saveListToServer` which sets `changedSinceLastRequest` to `true`.
Then, add this after the declaration of the `changedSinceLastRequest` variable:

```js
setInterval(() => {
    if (changedSinceLastRequest) {
        let data = saveList()

        fetch("/list?id=" + id, {
            method: "PUT",
            body: JSON.stringify(data),
        })

        // Reset value
        changedSinceLastRequest = false
    }
}, 1000)
```

Your list should now save and load with the ID you enter!
You can check the `data` folder where your server is running for all the saved data!

You should now have a `id` input field and the code we wrote in this chapter should look something like this.

```js
// --snip--

let idInput = document.getElementById("idInput")
let changedSinceLastRequest = false
let serverResponded = true

setInterval(async () => {
    if (!serverResponded) {
        return
    }
    if (changedSinceLastRequest) {
        let data = saveList()
        // Reset value
        changedSinceLastRequest = false

        serverResponded = false

        let id = idInput.value

        let response = await fetch("/list?id=" + id, {
            method: "PUT",
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            alert("name contains invalid characters")
        }

        serverResponded = true
    }
}, 250)

idInput.addEventListener("change", () => {
    let id = idInput.value
    localStorage.setItem("id", id)
    loadListFromServer(id)
})

// --snip--

function addItem(value) {
    let item = document.createElement("div")
    item.classList.add("item")

    let name = document.createElement("input")
    name.type = "text"
    name.placeholder = "Item"
    name.value = value
    name.addEventListener("change", () => {
        saveListToServer()
    })

    let completed = document.createElement("input")
    completed.type = "checkbox"

    completed.addEventListener("change", () => {
        let done = completed.checked

        item.parentElement.removeChild(item)

        if (done) {
            doneItems.appendChild(item)
        } else {
            todoItems.appendChild(item)
        }

        name.disabled = done
        remove.classList.toggle("disabled")
    })
    completed.addEventListener("change", () => {
        saveListToServer()
    })

    let remove = document.createElement("span")
    remove.innerText = "✘"
    remove.classList.add("remove")
    remove.setAttribute("tabindex", "0")

    remove.addEventListener("click", () => {
        if (!remove.classList.contains("disabled")) {
            item.remove()
        }
    })
    remove.addEventListener("click", () => {
        saveListToServer()
    })

    item.appendChild(name)
    item.appendChild(completed)
    item.appendChild(remove)

    todoItems.appendChild(item)

    return name
}

// --snip--

function saveListToServer() {
    changedSinceLastRequest = true
}

function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild)
    }
}

function loadList(data) {
    if (data.todo != undefined) {
        data.todo.forEach((todoItem) => {
            addItem(todoItem)
        })
    }
    // --snip--
}

// --snip--

async function loadListFromServer(id) {
    let response = await fetch("/list?id=" + id)

    if (!response.ok) {
        alert("id contains invalid characters, can't fetch list")
    }

    let string = await response.text()
    let data = JSON.parse(string)

    clearChildren(todoItems)
    clearChildren(doneItems)
    loadList(data)
}

let savedId = localStorage.getItem("id")

if (savedId != null) {
    loadListFromServer(savedId)
    idInput.value = savedId
}
```

# Project: I don't trust this server-owner. Imma build my own!

The last thing to make this application fully yourself is to build the server that serves the website and
provides a API for saving the data.

> The code you download (`git clone`d) before is what we are going to build.

Let's make a new folder named `our-server` in the same level as the `server` folder that's currently running the website.
Enter it by navigating with the `cd` command in the terminal. `cd ..` goes up one level and
`cd our-server` goes into the folder named `our-server`.

## Rust is stricter

We are going to write the server in [Rust](https://rust-lang.org), a modern, safe, and
_very_ fast programming language, especially compared to JS.

As you saw in [the second example](#example-saying-hello-in-multiple-languages), we sometimes need to tell
Rust which types we want to accept in functions. The syntax is also stricter.

> Many programmers prefer this strictness, as it catches silly bugs (errors) before
> we deploy our code to production.

Critically, JS is _the_ programming language of the web, while Rust only works as apps you
run on your computer. Rust can be ran on the web through [WebAssembly](https://webassembly.org/),
though it is relatively complicated. It is however considerably speedier.

## Using Kvarn

[Kvarn](https://kvarn.org) is a great web framework for Rust that we are going to use.
It handles all the underlying security, speed, handling of messages and lots of other things for us.

Assuming your terminal is in the newly created folder `our-server`,
run `cargo init` to initiate a new Rust project.

> [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html)
> is a Rust tool that, [among other things](https://doc.rust-lang.org/cargo/reference/),
> manages dependencies (other's code you use).

Let's edit the `src/main.rs` (a file named `main.rs` in a directory called `src`) file. This file is where our program starts.
Enter this to get a web server running on port 8080. Make sure to stop the previous server (`Ctrl+C`).

```rust
// Imports (makes them available to *use*) the Kvarn types we'll use.
use kvarn::prelude::*;

// Enables the main function to be async
#[tokio::main]
async fn main() {
    // Create a host with hostname "localhost", serving files from directory "./web/public/", with the default extensions and the default options.
    // Unsecure here means we're not using HTTPS - the protocol used to secure and speed up connections over the internet.
    let host = Host::unsecure("localhost", "web", Extensions::default(), host::Options::default());
    // Create a set of virtual hosts (`Data`) with `host`.
    let data = Data::builder().insert(host).build();
    // Bind port 8080 with `data`.
    let port_descriptor = PortDescriptor::unsecure(8080, data);

    // Run with the configured ports.
    let shutdown_manager = RunConfig::new()
        .bind(port_descriptor)
        .execute()
        .await;

    // Waits for shutdown. This will currently never happen, so the server is ran forever.
    shutdown_manager.wait().await;
}
```

As you see, we await on `Promise`s (called `Future`s in Rust, but they are essentially the same)
by writing `.await` after a async function, not by writing `await` before it.

But we have a problem! If you try to run the program by executing `cargo run` in the terminal, it will err.
Kvarn and Tokio aren't found!

To fix this, let's add Kvarn to our project. Add this to the bottom of `Cargo.toml`, in the `[dependencies]` section.

```ini
kvarn = { version = "0.3", features = ["full"] }
tokio = { version = "1", features = ["macros"] }
```

`Cargo.toml` should now look like this:

```ini
[package]
name = "our-server"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
kvarn = { version = "0.3", features = ["full"] }
tokio = { version = "1", features = ["macros"] }
```

Now, if you try to run it, it'll download and compile
(translate the code you write to what computers understand)
all the required dependencies and run the server. You should be able to access
the website `localhost:8080` in your browser, after this process is finished.
It should be a `404 Not Found` error, as we've not provided any content.

> If you want to play around with performance in Rust, remember to run with `cargo run --release`!

## How to store the data?

Now, how are we going to store the data sent by our web site?
To keep this simple, we are going to save each list in a separate file.

Add this at the top of the Rust file, in between the Kvarn import and our main function.

```rust
const DATA_DIR: &str = "data";
```

This defines the path to store data in. This can be any path, but I chose the relative `data` directory.

Let's create that directory every time the web server runs, so we can store files there.
In `src/main.rs`, add this at the top of the `main` function.

```rust
tokio::fs::DirBuilder::new().create(DATA_DIR).await.unwrap();
```

The `.unwrap()` is to handle a error we might encounter. If you hover over the `crate` method,
you can see it returns a `Result`, meaning an error could have occurred.
This can be permission issues, among other things. Our program will not function if we cannot create the `data`
folder, so we tell Rust to exit the program in this case.

> If the hover doesn't show anything, install the `rust-analyzer` extension in VS Code.

> Hover over `unwrap` to see documentation about it.

Creating a file is done (asynchronously) with
[`tokio::fs::File::create(path)`](https://docs.rs/tokio/1.7.1/tokio/fs/struct.File.html#method.create).
We can then write to it by calling `file.write_all(bytes)` to write bytes to the file.
A byte is a integer (whole number) with a range from 0 to 255; 256 distinct values, including `0`.
Everything is stored as bytes in computers. As such, we get an array of bytes from Kvarn. We then store them in a file.

> Not all configurations of bytes are valid text. If you try to open a image in
> a text-editing program (not VS Code), you should see weird text;
> it tries to interpret the bytes of the image as text!

## Logging

Kvarn logs many events, which can be useful if something goes wrong; you can
pin-point the problem and easily filter to see if something goes wrong.

Add the `env_logger` crate (dependency) with version "^0.8" (which means "0.8.whatever") to `Cargo.toml`.

```ini
env_logger = "^0.8"
```

Now, initiate the logger when the program starts at the very start of our `main` function.

```rust
env_logger::init();
```

Your `Cargo.toml` should look something like this:

```ini
[package]
name = "our-server"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
env_logger = "0.9"
kvarn = { version = "0.3", features = ["mt"] }
tokio = { version = "1", features = ["macros"] }
```

And your `src/main.rs` like this.

```rust
use kvarn::prelude::*;

const DATA_DIR: &str = "data";

#[tokio::main]
async fn main() {
    env_logger::init();

    tokio::fs::DirBuilder::new().recursive(true).create(DATA_DIR).await.unwrap();

    // Create a host with hostname "localhost", serving files from directory "./web/public", and the default extensions and the default options.
    let host = Host::unsecure(
        "localhost",
        "web",
        Extensions::new(),
        host::Options::new(),
    );
    // Create a set of virtual hosts (`Data`) with `host` as the default.
    let data = Data::builder().insert(host).build();
    // Bind port 8080 with `data`.
    let port_descriptor = PortDescriptor::unsecure(8080, data);

    // Run with the configured ports.
    let shutdown_manager = RunConfig::new()
        .bind(port_descriptor)
        .execute()
        .await;

    // Waits for shutdown.
    shutdown_manager.wait().await;
}
```

## Receive the data

Next, let's get this working!

I'm giving you all the code, filled with comments, for you to explore on your own.
If you find anything unclear, please [email me](mailto:Icelk<main@icelk.dev>)
so I can resolve any issues.

```rust
use kvarn::prelude::*;

// This below is a documentation comment.
// They exist in Rust and provide a way for you to add documentation to your types.
// Hover over the name `DATA_DIR` below to see the comment!
/// The data directory storing the lists.
const DATA_DIR: &str = "data";

#[tokio::main]
async fn main() {
    // Init the logger
    env_logger::init();

    // Create the folder `DATA_DIR`
    tokio::fs::DirBuilder::new().recursive(true).create(DATA_DIR).await.unwrap();

    // Create a new set of extensions
    let mut extensions = Extensions::new();

    // Handle requests to `/list` with this code.
    // Here, we define the API which handles saving and retrieving lists.
    extensions.add_prepare_single("/list", prepare!(req, host, _path, _addr {
        // Parse (a Kvarn function) the query, the part of the URL (or URI as it's officially called) after the `?`.
        let query = parse::query(req.uri().query().unwrap_or(""));
        // Get the `id` part of the query.
        let id = query.get("id");

        // If the id is present in the query, do this
        if let Some(id) = id {
            // See if any characters of the id are considered illegal by us.
            let contains_illegal_chars = id.value().chars().any(|char| !(char.is_ascii_alphanumeric() || char == '_' || char == '-'));

            if contains_illegal_chars {
                return default_error_response(StatusCode::BAD_REQUEST, host, None).await;
            }

            // See which method was requested.
            // Return the list if the method is GET
            // and save it if the method is PUT.
            match *req.method() {
                Method::GET => {
                    // Define a function to read from a file and get the bytes.
                    // This is here so we can use `?` to return if a error occurs.
                    // We then only have to handle an error once, when we call this function below.
                    async fn read_file(path: &Path) -> io::Result<Bytes> {
                        let mut file = tokio::fs::File::open(path).await?;
                        let mut buffer = BytesMut::with_capacity(4096);
                        async_bits::read_to_end(&mut buffer, &mut file).await?;
                        Ok(buffer.freeze())
                    }
                    // Create a new path
                    let mut path = PathBuf::new();
                    // Add DATA_DIR to it
                    path.push(DATA_DIR);
                    // Then add the id, as the filename
                    path.push(id.value());

                    // This is a log.
                    info!("Reading id {}", id);

                    // Read the file
                    let body = read_file(&path).await;

                    // If the operation was successful, return
                    // (the last thing with no `;` at the end)
                    // a new response,
                    // else a empty response.
                    //
                    // The from_static takes a byte input (which can be written as b"bytes" in Rust)
                    // and creates a Bytes object from it.
                    // The `{}` signals to the JS requesting this that the list is empty.
                    // If we didn't include the `{}`, the `JSON.parse` would fail, as it wouldn't
                    // be valid JSON, which our JS expects.
                    match body {
                        Ok(body) => {
                            let response = Response::new(body);
                            FatResponse::no_cache(response)
                        }
                        Err(_) => {
                            FatResponse::no_cache(Response::new(Bytes::from_static(b"{}")))
                        }
                    }
                }
                Method::PUT => {
                    // Same here, we define a function to simplify error handling.
                    // The body is a Kvarn type of a stream we can get the bytes from.
                    async fn read_write_file(path: &Path, body: &mut application::Body) -> io::Result<()> {
                        // Get the bytes from the client (the JS)
                        let content = body.read_to_bytes().await?;

                        // Don't accept lists larger than 128KB (1024 * 128 bytes) in size
                        if content.len() >= 1024 * 128 {
                            return Err(io::Error::new(io::ErrorKind::InvalidData, "data too long"));
                        }

                        // Create the file
                        let mut file = tokio::fs::File::create(path).await?;
                        // Write all the data
                        file.write_all(&content).await?;
                        Ok(())
                    }

                    let mut path = PathBuf::new();
                    path.push(DATA_DIR);
                    path.push(id.value());

                    info!("Writing id {}", id);

                    // If the read_write_file function returns a error, run this
                    if let Err(err) = read_write_file(&path, req.body_mut()).await {
                        // Return different status codes and reasons depending on the error of the
                        // function.
                        let (status_code, reason) = match err.kind() {
                            io::ErrorKind::InvalidData => (StatusCode::BAD_REQUEST, Some("list too long, must be less than 128KB")),
                            _ => (StatusCode::INTERNAL_SERVER_ERROR, None)
                        };
                        default_error_response(status_code, host, reason).await
                    } else {
                        // else, return a new, empty response.
                        // `Bytes::new()` is the same as `Bytes::from_static(b"")`.
                        FatResponse::no_cache(Response::new(Bytes::new()))
                    }
                }
                // In all other cases (more methods exist),
                // send a method not allowed error to the client.
                _ => {
                    default_error_response(StatusCode::METHOD_NOT_ALLOWED, host, None).await
                }
            }
        } else {
            // If a id doesn't exist, return a bad request error, telling the client it should have
            // a id in it's request query.
            default_error_response(StatusCode::BAD_REQUEST, host, Some("You need an ID in the query.")).await
        }
    }));

    // Create a host with hostname "localhost", serving files from directory "./web/public", and the default extensions.
    let host = Host::unsecure(
        "localhost",
        "web",
        extensions,
        host::Options::new(),
    );
    // Create a set of virtual hosts (`Data`) with `host` as the default.
    let data = Data::builder().insert(host).build();
    // Bind port 8080 with `data`.
    let port_descriptor = PortDescriptor::unsecure(8080, data);

    // Run with the configured ports.
    let shutdown_manager = RunConfig::new()
        .bind(port_descriptor)
        .execute()
        .await;

    // Waits for shutdown.
    // This will never happen; we don't shut it down anywhere!
    shutdown_manager.wait().await;
}
```

If you now `cargo run`, the web application should work just like before, but now
you know how it's saved and have complete control over the server!

# Conclusion

In this tutorial, you've developed a full-stack web application.
You now know how to integrate the web with back-end technologies.

If you continue being interested in learning, you'll soon be a wiz
at computer science. I've been programming for 4 years, and feel I could
start working full time with programming. **_I leaned it all by myself
through curiosity and enjoyment_**.

**_You can very well soon land a job doing just this!_**

# Further reading

[The Rust book](https://doc.rust-lang.org/stable/book/ch00-00-introduction.html)
A great writeup by the Rust community you should now be ready to tackle,
which goes in great depth about programming in relation to memory and other lower level concepts.
I've seen many who think this is unimportant, but it'll help you optimize and build better,
less buggy products.

To further your understanding, I recommend watching
[Fireship's YouTube channel](https://youtube.com/c/Fireship)
as he produces quality content about new and relevant technologies.

For more insight into a life of a developer, see
[Ben Awad's channel](https://youtube.com/c/BenAwad97).

But most importantly, if you get an idea, write it down, think about it,
and begin coding it. [Searching](https://search.brave.com) for help is your best friend here,
Stack Overflow is a great place for info about common problems.
If you program in JS, the
[MDN](https://developer.mozilla.org) is a great place for finding reference material.

Last edited at ${date}.
