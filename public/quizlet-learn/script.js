let page_input = document.getElementById("page-input")
let word_display = document.getElementById("word-display")
let word_result = document.getElementById("word-result")
let word_input = document.getElementById("word-input")
let swap_button = document.getElementById("swap-words")
let reset_button = document.getElementById("reset-words")
let learn = document.getElementById("learn")
let page_error = document.getElementById("page-error")

let stored_words = localStorage.getItem("saved-words")

// @type [ (source_words:) string[], (answers:) string[] ]
let words = []

if (stored_words !== null) {
    let saved_words = null
    try {
        saved_words = JSON.parse(stored_words)
    } catch (e) {}
    if (saved_words !== null) {
        words = saved_words
    }
    setTimeout(start_words, 100)
}

let active_words = []
let failed_words = []
let answers = null
let source_words = null
// make the user type the answer to practise
let checking = false
let reset_result_words = false
let round = 1
let prevent_next = false
let learn_children = learn.children.length

page_input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        page_input.disabled = true
        await get_page(page_input.value)
        start_words()
        page_input.disabled = false
    }
})
swap_button.addEventListener("click", () => {
    swap_words()
    start_words()
})
reset_button.addEventListener("click", () => {
    start_words()
})
word_input.addEventListener("keydown", (e) => {
    let success = () => {
        word_input.value = ""

        if (reset_result_words) {
            reset_result_words = false
            while (learn.children.length > learn_children) {
                learn.lastElementChild.remove()
            }
        }

        if (active_words.length === 0) {
            if (failed_words.length === 0) {
                word_result.innerText += ` You completed every word! Redoing all words.`
                reset_result_words = true
                active_words = [...words]
            } else {
                word_result.innerText += ` Failed ${failed_words.length}/${words.length}. Redoing the failed words.`
                append_failed()
                active_words = [...failed_words]
                failed_words = []
            }
        }
        random_word()
    }

    if (checking) {
        if (e.key === "Enter") {
            word_result.innerText = "Keep going!"
            checking = false
            success()
        } else {
            // make sure the value has updated
            setTimeout(() => {
                if (answers.some((answer) => word_input.value === answer)) {
                    prevent_next = true
                    word_result.innerText = "Correct!"
                    checking = false
                    success()

                    setTimeout(() => {
                        prevent_next = false
                    }, 500)
                }
            }, 0)
        }
        return
    }
    let v = word_input.value
    setTimeout(() => {
        if (word_input.value !== v) {
            prevent_next = false
        }
    }, 0)
    word_result.innerText = "Keep going!"
    if (
        e.key === "Enter" &&
        (!prevent_next || word_input.value.trim() === "")
    ) {
        if (answers.some((answer) => word_input.value === answer)) {
            word_result.innerText = "Correct!"
        } else {
            failed_words.push([source_words, answers])
            word_result.innerText = `Right answer was ${answers
                .map((s) => `"${s}"`)
                .join(" or ")}. Type it to continue.`
            checking = true
            return
        }
        success()
    }
})

async function get_page(page) {
    let response = await fetch(`/quizlet-learn/words?quizlet=${page}`)
    if (response.status !== 200) {
        page_error.innerText = `The quizlet URL is invalid: ${
            response.statusText
        } ${response.headers.get("reason")}`
        return
    }
    page_error.innerText = ""
    let body = await response.text()
    let w = []
    words.length = 0
    body.split("\n").forEach((line) => {
        w.push(
            line
                .split("|")
                .map((s) => s.trim())
                .filter((s) => s !== "")
        )
        if (w.length >= 2) {
            words.push(w)
            w = []
        }
    })
    failed_words = []
}
function start_words() {
    if (words.length === 0) {
        page_error.innerText = "The URL doesn't point to a Quizlet word list."
        return
    }
    active_words = [...words]
    round = 1
    while (learn.children.length > learn_children) {
        learn.lastElementChild.remove()
    }
    learn.style.display = ""
    word_result.innerText =
        "Feel free to start typing. Press enter when completed."
    random_word()
}
function random_word() {
    let i = Math.floor(Math.random() * active_words.length)
    let pair = active_words[i]
    active_words.splice(i, 1)
    source_words = pair[0]
    answers = pair[1]
    word_display.innerText = pair[0].join(", ")
}
function swap_words() {
    let w = [...words]
    for (let i = 0; i < w.length; i++) {
        const word = w[i]
        words[i] = [word[1], word[0]]
    }
}

function append_failed() {
    let div = document.createElement("div")
    div.classList.add("failed-words")
    let h = document.createElement("h1")
    h.innerText = `Round ${round} failed words`
    round += 1
    div.appendChild(h)
    let grid = document.createElement("div")
    grid.classList.add("failed-words-grid")
    failed_words.forEach(([words, answers]) => {
        let word = document.createElement("span")
        word.innerText = words.join(" or ")
        let answer = document.createElement("span")
        answer.innerText = answers.join(" or ")
        grid.appendChild(word)
        grid.appendChild(answer)
    })
    div.appendChild(grid)
    learn.appendChild(div)
}

function show_failed() {
    failed_words = [...words]
    active_words = []
    append_failed()
}
