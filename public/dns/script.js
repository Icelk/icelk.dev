const statusHeading = document.getElementById("status")
const lookup = document.getElementById("lookup")
const lookupResult = document.getElementById("lookupResult")
const getIp = document.getElementById("getIp")
const tlsCheck = document.getElementById("tlsCheck")
const tlsCheckResult = document.getElementById("tlsCheckResult")

function setError() {
    statusHeading.innerText = "Erroneous!"
    statusHeading.style.color = "red"
}

function resetLookupResults() {
    // Clear `lookupResult`
    lookupResult.innerHTML = ""

    lookupResult.style.display = "none"
    if (lookupResult.nextElementSibling?.tagName === "BR") {
        lookupResult.nextElementSibling.remove()
    }
}
function appendLookupResult(response, query) {
    // Format:
    // `type value`

    if (lookupResult.childElementCount !== 0) {
        lookupResult.children[0].before(document.createElement("hr"))
    }

    const request = document.createElement("p")
    request.innerText = `${query.substring(0, query.length - 1)}:`
    request.classList.add("domain")
    if (lookupResult.children.length === 0) {
        lookupResult.appendChild(request)
    } else {
        lookupResult.children[0].before(request)
    }

    if (lookupResult.childElementCount === 1) {
        const clear = document.createElement("button")
        clear.innerText = "Clear"
        clear.classList.add("box")
        clear.addEventListener("click", (_) => {
            resetLookupResults()
        })
        lookupResult.appendChild(clear)
    }

    response.split("\n").forEach((line) => {
        if (line.length === 0) {
            return
        }

        const type = line.split(" ")[0]
        const value = line.substring(type.length + 1) ?? ""

        const p = document.createElement("p")
        const span = document.createElement("span")
        span.innerText = `${type}: `
        const result = document.createElement("span")
        result.addEventListener("click", (_) => {
            window.getSelection().selectAllChildren(result)
        })
        if (type === "MX" || type === "CNAME") {
            result.addEventListener("dblclick", (_) => {
                lookup.value = result.innerText
                lookupHandler()
            })
        }
        result.innerText = value

        p.appendChild(span)
        p.appendChild(result)

        request.after(p)
    })
    if (response.trim().length === 0) {
        const notFound = document.createElement("p")
        notFound.innerText = "No results found."
        request.after(notFound)
    }

    lookupResult.style.display = ""
    if (lookupResult.nextElementSibling?.tagName !== "BR") {
        lookupResult.after(document.createElement("br"))
    }
}

fetch("lookup?domain=icelk.dev.").then((response) => {
    if (response.ok) {
        statusHeading.innerText = "Service operational"
    } else {
        setError()
    }
})

function getDomain(url) {
    if (url.startsWith("https://")) {
        return url.substring(8).split("/")[0]
    } else if (url.startsWith("http://")) {
        return url.substring(7).split("/")[0]
    } else {
        return url
    }
}

function lookupHandler() {
    let value = lookup.value ?? ""
    value = getDomain(value)
    const fqdn = value.endsWith(".") ? value : `${value}.`

    const domain = encodeURIComponent(fqdn.trim())

    if (domain === ".") {
        resetLookupResults()
        return
    }

    fetch(`lookup?domain=${domain}`).then((response) => {
        if (!response.ok) {
            lookupResult.style.display = ""
            appendLookupResult("", domain)
            return
        }

        response.text().then((response) => {
            appendLookupResult(response, domain)
        })
    })
}

addListeners(lookup, lookupHandler)
addListeners(tlsCheck, tlsCheckHandler)

const ipResolver = (_) => {
    fetch("/ip").then(async (response) => {
        if (response.ok) {
            const text = await response.text()
            getIp.innerText = text
            getIp.classList.add("revealed")
        } else {
            getIp.innerText = "Failed to get your IP"
            getIp.classList.add("revealed")
        }

        getIp.removeEventListener("click", ipResolver)
    })
}
getIp.addEventListener("click", ipResolver)

function tlsCheckHandler() {
    if (tlsCheck.value.trim() === "") {
        tlsCheckResult.innerHTML = ""
        tlsCheckResult.style.display = "none"
    }
    const ip = tlsCheck.value.split("#")[0].trim()
    const name = (tlsCheck.value.split("#")[1] ?? "").trim()

    if (ip === "" || name === "") {
        tlsCheckResult.innerHTML =
            "<p>Please use the format <code>ip#name</code>, e.g. <code>90.225.99.101#icelk.dev</code>.</p>"
        tlsCheckResult.style.display = ""
        return
    }

    tlsCheckResult.innerHTML = "<p>Checking...</p>"
    tlsCheckResult.style.display = ""

    fetch(`check-dns-over-tls?ip=${ip}&name=${name}`).then(async (response) => {
        if (!response.ok) {
            tlsCheckResult.innerHTML = `<p>Server response: ${response.status} ${response.statusText}</p>`
        } else {
            const text = await response.text()
            if (text === "supported") {
                tlsCheckResult.innerHTML = "<p>Supported</p>"
            } else if (text === "unsupported") {
                tlsCheckResult.innerHTML =
                    "<p>Unsupported / wrong host name</p>"
            } else {
                tlsCheckResult.innerText = `<p>${text}</p>`
            }
        }
        tlsCheckResult.style.display = ""
    })
}

/**
 * @param {HTMLElement} element
 */
function addListeners(element, handler) {
    let clickable = true
    let f = () => {
        if (clickable) {
            handler()
            clickable = false
            setTimeout(() => {
                clickable = true
            }, 100)
        }
    }
    element.addEventListener("change", (_) => f())
    element.addEventListener("keydown", (ev) => {
        if (ev.code === "Enter") {
            f()
            ev.preventDefault()
        }
    })
}

// cancel submit events from forms
document.querySelectorAll("form").forEach((elem) => {
    elem.addEventListener("submit", (e) => e.preventDefault())
})
