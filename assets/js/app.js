const $search = $('.search input');

let timeout = null;
$search.on('keyup', function (event) {
    let string = $(event.target).val().trim();

    clearTimeout(timeout);
    timeout = setTimeout(function() {
        $.ajax({
            url: 'https://xivapi.com/search',
            data: {
                string: string,
                limit: 8
            },
            success: function (response) {
                const results = response.Results;
                const $auto = $('.auto');

                $auto.html('');
                for (let i in results) {
                    let res = results[i];
                    $auto.append('<div>' + res.Name + ' <small>'+ res._ +'</small></div>');
                }
            },
            error: function (a,b,c) {
                console.error(a,b,c);
            }
        })
    }, 150);
});
