var xiv =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/ui/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var $search = $('.search input');
var $results = $('.results');
var $main = $('main');

var timeout = null,
    resetSearch = true,
    searchString = '',
    searchPage = 1,
    searchIndexes = ['item', 'recipe', 'achievement', 'action', 'quest', 'bnpcname', 'enpcresident', 'companion', 'mount', 'fate', 'leve', 'instancecontent', 'emote'],
    canLoadMoreResults = false;

// on searching
$search.on('keyup', function (event) {
    var string = $(event.target).val().trim();

    if (searchString !== string) {
        searchString = string;
        resetSearch = true;
        searchPage = 1;
    }

    clearTimeout(timeout);
    timeout = setTimeout(function () {
        $.ajax({
            url: 'https://xivapi.com/search',
            data: {
                string: string,
                limit: 100,
                page: searchPage,
                indexes: searchIndexes.join(','),
                key: 'c859af13b62e465baa340a91'
            },
            success: function success(response) {
                var results = response.Results;
                canLoadMoreResults = response.Pagination.PageNext !== null;

                // reset if page 1
                if (response.Pagination.Page === 1 || resetSearch) {
                    $results.html('');
                }

                $results.append('<div class="results-page">PAGE ' + response.Pagination.Page + '</div>');

                for (var i in results) {
                    var res = results[i];

                    $results.append('\n                        <button id="LoadPage" class="res-' + res.GameType + '" data-id="' + res._ + ',' + res.ID + '">\n                            <div>\n                                <img src="https://xivapi.com/' + res.Icon + '">\n                                <img src="https://xivapi.com/' + res.Icon + '">\n                            </div>\n                            <div>\n                                <h3>' + res.Name + '</h3>\n                                <small>' + res._ + '</small>\n                            </div>\n                             \n                        </button>\n                    ');
                }

                // if we can load more results, show button, incase browser detection is poop
                if (canLoadMoreResults) {
                    $('.canLoadMoreResults').addClass('on');
                }
            },
            error: function error(a, b, c) {
                console.error(a, b, c);
            }
        });
    }, 150);
});

// on clicking a thing
$('html').on('click', '.results button', function (event) {
    var info = $(event.currentTarget).attr('data-id').split(',');
    $results.html('');

    switch (info[0]) {
        default:
            load404(info[0]);
            break;

        case 'item':
            query('https://xivapi.com/Item/' + info[1], loadItem);
            break;
    }
});

function query(url, callback) {
    $.ajax({
        url: url,
        success: callback,
        error: function error(a, b, c) {
            console.error(a, b, c);
        }
    });
}

// Page stuff
function load404(type) {
    $main.html(type + ' - idk what this is!');
}

function loadItem(item) {
    $main.html('');

    // top
    $main.append('\n        <div class="page-top">\n            <span>Patch ' + item.GamePatch.Version + '</span>\n            <div class="page-top-frame">\n                <img src="http://xivapi.com/' + item.Icon + '">\n                <div>\n                    <h2>' + item.Name + '</h2>\n                    <div>\n                        ' + item.ItemKind.Name + ' - ' + item.ItemUICategory.Name + '\n                    </div>\n                </div>\n            </div>\n            \n        </div>\n    ');
}

setTimeout(function () {
    query('https://xivapi.com/Item/1675', loadItem);
}, 500);

// Auto load results on scroll
$(window).on('scroll', function (event) {
    if (!canLoadMoreResults) {
        return;
    }

    var $button = $('.more > button');
    var top_of_element = $button.offset().top;
    var bottom_of_element = $button.offset().top + $button.outerHeight();
    var bottom_of_screen = $(window).scrollTop() + window.innerHeight;
    var top_of_screen = $(window).scrollTop();

    if (bottom_of_screen > top_of_element && top_of_screen < bottom_of_element) {
        searchPage++;
        canLoadMoreResults = false;
        resetSearch = false;
        $('.canLoadMoreResults').removeClass('on');
        $search.trigger('keyup');
    }
});

/***/ })

/******/ })["default"];