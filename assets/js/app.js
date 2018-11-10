const $search = $('.search input');
const $results = $('.search-results');

let timeout = null,
    resetSearch = true,
    searchString = '',
    searchPage = 1,
    searchIndexes = [
        'item', 'recipe', 'achievement', 'action', 'quest',
        'bnpcname', 'enpcresident', 'companion',
        'mount', 'fate', 'leve', 'instancecontent', 'emote'
    ],
    canLoadMoreResults = false,
    resultsPage = 1;

// on searching
$search.on('keyup', event => {
    let string = $(event.target).val().trim();

    // if same, do nothing
    if (searchString === string && searchPage === resultsPage) {
        return;
    }

    if (searchString !== string) {
        searchString = string;
        resetSearch  = true;
        searchPage   = 1;
    }

    if (string.length < 1) {
        // hide results
        $results.removeClass('on');
        return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        $('.search-progress').addClass('loading');

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
                $('.search-progress').addClass('finished');

                const results = response.Results;
                canLoadMoreResults = (response.Pagination.PageNext !== null);
                resultsPage = searchPage;

                // reset if page 1
                if (response.Pagination.Page === 1 || resetSearch) {
                    $results.find('.results').html('');
                }

                $results.find('.results').append(`<div class="results-page">PAGE ${response.Pagination.Page}</div>`);

                for (let i in results) {
                    let res = results[i];

                    $results.find('.results').append(`
                        <a href="/content${res.Url}">
                            <div>
                                <img src="https://xivapi.com/${res.Icon}">
                                <img src="https://xivapi.com/${res.Icon}">
                            </div>
                            <div>
                                <h3>${res.Name}</h3>
                                <small>${res._}</small>
                            </div>
                             
                        </a>
                    `);
                }

                // show results
                $results.addClass('on');

                // if we can load more results, show button, incase browser detection is poop
                if (canLoadMoreResults) {
                    $('.canLoadMoreResults').addClass('on');
                }

                setTimeout(() => {
                    $('.search-progress').removeClass('loading finished');
                }, 1000);
            },
            error: (a,b,c) => {
                console.error(a,b,c);
            }
        })
    }, 500);
});

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
