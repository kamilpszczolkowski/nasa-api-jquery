$(function () {
    var apodUrl = 'https://api.nasa.gov/planetary/apod?api_key=bmLsei2dw3uMrFnPFDG4iKgG6U5TnwNwOGG4qVpE';
    var galleryUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=';
    var galleryUrl2 = '&api_key=bmLsei2dw3uMrFnPFDG4iKgG6U5TnwNwOGG4qVpE';
    var sectionOne = $('.section_1');
    var ul = $('.gallery');
    var loadBttn = $('#load');
    var day = 1;
    var picIndex = 0;
    var firstPicLoaded = false;
    var nextBttn = $("#next");
    var prevBttn = $('#previous');
    var scrollInterval = 0;
    var bubbleDiv = $('#circles');
    var createdImageIndex = 0;


    function getbackground() {
        $.ajax({
            url: apodUrl
        }).done(function (response) {

            $('<img/>').attr('src', response.hdurl).on('load', function () {
                $(this).remove(); // prevent memory leaks as @benweet suggested
                sectionOne.css("background-image", "url('" + response.hdurl + "')");
                sectionOne.css("background-position", "center");
                sectionOne.css("background-size", "cover");
                sectionOne.animate({
                    opacity: 1
                }, 2500);
                scrollInterval = setTimeout(function () {
                    pageScroll()
                }, 5000);
                $(window).on("scroll", function () {
                    clearTimeout(scrollInterval);
                });
            });
        });
    }

    function pageScroll() {
        window.scrollBy(0, 1);
        $('body,html').animate({scrollTop: jQuery(window).height()}, 1500);
    }

    function getPhotosForGallery(date) {
        $.ajax({
            url: galleryUrl + date + galleryUrl2
        }).done(function (response) {
            createNewPic(response.photos);
        });
    }

    function createNewPic(picture) {
        var urlPic = picture[0].img_src;
        var newLI = $('<li>');
        newLI.css("background-image", "url('" + urlPic + "')");
        ul.append(newLI);

        //create bubble
        var bubble = $('<div class="circle"></div>');
        bubble.attr("data-picId", createdImageIndex++);
        bubbleDiv.append(bubble);

        //DIsplay first pic and make first bubble lightblue
        if (firstPicLoaded == false) {
            ul.children().first().fadeIn(1500);
            firstPicLoaded = true;
            bubbleDiv.children().first().css("backgroundColor", "lightblue");
        }

        if(createdImageIndex == 6){
            loadBttn.fadeIn(1500);
        }
    }

    getbackground();
    for (day; day < 7; day++) {
        var newDate = "2015-11-" + day;
        getPhotosForGallery(newDate);
    }

    loadBttn.on('click', function () {
        var toDay = day + 6;
        for (day; day < toDay; day++) {
            var newDate = "2016-5-" + day;
            getPhotosForGallery(newDate);
        }

        if (day > 17){
            loadBttn.css("display","none");
        }
    });

    nextBttn.on('click', function () {
        ul.children().hide();
        picIndex++;
        if (picIndex > ul.children().length - 1) {
            picIndex = 0;
        }
        ul.children().eq(picIndex).fadeIn(1500);
        bubbleDiv.children().css("backgroundColor", "darkblue");
        bubbleDiv.children().eq(picIndex).css("backgroundColor", "lightblue");

    });

    prevBttn.on('click', function () {
        ul.children().hide();
        picIndex--;
        if (picIndex < 0) {
            picIndex = ul.children().length - 1;
        }
        ul.children().eq(picIndex).fadeIn(1500);
        bubbleDiv.children().css("backgroundColor", "darkblue");
        bubbleDiv.children().eq(picIndex).css("backgroundColor", "lightblue");
    });

    bubbleDiv.on('click', '.circle', function(){
        picIndex = parseInt($(this).attr("data-picId"));
        ul.children().hide();
        ul.children().eq(picIndex).fadeIn(1500);
        bubbleDiv.children().css("backgroundColor", "darkblue");
        $(this).css("backgroundColor", "lightblue");
    });
});