'use strict'

function renderGallery() {
    const imgs = getImgs()
    var strHtmls = imgs
        .map((img) => {
            return `<img src="${img.url}" onclick="onImgSelect(${img.id})">`
        })
        .join('')

    const elGallery = document.querySelector('.imgs-list')
    elGallery.innerHTML = strHtmls
}

function onImgSelect(imgIdx) {
    const img = findImgByIdx(imgIdx)
    setSelectedImgId(img)
    routeToEditor()
    renderMeme()
}

function onRoute(route) {
    toggleNavButtons(route)
    hideSections()
    openTab(route)
}

function routeToEditor() {
    document.querySelector('.gallery-container').classList.add('none')
    document.querySelector('.editor-container').classList.remove('none')
    document
        .querySelector('.main-menu .btn-gallery')
        .parentElement.classList.remove('active')
    toggleNavButtons(null)
}

function hideSections() {
    document.querySelector('.gallery-container').classList.add('none')
    document.querySelector('.editor-container').classList.add('none')
}

function openTab(route) {
    document.querySelector(`.${route}-container`).classList.remove('none')
}

function toggleNavButtons(route) {
    if (!route) return
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
