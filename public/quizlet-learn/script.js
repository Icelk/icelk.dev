let page_input = document.getElementById("page-input")
let word_display = document.getElementById("word-display")
let word_result = document.getElementById("word-result")
let word_input = document.getElementById("word-input")
let swap_button = document.getElementById("swap-words")
let learn = document.getElementById("learn")
let page_error = document.getElementById("page-error")

let words = []
let active_words = []
let failed_words = []
let answer = null

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
word_input.addEventListener("keydown", (e) => {
    word_result.innerText = "Keep going!"
    if (e.key === "Enter") {
        if (word_input.value === answer) {
            word_result.innerText = "Correct!"
        } else {
            failed_words.push([word_display.innerText, answer])
            word_result.innerText = `Wrong. Right answer was ${answer}. `
        }
        word_input.value = ""
        if (active_words.length === 0) {
            if (failed_words.length === 0) {
                word_result.innerText += `Done. You completed every word! Redoing all words.`
                active_words = [...words]
            } else {
                word_result.innerText += `Done. Failed ${failed_words.length}/${words.length}. Redoing the failed words.`
                active_words = [...failed_words]
                failed_words = []
            }
        }
        random_word()
    }
})

async function get_page(page) {
    let response = await fetch(`/quizlet-learn/words?quizlet=${page}`)
    if (response.status !== 200) {
        page_error.innerText = `The quizlet URL is invalid: ${response.statusText} ${response.headers.get("reason")}`
        return
    }
    page_error.innerText = ""
    let body = await response.text()
    let w = []
    body.split("\n").forEach((line) => {
        w.push(line)
        if (w.length >= 2) {
            words.push(w)
            w = []
        }
    })
    failed_words = []
}
function start_words() {
    if (words.length === 0) {
        return
    }
    active_words = [...words]
    learn.style.display = ""
    random_word()
}
function random_word() {
    let i = Math.floor(Math.random() * active_words.length)
    let word = active_words[i]
    active_words.splice(i, 1)
    answer = word[1]
    word_display.innerText = word[0]
}
function swap_words() {
    let w = [...words]
    for (let i = 0; i < w.length; i++) {
        const word = w[i]
        words[i] = [word[1], word[0]]
    }
}
