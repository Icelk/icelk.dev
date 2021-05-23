const themes = ["ice", "sol"]

const cycleTheme = async () => {
    let theme =
        localStorage.getItem("theme") ||
        (window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("content") === '"light"'
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
const changeTheme = async (newTheme) => {
    localStorage.setItem("theme", newTheme)
    let body = document.body

    for (let theme = 0; theme < themes.length; theme++) {
        body.classList.remove(themes[theme])
    }
    body.classList.add(newTheme)
}

const to = (location) => {
    window.location.href = location
}

const initThemes = async () => {
    // Load or define theme and hue setting
    let storedTheme =
        localStorage.getItem("theme") ||
        (window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("content") === '"light"'
            ? themes[1]
            : themes[0])

    document.body.classList.add(storedTheme)

    for (let i = 0; i < themes.length; i++) {
        const element = themes[i]
    }
    for (let index = 0; index < themes.length; index++) {
        let button = document.getElementById(`set-theme-${themes[index]}`)
        button.addEventListener("click", () => changeTheme(themes[index]))
    }

    const projects = document.getElementById("top-bar").children
    for (let child = 0; child < projects.length; child++) {
        const listItem = projects[child]
        const listItemChildren = listItem.children
        let link
        for (let liChild = 0; liChild < listItemChildren.length; liChild++) {
            const element = listItemChildren[liChild]
            let href = element.getAttribute("href")

            if (href !== undefined) {
                link = href
                break
            }
        }
        if (link === null) {
            continue
        }

        if (link === window.location.pathname) {
            listItem.classList.add("visiting")
            break
        }
    }
}
const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor_link) => {
        anchor_link.addEventListener("click", function (e) {
            e.preventDefault()

            let anchor = document.getElementById(
                this.getAttribute("href").substring(1)
            )

            if (anchor !== null) {
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

    let queryString =
        content === "not-titles"
            ? "h2, h3, h4, h5, h6"
            : "h1, h2, h3, h4, h5, h6"

    document.querySelectorAll(queryString).forEach((heading) => {
        let id = heading.getAttribute("id")
        if (id !== undefined) {
            heading.innerHTML +=
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />\
            </svg>'
            let linkButton = heading.lastElementChild
            linkButton.onclick = () => {
                let { protocol, host, pathname, search } = document.location
                let link = `${protocol}${host}${pathname}${search}#${id}`
                navigator.clipboard.writeText(link)
                linkButton.classList.add("pressed")
                setTimeout(() => linkButton.classList.remove("pressed"), 150)
            }
            linkButton.classList.add("share-button")
        }
    })
}

initThemes()
initSmoothScrolling()
initCopyHeading()

if (typeof hljs !== "undefined") {
    hljs.highlightAll()
}
