// @ts-check
const themes = ["ice", "sol"]

const cycleTheme = () => {
    let theme =
        localStorage.getItem("theme") ||
        (window.getComputedStyle(document.documentElement).getPropertyValue("content") === '"light"'
            ? themes[1]
            : themes[0])

    if (theme === themes[1]) {
        localStorage.setItem("theme", themes[0])
        document.body.classList.replace(themes[1], themes[0])
    } else {
        localStorage.setItem("theme", themes[1])
        document.body.classList.replace(themes[0], themes[1])
    }
}
/**
 * @param {string} newTheme
 */
const changeTheme = (newTheme) => {
    localStorage.setItem("theme", newTheme)
    let body = document.body

    for (let theme = 0; theme < themes.length; theme++) {
        body.classList.remove(themes[theme])
    }
    body.classList.add(newTheme)
}

/**
 * @param {string} location
 */
const to = (location) => {
    window.location.href = location
}

/**
 * @param {HTMLElement} element
 */
const highlight = (element) => {
    // Add highlight
    element.classList.add("transition-highlight")
    // Make focusable
    element.tabIndex = -1
    element.focus({ preventScroll: true })
    element.addEventListener("focusout", (_) => {
        // Reset state
        element.removeAttribute("tabindex")
    })
}

const initThemes = () => {
    const themeMq = window.matchMedia("(prefers-color-scheme: light)")
    const initTheme = () => {
        // Load or define theme and hue setting
        let storedTheme = localStorage.getItem("theme") || (themeMq.matches ? themes[1] : themes[0])

        themes.forEach((theme) => document.body.classList.remove(theme))
        document.body.classList.add(storedTheme)
    }

    themeMq.addEventListener("change", initTheme)

    initTheme()

    for (let index = 0; index < themes.length; index++) {
        let button = document.getElementById(`set-theme-${themes[index]}`)
        button.addEventListener("click", () => changeTheme(themes[index]))
    }
}
const initTopBar = () => {
    const projects = document.getElementById("top-bar").children
    for (let child = 0; child < projects.length; child++) {
        const listItem = projects[child]
        const listItemChildren = listItem.children
        let link = listItem.getAttribute("href") !== null ? listItem : null
        if (link === null) {
            for (let liChild = 0; liChild < listItemChildren.length; liChild++) {
                const element = listItemChildren[liChild]

                if (element.getAttribute("href") !== null) {
                    link = element
                    break
                }
            }
        }
        if (link === null) {
            continue
        }

        if (link.getAttribute("href") === window.location.pathname) {
            listItem.classList.add("visiting")
            /**
             * @param {MouseEvent} e
             */
            const handler = (e) => {
                if (e.metaKey || e.ctrlKey) {
                    return
                }
                document.documentElement.scrollTo({ top: 0, behavior: "smooth" })
                e.preventDefault()
            }
            link.addEventListener("click", handler)
            break
        }
    }
}
const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor_link) => {
        anchor_link.addEventListener("click", function (e) {
            e.preventDefault()

            let href = this.getAttribute("href")

            let anchor = document.getElementById(href.substring(1))

            history.replaceState({}, "", href)

            if (anchor !== null) {
                highlight(anchor)

                anchor.scrollIntoView({
                    behavior: "smooth",
                })
            }
        })
    })
}
const initCopyHeading = () => {
    // Only enable on
    let metaEnabled = document.querySelector("meta[name='permalinks']")
    let content = metaEnabled?.getAttribute("content")
    if (content !== "enabled" && content !== "not-titles") {
        return
    }

    let queryString = content === "not-titles" ? "h2, h3, h4, h5, h6" : "h1, h2, h3, h4, h5, h6"

    document.querySelectorAll(queryString).forEach((heading) => {
        let id = heading.getAttribute("id")
        if (id !== undefined) {
            let linkButton = document.createElement("span")
            linkButton.title = "Copy permalink"
            linkButton.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />\
            </svg>'
            let linkSVG = linkButton.firstElementChild
            linkButton.onclick = () => {
                let link = `${document.location.href.split("#")[0]}#${id}`
                navigator.clipboard.writeText(link)
                linkSVG.classList.add("pressed")
                setTimeout(() => linkSVG.classList.remove("pressed"), 150)
            }
            linkSVG.classList.add("share-button")
            heading.appendChild(linkButton)
        }
    })
}

const initLinks = () => {
    document.querySelectorAll("[action]").forEach((element) => {
        switch (element.getAttribute("action")) {
            case "go-back": {
                element.addEventListener("click", (_) => history.back())
                break
            }
            default: {
                console.error(`Unknown action ${element.getAttribute("action")} on element ${element}.`)
            }
        }
    })
}

const initHighlight = () => {
    const fragment = location.hash.substring(1)

    if (fragment === "") {
        return
    }

    console.log(fragment)

    const anchor = document.getElementById(fragment)
    console.log(anchor)

    if (anchor !== null) {
        highlight(anchor)
    }
}

const asyncInit = async () => {
    initThemes()

    initTopBar()
    initSmoothScrolling()
    initCopyHeading()
    initLinks()
    initHighlight()
}

asyncInit()

// @ts-ignore
if (typeof hljs !== "undefined") {
    // @ts-ignore
    hljs.highlightAll()
}
