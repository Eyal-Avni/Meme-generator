'use strict'

var gCurrRoute
var gMenuOpen

async function onInit() {
    loadMemesFromStorage()
    loadImgsFromStorage()
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gCurrRoute = 'gallery'
    addListeners()
    renderGallery()
    renderStickers()
    renderMemes()
    renderKeywordList()
    addEventListener('resize', () => {
        resizeCanvas()
        if (gCurrRoute === 'editor') {
            renderMeme()
        }
        if (gMenuOpen && window.innerWidth > 800) {
            onToggleMenu()
        }
    })
    handleLineInputState()
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
            return `<img src="${meme.memeImg}" onclick="onEditMeme('${meme.memeObj.id}')">`
        })
        .join('')
    const elGallery = document.querySelector('.memes-container > .imgs-list')
    elGallery.innerHTML = strHtmls
}

function renderKeywordList() {
    const keywordsList = getKeywordsList()
    var strHtmls = keywordsList
        .map((keyword) => {
            return `<option value="${keyword}"></option>`
        })
        .join('')
    const elList = document.querySelector('#keywords-list')
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

function onChangeFilterGallery(keyword) {
    setFilterKeyword(keyword)
    renderGallery()
}

function onSubmitFilterGallery(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('form .gallery-search')
    setFilterKeyword(elInput.value)
    renderGallery()
    elInput.value = ''
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
        // document.querySelector('.main-nav').classList.remove('none')
    } else {
        elbtn.innerHTML = '<i class="fa-solid fa-bars">'
        // document.querySelector('.main-nav').classList.add('none')
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
