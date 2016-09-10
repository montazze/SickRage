$(document).ready(function () {

    $('#trendingShows').loadRemoteShows(
        '/addShows/getTrendingShows/?traktList=' + $('#traktList').val(),
        'Loading trending shows...',
        'Trakt timed out, refresh page to try again'
    );

    $('#traktlistselection').on('change', function (e) {
        var traktList = e.target.value;
        window.history.replaceState({}, document.title, '?traktList=' + traktList);
        $('#trendingShows').loadRemoteShows(
            '/addShows/getTrendingShows/?traktList=' + traktList,
            'Loading trending shows...',
            'Trakt timed out, refresh page to try again'
        );
    });

    // initialise combos for dirty page refreshes
    $('#showsort').val('original');
    $('#showsortdirection').val('asc');

    var $container = [$('#container')];
    $.each($container, function () {
        this.isotope({
            itemSelector: '.trakt_show',
            sortBy: 'original-order',
            layoutMode: 'fitRows',
            getSortData: {
                name: function(itemElem) {
                    var name = $(itemElem).attr('data-name') || '';
                    return (metaToBool('sickbeard.SORT_ARTICLE') ? name : name.replace(/^(The|A|An)\s/i, '')).toLowerCase();
                },
                rating: '[data-rating] parseInt',
                votes: '[data-votes] parseInt'
            }
        });
    });

    $('#showsort').on('change', function() {
        var sortCriteria;
        switch (this.value) {
            case 'original':
                sortCriteria = 'original-order';
                break;
            case 'rating':
                /* randomise, else the rating_votes can already
                 * have sorted leaving this with nothing to do.
                 */
                $('#container').isotope({ sortBy: 'random' });
                sortCriteria = 'rating';
                break;
            case 'rating_votes':
                sortCriteria = ['rating', 'votes'];
                break;
            case 'votes':
                sortCriteria = 'votes';
                break;
            default:
                sortCriteria = 'name';
                break;
        }
        $('#container').isotope({ sortBy: sortCriteria });
    });

    $('#showsortdirection').on('change', function() {
        $('#container').isotope({
            sortAscending: ('asc' === this.value)
        });
    });

});