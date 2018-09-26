const $search = $('.search input');
const $results = $('.results');
const $main = $('main');

let timeout = null,
    resetSearch = true,
    searchString = '',
    searchPage = 1,
    searchIndexes = [
        'item', 'recipe', 'achievement', 'action', 'quest',
        'bnpcname', 'enpcresident', 'companion',
        'mount', 'fate', 'leve', 'instancecontent', 'emote'
    ],
    canLoadMoreResults = false;

// on searching
$search.on('keyup', event => {
    let string = $(event.target).val().trim();

    if (searchString !== string) {
        searchString = string;
        resetSearch  = true;
        searchPage   = 1;
    }

    clearTimeout(timeout);
    timeout = setTimeout(function() {
        $.ajax({
            url: 'https://xivapi.com/search',
            data: {
                string:     string,
                limit:      100,
                page:       searchPage,
                indexes:    searchIndexes.join(','),
                key:        'c859af13b62e465baa340a91'
            },
            success: response => {
                const results = response.Results;
                canLoadMoreResults = (response.Pagination.PageNext !== null);

                // reset if page 1
                if (response.Pagination.Page === 1 || resetSearch) {
                    $results.html('');
                }

                $results.append(`<div class="results-page">PAGE ${response.Pagination.Page}</div>`);

                for (let i in results) {
                    let res = results[i];

                    $results.append(`
                        <button id="LoadPage" class="res-${res.GameType}" data-id="${res._},${res.ID}">
                            <div>
                                <img src="https://xivapi.com/${res.Icon}">
                                <img src="https://xivapi.com/${res.Icon}">
                            </div>
                            <div>
                                <h3>${res.Name}</h3>
                                <small>${res._}</small>
                            </div>
                             
                        </button>
                    `);
                }

                // if we can load more results, show button, incase browser detection is poop
                if (canLoadMoreResults) {
                    $('.canLoadMoreResults').addClass('on');
                }
            },
            error: (a,b,c) => {
                console.error(a,b,c);
            }
        })
    }, 150);
});

// on clicking a thing
$('html').on('click', '.results button', event => {
    let info = $(event.currentTarget).attr('data-id').split(',');
    $results.html('');

    switch (info[0]) {
        default:
            load404(info[0]);
            break;
            
        case 'item':
            query(`https://xivapi.com/Item/${info[1]}`, loadItem);
            break;
    }
});

function query(url, callback) {
    $.ajax({
        url: url,
        success: callback,
        error: (a,b,c) => {
            console.error(a,b,c);
        }
    });
}

// Page stuff
function load404(type) {
    $main.html(`${type} - idk what this is!`);
}

function loadItem(item) {
    $main.html('');

    // top
    $main.append(`
        <div class="page-top">
            <span>Patch ${item.GamePatch.Version}</span>
            <div class="page-top-frame">
                <img src="http://xivapi.com/${item.Icon}">
                <div>
                    <h2>${item.Name}</h2>
                    <div>
                        ${item.ItemKind.Name} - ${item.ItemUICategory.Name}
                    </div>
                </div>
            </div>
            
        </div>
    `);
}

setTimeout(() => {
    query('https://xivapi.com/Item/1675', loadItem);
}, 500);

// Auto load results on scroll
$(window).on('scroll', event => {
    if (!canLoadMoreResults) {
        return;
    }

    const $button           = $('.more > button');
    const top_of_element    = $button.offset().top;
    const bottom_of_element = $button.offset().top + $button.outerHeight();
    const bottom_of_screen  = $(window).scrollTop() + window.innerHeight;
    const top_of_screen     = $(window).scrollTop();

    if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)) {
        searchPage++;
        canLoadMoreResults = false;
        resetSearch = false;
        $('.canLoadMoreResults').removeClass('on');
        $search.trigger('keyup');
    }
});
