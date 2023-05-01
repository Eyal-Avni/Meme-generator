var gTrans = {
    logo: {
        en: 'Meme generator',
        he: 'מחולל מימים',
    },
    'nav-gallery': {
        en: 'Gallery',
        he: 'גלריה',
    },
    'nav-memes': {
        en: 'Memes',
        he: 'מימים',
    },
    'nav-about': {
        en: 'About',
        he: 'אודות',
    },
    'nav-lang-he': {
        en: '/ HE',
        he: 'עברית',
    },
    'nav-lang-en': {
        en: 'EN',
        he: 'אנגלית /',
    },
    'search-placeholder': {
        en: 'Search',
        he: 'חפש',
    },

    'im-flexible': {
        en: "I'm flexible",
        he: 'גמיש',
    },
    'about-msg': {
        en: "Didn't have enough time for about page..",
        he: 'אין מספיק זמן לדף אודות...',
    },
    'footer-copyrights': {
        en: `\u00A9 Eyal Avni`,
        he: `איל אבני \u00A9`,
    },
    'add-new-line': {
        en: `Please add new line`,
        he: `הכנס שורה חדשה`,
    },

    'keyword-all': {
        en: 'All',
        he: 'הכל',
    },
    'keyword-politics': {
        en: 'politics',
        he: 'פוליטיקה',
    },
    'keyword-animals': {
        en: 'animals',
        he: 'חיות',
    },
    'keyword-kids': {
        en: 'kids',
        he: 'ילדים',
    },
    'keyword-tv': {
        en: 'tv',
        he: 'טלוויזיה',
    },
    'keyword-movies': {
        en: 'movies',
        he: 'קולנוע',
    },
    'keyword-sport': {
        en: 'sport',
        he: 'ספורט',
    },
}

var gCurrLang = 'en'

function getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    let transTxt = transMap[gCurrLang]
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach((el) => {
        const transKey = el.dataset.trans
        const transTxt = getTrans(transKey)
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function getLang() {
    return gCurrLang
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatDate(time) {
    var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }

    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

// Kilometers to Miles
function kmToMiles(km) {
    return km / 1.609
}

// Kilograms to Pounds:
function kgToLbs(kg) {
    return kg * 2.20462262185
}

function UsdToIls(usd) {
    return usd * 3.65
}

function getPastRelativeFrom(ts) {
    const diff = Date.now() - new Date(ts)
    const seconds = diff / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    const formatter = new Intl.RelativeTimeFormat('en-US', {
        numeric: 'auto',
    })
    if (seconds <= 60) return formatter.format(-seconds, 'seconds')
    if (minutes <= 60) return formatter.format(-minutes, 'minutes')
    if (hours <= 24) return formatter.format(-hours, 'hours')
    return formatter.format(-days, 'days')
}

function formatCurrency(num) {
    if (gCurrLang === 'en') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(num)
    }
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
    }).format(UsdToIls(num))
}

function formatNumSimple(num) {
    return num.toLocaleString(gCurrLang)
}
