'use strict'

var gCurrRoute
var gMenuOpen

async function onInit() {
    loadMemesFromStorage()
    loadImgsFromStorage()
    initKeywords()
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gCurrRoute = 'gallery'
    addListeners()
    renderGallery()
    renderStickers()
    renderMemes()
    renderKeywordList()
    renderKeywordSection()
    addEventListener('resize', () => {
        if (gCurrRoute === 'editor') {
            resizeCanvas()
            renderMeme()
        }
        if (gMenuOpen && window.innerWidth > 800) {
            onToggleMenu()
        }
    })
    handleLineInputState()
    onSetLang('en')
    gMenuOpen = false
}

function renderGallery() {
    loadImgsFromStorage()
    const imgs = getImgs()
    var strHtmls = `<div class="add-new-img">
                        <label for="upload-image">
                            <i class="fa-solid fa-upload"></i>
                        </label>
                        <input
                            onchange="onUploadImg(event)"
                                class="none"
                                type="file"
                                id="upload-image"
                                name="upload-image"
                                accept="image/*"
                            />
                    </div>`

    strHtmls += imgs
        .map((img) => {
            return `<img src="${img.url}" onclick="onImgSelect('${img.id}')">`
        })
        .join('')
    const elGallery = document.querySelector('.gallery-container > .imgs-list')
    elGallery.innerHTML = strHtmls
}

function renderStickers() {
    const stickers = getStickersSubArr()
    var strHtmls = stickers
        .map((sticker) => {
            return `<img src="${sticker}" onclick="onAddSticker(this)">`
        })
        .join('')
    const elStickers = document.querySelector('.stickers-list')
    elStickers.innerHTML = strHtmls
}

function renderMemes() {
    const memes = getMemes()
    var strHtmls = memes
        .map((meme) => {
            return `
            <div class="meme-container">
                <img src="${meme.memeImg}" />
                <div class="meme-modal">
                <button class="edit-meme" onclick="onEditMeme('${meme.memeObj.id}')">
                    Edit
                </button>
                <button class="delete-meme" onclick="onDeleteMeme('${meme.memeObj.id}')">Delete</button>
            </div>
        </div> `
        })
        .join('')
    const elGallery = document.querySelector('.memes-container > .imgs-list')
    elGallery.innerHTML = strHtmls
}

function renderKeywordList() {
    const keywordsList = getKeywordsList()
    var strHtmls = `<option data-trans="keyword-all" value="All"></option>`
    strHtmls += keywordsList
        .map((keyword) => {
            return `<option data-trans="keyword-${keyword}" value="${keyword}"></option>`
        })
        .join('')
    const elList = document.querySelector('#keywords-list')
    elList.innerHTML = strHtmls
}

function renderKeywordSection() {
    const keywordsMap = getKeywords()
    var strHtmls = `<a class="keyword keyword-All" data-trans="keyword-all" href="#" style="font-size: 28px" onclick="onChangeFilterGallery('All')">All</a>`
    strHtmls += keywordsMap
        .map((keyword) => {
            const fontSize =
                keyword.searches * 1 + 14 > 28 ? 28 : keyword.searches * 1 + 14
            return `<a class="keyword keyword-${keyword.content}" data-trans="keyword-${keyword.content}" href="#" style="font-size: ${fontSize}px" onclick="onChangeFilterGallery('${keyword.content}')">${keyword.content}</a>`
        })
        .join('')
    const elList = document.querySelector(
        '.gallery-container .gallery-keywords'
    )
    elList.innerHTML = strHtmls
}

function onImgSelect(imgIdx) {
    const img = findImgByIdx(imgIdx)
    setLineTxt(imgIdx)
    setSelectedImgId(img)
    setMemeId()
    openTab('editor')
    gCurrRoute = 'editor'
}

function onRoute(route) {
    toggleNavButtons(route)
    resetMeme()
    handleLineInputState()
    openTab(route)
    gCurrRoute = route
}

function onFlexible() {
    makeRandomMeme()
    openTab('editor')
    handleLineInputState()
    updateLineInputTxt()
    gCurrRoute = 'editor'
}

function onEditMeme(id) {
    loadMemesFromStorage()
    setCurrMemeById(id)
    handleLineInputState()
    updateLineInputTxt()
    openTab('editor')
    gCurrRoute = 'editor'
}

function onDeleteMeme(id) {
    loadMemesFromStorage()
    if (confirm('Are you sure you want to delete meme?')) {
        deleteMeme(id)
        renderMemes()
    }
}

function onChangeFilterGallery(keyword) {
    if (getFilterKeyword() === keyword) return
    setFilterKeyword(keyword)
    renderKeywordSection()
    renderFilterGalleryChanges()
    renderGallery()
}

