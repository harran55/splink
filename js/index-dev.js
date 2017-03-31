/* UTILITIES
================================================================================================= */

const hasClass = (el, className) => {
  if (el.classList) return el.classList.contains(className)
  else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

const addClass = (el, className) => {
  if (el.classList) el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

const removeClass = (el, className) => {
  if (el.classList) el.classList.remove(className)
  else if (hasClass(el, className)) {
    let reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

const windowScrollable = () => document.documentElement.scrollHeight !== document.documentElement.clientHeight

// returns data object as URL query string parameter (no nesting!)
const encodeQuery = data => {
  let out = [], uri = encodeURIComponent
  for (let k in data) out.push(uri(k) + "=" + uri(data[k]))
  return "?" + out.join("&")
}

// returns the URL query string parameter value for a given key (no nesting!)
const queryValue = key => {
  let v = new RegExp("[\\?&]"
    + key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]") + "=([^&#]*)")
    .exec(window.location.search)
  v = (v === null) ? "" : decodeURIComponent(v[1].replace(/\+/g, " "))
  return (v.indexOf(",") === -1) ? v : v.split(",")
}

const isUrl = url => {
  let a = document.createElement('a')
  a.href = url
  return (a.host && a.host != window.location.host)
}

// shortens long url with goo.gl API
// callback has reference to xhr object
const requestShortUrl = (url, callback) => {
  let xhr = new XMLHttpRequest()
  let api = "https://www.googleapis.com/urlshortener/v1/url"
  let key = "AIzaSyCpo6kHvq4c_lkLo1SHVgI3SjaPkyvFrMI"
  xhr.open("POST", api + "?key=" + key)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = () => callback(xhr)
  xhr.send('{"longUrl": "' + url + '"}')
}

/* CACHE DOM
================================================================================================= */

const $$linkItem = document.querySelector("#link-item-template")
const $mainList = document.querySelector("#m-list")
const $addLinkWidget = document.querySelector("#m-list__add-widget")
const $addLinkInput = document.querySelector(".m-list__add-widget__inner__input")
const $addLinkBtn = document.querySelector("#m-list__add-widget__inner__btn")
const $footBtn = document.querySelector("#f-bar__btn")
const $footNumLinks = document.querySelector("#num-links-text")
const $shortenedUrl = document.querySelector("#shortened-url")
const $tutorial = document.querySelector("#tutorial")
const $infoBtn = document.querySelector("#info-btn")
const $closeInfoBtn = document.querySelector("#close-info-btn")
const $infoModal = document.querySelector("#info-modal")

/* BINDINGS
================================================================================================= */

$infoBtn.addEventListener("click", () => $infoModal.hidden = false)
$closeInfoBtn.addEventListener("click", () => $infoModal.hidden = true)
$footBtn.addEventListener("click", e => handleFootBtn(e))
$addLinkWidget.addEventListener("keydown", e => handleAddLinkWidgetInput(e))
$addLinkBtn.addEventListener("click", e => handleAddLinkWidgetBtn(e, $addLinkInput))

/* GET ADDED URLs
================================================================================================= */

const getUrls = () => {
  let links = $mainList.querySelectorAll("a")
  let urls = []
  for (let l of links) urls[urls.length] = l.href
  return urls
}

/* ADD/REMOVE LINKS
================================================================================================= */

const addLink = (template, url, beforeThisEl) => {
  let newLinkItem = template.content
  newLinkItem.querySelector(".m-list__link-item").href = url
  newLinkItem.querySelector(".m-list__link-item__inner__text__content").textContent = url
  $mainList.insertBefore(document.importNode(template.content, true), beforeThisEl)
  let $linkBtns = document.querySelectorAll(".m-list__link-item__inner__btn")
  let $thisLinkBtn = $linkBtns[$linkBtns.length - 1]
  $thisLinkBtn.addEventListener("click", e => removeLink(e))
  removeClass($footBtn, "disabled")
  $footBtn.disabled = false
  if (document.body.className == "is-presenting") return false
  document.body.className = "is-editing"
  $footBtn.disabled = false
  removeClass($footBtn, "glow")
  if (document.querySelectorAll(".m-list__link-item").length == 0) {
    addClass($footBtn, "disabled")
    $footBtn.disabled = true
  }
}

const removeLink = e => {
  if (document.body.className == "is-presenting") return false
  let linkItem = e.target.parentElement.parentElement.parentElement
  e.preventDefault()
  linkItem.style.backgroundColor = "#f23"
  linkItem.style.color = "#fff"
  setTimeout(() => { linkItem.style.backgroundColor = "#fff" }, 150)
  setTimeout(() => { linkItem.parentElement.removeChild(linkItem) }, 300)
  removeClass($footBtn, "disabled")
  $footBtn.disabled = false
  if (document.body.className == "is-presenting") return false
  document.body.className = "is-editing"
  $footBtn.disabled = false
  removeClass($footBtn, "glow")
  if (document.querySelectorAll(".m-list__link-item").length-1 == 0) {
    addClass($footBtn, "disabled")
    $footBtn.disabled = true
  }
}

/* PRESENT LINKS
================================================================================================= */

let urlsFromParams = queryValue("urls")
let urlsArr = urlsFromParams
if (typeof urlsFromParams === "string") urlsArr = [urlsFromParams]
for (let u of urlsArr) {
  if (u != "") addLink($$linkItem, u, $addLinkWidget)
}
if (document.querySelectorAll(".m-list__link-item").length > 0) {
  $tutorial.style.display = "none"
}

/* ADD LINK WIDGET
================================================================================================= */

const handleAddLinkWidgetInput = e => {
  let k = e.keyCode
  if (k != 13) return false
  let $input = e.target
  let newURL = $input.value
  if (isUrl(newURL) && newURL != "") {
    addLink($$linkItem, newURL, $addLinkWidget)
    $input.value = ""
    $input.placeholder = "Add a URL to shorten..."
  } else {
    $input.placeholder = "Enter a valid URL (e.g. http://example.com)"
    $input.value = ""
    removeClass($input, "shake-me")
    setTimeout(() => addClass($input, "shake-me"), 0)
  }
  // so that the widget is not covered by the footer button
  if (windowScrollable()) window.scrollTo(0, document.body.scrollHeight)
}

const handleAddLinkWidgetBtn = (e, el) => {
  let $input = el
  let newURL = $input.value
  if (isUrl(newURL) && newURL != "") {
    addLink($$linkItem, newURL, $addLinkWidget)
    $input.value = ""
    $input.placeholder = "Add a URL to shorten..."
    $input.focus()
  } else {
    $input.placeholder = "Enter a valid URL (e.g. http://example.com)"
    $input.value = ""
    $input.focus()
    removeClass($input, "shake-me")
    setTimeout(() => addClass($input, "shake-me"), 0)
  }
  // so that the widget is not covered by the footer button
  if (windowScrollable()) window.scrollTo(0, document.body.scrollHeight)
}

/* FOOTER BUTTON
================================================================================================= */

const handleFootBtn = e => {
  let appState = document.body.className
  let shortUrl = ""

  // edit long urls
  if (appState == "is-presenting") {
    document.body.className = "is-editing"
    setTimeout(() => { $addLinkWidget.style.backgroundColor = "#fff" }, 0)
    $addLinkWidget.querySelector("input").focus()
    addClass($footBtn, "disabled")
    $footBtn.disabled = true
    $tutorial.style.display = "none"
    if (windowScrollable()) window.scrollTo(0, document.body.scrollHeight)

  // shorten long urls
  } else if (appState == "is-editing") {
    document.body.className = "is-shortening"
    addClass($footBtn, "glow")
    $footNumLinks.innerText = document.querySelectorAll(".m-list__link-item").length

    // get shortened URL from goo.gl
    requestShortUrl(window.location.hostname + encodeQuery({"urls" : getUrls()}),
      resp => {
        if (resp.status === 200)
          $shortenedUrl.innerText = JSON.parse(resp.responseText).id.substring(8)
        else
          $shortenedUrl.innerText = "Error! Try again later."
    })

    // reset btn text
    setTimeout(() => {
      document.querySelector("#shortened-url-pre").hidden = false
      document.querySelector("#shortened-url-post").hidden = true
    }, 0)

  // copy short url to clipboard
  } else if (appState == "is-shortening") {
    if ($shortenedUrl.innerText != "Error! Try again later.") {
      let urlToCopy = "https://" + $shortenedUrl.innerText
      $footBtn.dataset.clipboardText = urlToCopy
    }
  }
}
