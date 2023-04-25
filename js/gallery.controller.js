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
    renderMeme()
}