function renderFilterGalleryChanges() {
    const elKeywords = document.querySelectorAll('.keyword')
    const elKeywordsArr = Array.from(elKeywords)
    elKeywordsArr.forEach((elKeyword) => {
        elKeyword.classList.remove('selected-keyword')
    })
    const elSelectedKeyword = document.querySelector(
        `.keyword-${getFilterKeyword()}`
    )
    if (!elSelectedKeyword) return
    elSelectedKeyword.classList.add('selected-keyword')
}

function onUploadImg(ev) {
    var reader = new FileReader()
    reader.onload = (event) => {
        var img = new Image()
        img.src = event.target.result
        prepUploadedImg(img.src)
        renderGallery()
    }
    reader.readAsDataURL(ev.target.files[0])
}

function hideSections() {
    document.querySelector('.gallery-container').classList.add('none')
    document.querySelector('.editor-container').classList.add('none')
    document.querySelector('.memes-container').classList.add('none')
    document.querySelector('.about-container').classList.add('none')
}

function onToggleMenu() {
    gMenuOpen = !gMenuOpen
    document.body.classList.toggle('menu-open')
    const elmains = document.querySelectorAll('main')
    for (let elmain of elmains) {
        elmain.classList.toggle('blur')
    }
    const elbtn = document.querySelector('.btn-toggle-menu')
    if (gMenuOpen) {
        elbtn.innerHTML = '<i class="fa-solid fa-x"></i>'
    } else {
        elbtn.innerHTML = '<i class="fa-solid fa-bars">'
    }
}

function openTab(route) {
    if (route === gCurrRoute) return
    if (gMenuOpen) {
        onToggleMenu()
    }
    document
        .querySelector(`.${gCurrRoute}-container`)
        .classList.add('hide-right')
    document
        .querySelector(`.${gCurrRoute}-container`)
        .classList.remove('show-right')
    document.querySelector(`.${route}-container`).classList.add('show-right')
    document.querySelector(`.${route}-container`).classList.remove('hide-right')
    setTimeout(async () => {
        document
            .querySelector(`.${gCurrRoute}-container`)
            .classList.remove('hide-right')
        hideSections()
        document.querySelector(`.${route}-container`).classList.remove('none')
        if (route === 'editor') {
            renderMeme()
            document
                .querySelector('.main-menu .btn-gallery')
                .parentElement.classList.remove('active')
            document
                .querySelector('.main-menu .btn-memes')
                .parentElement.classList.remove('active')
        }
        await clearAnimation(route)
    }, 700)
}

function clearAnimation(route) {
    return new Promise(() => {
        setTimeout(() => {
            document
                .querySelector(`.${route}-container`)
                .classList.remove('show-right')
            if (window.innerWidth > window.outerWidth)
                document.body.style.zoom = 0.8
            else document.body.style.zoom = 1
        }, 700)
    })
}

function toggleNavButtons(route) {
    document
        .querySelector('.main-menu .btn-gallery')
        .parentElement.classList.remove('active')
    document
        .querySelector('.main-menu .btn-memes')
        .parentElement.classList.remove('active')
    document
        .querySelector('.main-menu .btn-about')
        .parentElement.classList.remove('active')
    document
        .querySelector(`.main-menu .btn-${route}`)
        .parentElement.classList.add('active')
}

function addListeners() {
    gElCanvas.addEventListener('mousemove', onDrag)
    gElCanvas.addEventListener('mousedown', onPress)
    gElCanvas.addEventListener('mouseup', onRelease)
    gElCanvas.addEventListener('touchmove', onDrag)
    gElCanvas.addEventListener('touchstart', onPress)
    gElCanvas.addEventListener('touchend', onRelease)
}

function onSetLang(lang) {
    setLang(lang)
    const elEngLable = document.querySelector('.lang-en')
    const elHebLable = document.querySelector('.lang-he')
    if (lang === 'he') {
        document.body.style.fontFamily = 'rubik'
        document.body.style.direction = 'rtl'
        elEngLable.classList.remove('lang-active')
        elHebLable.classList.add('lang-active')
        elEngLable.classList.remove('animate-charcter')
        elHebLable.classList.add('animate-charcter')
    } else {
        document.body.style.fontFamily = 'poppins'
        document.body.style.direction = 'ltr'
        elEngLable.classList.add('lang-active')
        elHebLable.classList.remove('lang-active')
        elEngLable.classList.add('animate-charcter')
        elHebLable.classList.remove('animate-charcter')
    }
    renderKeywordList()
    renderKeywordSection()
    renderFilterGalleryChanges()
    doTrans()
}
