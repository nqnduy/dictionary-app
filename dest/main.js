/////////////////////////// SCROLL ///////////////////////////////
$(document).ready(function () {
    let header = $('.header'),
        btnMenu = $('.header__btnmenu'),
        screen = {
            mobile: 767,
            tablet: 991,
            desktop: 1199
        };

    // DETECT DEVICE
    function mobileDetect() {
        let md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() != null || md.tablet() != null) {
            mobile = true
            tablet = true
        } else {
            mobile = false
            tablet = false
        }
    }
    mobileDetect();


    // WINDOW SCROLLING
    $(window).on('scroll', function () {

    })


    // INIT
    function init() {
        $('body').imagesLoaded()
            .progress({ background: true }, function (instance, image) { })
            .always(function (instance) {
                $('.loading').addClass('--hide')
            })
            .fail(function () {
                // console.log('all images loaded, at least one is broken');
            })
            .done(function (instance) {
                // console.log('all images successfully loaded');
            });
    }
    init();

})

const main = document.querySelector(".main");
const searchInput = main.querySelector("input");
const infoText = main.querySelector(".info-text");
const synonymsList = main.querySelector(".synonyms-list");
const volumeIcon = main.querySelector(".word i");
const removeIcon = main.querySelector(".search span");

let audio;

function data(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }
    else {
        main.classList.add("active");
        console.log("result:", result)
        let definitions = result[0].meanings[0].definitions[0];
        let synonyms = result[0].meanings[0].synonyms;

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".meaning span").innerText = definitions.definition;
        // document.querySelector(".example span").innerText = definitions.example;

        //TODO: Check PHONETIC-TEXT data
        let phoneticText;
        for (let val of result[0].phonetics) {
            if (val.text) {
                phoneticText = val.text;
                break;
            }
            phoneticText = "";
        }
        let phonetics = `${result[0].meanings[0].partOfSpeech} ${phoneticText}`;
        document.querySelector(".word span").innerText = phonetics;


        //TODO: Check PHONETIC-AUDIO data
        for (let val of result[0].phonetics) {
            if (val.audio) {
                audio = new Audio(val.audio);
                break;
            }
            audio = undefined;
        }
        checkData(audio, volumeIcon, () => {});


        //TODO: Check EXAMPLE data
        let checkExistence = false;
        for (let meaning of result[0].meanings) {
            for (let definition of meaning.definitions) {
                if (definition.example) {
                    let exampleList = `<div>${definition.example.charAt(0).toUpperCase() + definition.example.slice(1)}</div>`;
                    document.querySelector(".example span").insertAdjacentHTML("beforeend", exampleList);
                    checkExistence = true;
                }
            }
        }
        if (!checkExistence) {
            document.querySelector(".example").style.display = "none";
        }

        //TODO: Check SYNONYMS data
        checkData(synonyms, synonymsList.parentElement.parentElement, () => {
            synonymsList.innerHTML = "";
            for (let i = 0; i < synonyms.length; i++) {
                let tag = `<span onclick=search('${synonyms[i]}')>${synonyms[i]}, </span>`;
                synonymsList.insertAdjacentHTML("beforeend", tag);
            }
        });
    }
}

function search(word) {
    searchInput.value = word;
    fetchAPI(word);
}

// EXPLAIN: Check the existence of data
function checkData(data, element = "", fn) {
    if (data == undefined || data.length === 0) {
        element.style.display = "none";
    }
    else {
        element.style.display = "block";
        fn();
    }
}

function fetchAPI(word) {
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;

    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => data(result, word));
}

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value) {
        fetchAPI(e.target.value);
    }
});

volumeIcon.addEventListener("click", () => {
    audio.play();
});
removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    main.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML = "Type a word and press enter to get meaning, example, pronunciation, and synonyms of that typed word.";
})
