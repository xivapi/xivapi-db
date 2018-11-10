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
var $results = $('.search-results');

var timeout = null,
    resetSearch = true,
    searchString = '',
    searchPage = 1,
    searchIndexes = ['item', 'recipe', 'achievement', 'action', 'quest', 'bnpcname', 'enpcresident', 'companion', 'mount', 'fate', 'leve', 'instancecontent', 'emote'],
    canLoadMoreResults = false,
    resultsPage = 1;

// on searching
$search.on('keyup', function (event) {
    var string = $(event.target).val().trim();

    // if same, do nothing
    if (searchString === string && searchPage === resultsPage) {
        return;
    }

    if (searchString !== string) {
        searchString = string;
        resetSearch = true;
        searchPage = 1;
    }

    if (string.length < 1) {
        // hide results
        $results.removeClass('on');
        return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(function () {
        $('.search-progress').addClass('loading');

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
                $('.search-progress').addClass('finished');

                var results = response.Results;
                canLoadMoreResults = response.Pagination.PageNext !== null;
                resultsPage = searchPage;

                // reset if page 1
                if (response.Pagination.Page === 1 || resetSearch) {
                    $results.find('.results').html('');
                }

                $results.find('.results').append('<div class="results-page">PAGE ' + response.Pagination.Page + '</div>');

                for (var i in results) {
                    var res = results[i];

                    $results.find('.results').append('\n                        <a href="/content' + res.Url + '">\n                            <div>\n                                <img src="https://xivapi.com/' + res.Icon + '">\n                                <img src="https://xivapi.com/' + res.Icon + '">\n                            </div>\n                            <div>\n                                <h3>' + res.Name + '</h3>\n                                <small>' + res._ + '</small>\n                            </div>\n                             \n                        </a>\n                    ');
                }

                // show results
                $results.addClass('on');

                // if we can load more results, show button, incase browser detection is poop
                if (canLoadMoreResults) {
                    $('.canLoadMoreResults').addClass('on');
                }

                setTimeout(function () {
                    $('.search-progress').removeClass('loading finished');
                }, 1000);
            },
            error: function error(a, b, c) {
                console.error(a, b, c);
            }
        });
    }, 500);
});

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