// Initialize app
var myApp = new Framework7({
    imagesLazyLoadSequential: true
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


var isLogin;

var categories = {};

var login = function (submit, username, password) {
    //myApp.hideNavbar(".navbar");


    submit.click(function () {

        var username_value = username.val();
        var password_value = password.val();


        if (username_value == '' && password_value == '') {
            myApp.alert("Please provide your account credentials", "MindTV");


        } else {
            if (username_value == '') {
                myApp.alert("Please provide username", "MindTV");

            } else if (password_value == '') {
                myApp.alert("Password cannot be empy", "MindTV");

            } else {

                loginService.jsonResponse(username_value, password_value);


                // validate userfiled inputs.
            }
        }
    });
};


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var checkConn = function () {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    myApp.alert('Connection type: ' + states[networkState]);
};

var homepage_slick_slider = function () {
    $('.image-slider').attr('width', screen.width);
    $('.image-slider').css('display', 'block');

    if (mySettings.lockOrientation) {

    } else {
        window.addEventListener("orientationchange", function () {
            $('.image-slider').attr('width', screen.width);
            $('.image-slider').css('display', 'block');
        });
    }


    $('.homepage-slick-slider').slick({

        autoplay: true,
        autoplaySpeed: 5000,

        slidesToShow: 1
    });


};

var setMenuLogo = function () {
    console.log("Screen width: " + screen.width / 3);
    $('.img_menu_header').attr('width', screen.width / 3);

    if (mySettings.lockOrientation) {

    } else {
        window.addEventListener("orientationchange", function () {
            $('.img_menu_header').attr('width', screen.width / 3);

            //console.log(screen.orientation); // e.g. portrait
        });
    }

};

/*
 * input type: portrait | landscape*/


var lockOrientation = function (type) {
    if (mySettings.lockOrientation) {
        console.log("Orientation is set to " + type);
        //myApp.addNotification({ title: navigator.userAgent, message: "Orientation is set to " + type});
        screen.lockOrientation(type);

    }

};

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {

    lockOrientation('portrait');

});

myApp.onPageInit('index', function (page) {
    //checkConn();
    isLogin = Cookies.get('status') == 200;
    setMenuLogo();

    //homepage_slick_slider();

    mySettings.redirectToHomeifCookieIsdDeleted(isLogin);

}).trigger(); //And trigger it right aw

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    var getRequest = page.query;

    console.log(page.url);
    //unlockOrientation('portrait');

    if (page.url == 'index.html') {
        myApp.hideIndicator();
        setMenuLogo();
        mySettings.redirectToHomeifCookieIsdDeleted();

        homepage_slick_slider();
    }


    /*
     *  todo: LOGIN PAGE
     * */

    if (page.name == 'login') {
        //$$(".navbar").hide();
        myApp.hideIndicator();

        // checkConn();
        loginService.exec($('.submit'), $('#username'), $('#password'));
    }

    /*
     *  todo:  CHANNELS LIST NATIVE PLAYER PAGE
     * */

    if (page.name == 'channels-list-native-player') {

        channels_list_natvice_player.exec();

    }


    /*
     *  todo: DASHBOARD PAGE
     * */

    var categories_object = {};
    var count_categories_labels;

    if (page.url == 'dashboard.html') {
        console.log(page.url);
        myApp.closePanel();

        mySettings.redirectToHomeifCookieIsdDeleted();

        myApp.showIndicator();


        // http://cloudware.air5iptv.com/categories_channels.php?username=demo&password=c514c91e4ed341f263e458d44b3bb0a7
        // http://arabictvgui.middleware.tv/categories_channels.php?username=demo&password=c514c91e4ed341f263e458d44b3bb0a
        $$.getJSON(mySettings.BASE_URL +'/categories_channels.php?username=demo&password=c514c91e4ed341f263e458d44b3bb0a', function (data, success) {
            if (success == 200) {
                myApp.hideIndicator();
                console.log("success json response");


                var tv_categories = data.response.tv_categories.tv_category;
                var tv_channel = data.response.tv_channel; // array

                var count_tv_categories = tv_categories.length;
                var count_tv_channels = tv_channel.length;


                console.log("count : " + count_tv_categories);


                for (var c = 0; c < count_tv_categories; c++) {

                    categories_object = {
                        id: tv_categories[c].id,
                        caption: tv_categories[c].caption,
                        icon_url: tv_categories[c].icon_url
                    };


                    var id = categories_object.id;
                    var caption = categories_object.caption;
                    var icon_url = categories_object.icon_url;


                    var category_label_array = [];


                    for (var ch = 0; ch < count_tv_channels; ch++) {

                        // check if array exists..
                        var found = jQuery.inArray(caption, category_label_array);


                        if (tv_channel[ch].tv_categories[0].tv_category_id == id) {

                            var count_channels = [];

                            console.log("Adding " + caption + " with id :" + id);

                            if (found == -1) {
                                category_label_array.push(caption);
                                count_categories_labels = category_label_array.length;

                                var categories_label = '<div class="content-block-title">' + caption + '</div>';

                                $$('.categories_labels').append("<div class='_" + id + "_category_label'>" + categories_label + "</div><div class='_" + id + "_sliders'></div>");
                                mySettings.addSlick('._' + id + '_sliders');

                            }
                            // console.log("Adding: " + tv_channel[ch].icon_url);
                            $('._' + id + '_sliders').slick('slickAdd', '<div><h3><img src="' + tv_channel[ch].icon_url + '" class="movies-image-slider" style="width: 70px;"></h3></div>');
                        }

                    }

                }

            }
        });


    }

    /*
     *  todo: CONTACTS PAGE
     * */

    if (page.name == 'contacts') {
        myApp.closePanel();
        console.log(page.name + " page is loaded.");

        mySettings.redirectToHomeifCookieIsdDeleted();

        $$.getJSON('http://edate.mindtv.eu/libs/includes/api/android/android_contacts.php?user_id=688', function (data, success) {
            if (success == 200) {
                console.log("success json response");

                console.log("Type of: " + typeof(data));


                var numberOfElements = data.length;
                console.log("Number:" + numberOfElements);

                for (var i = 0; i < numberOfElements; i++) {
                    var customer_id = data[i].id;

                    var li_element = '<li class="swipeout"><a href="contact_details.html?id=' + customer_id + '" class="item-link"><div class="swipeout-content item-content"><div class="item-inner">' + data[i].fullname + '</div></div></a><div class="swipeout-actions-right"><a href="#" class="delete_customer_' + customer_id + ' bg-red">Delete</a></div></li>';
                    $$('.contacts').append(li_element);
                    //$$('.contacts').append('<li class="swipeout"><a href="contact_details.html?id='+data[i].id+'" class="item-link"><div class="item-content"><div class="item-inner"><div class="item-title">'+data[i].fullname+'</div></div></div></a></li>');

                    $$('.delete_customer_' + customer_id).on('click', function () {
                        var className = $$(this).attr('class');

                        var split = className.split("_");
                        var explode_spaces = split[2].split(" ");
                        var getCustomerId = explode_spaces[0];
                        myApp.alert('Delete customer with id ' + getCustomerId);
                    });


                }

            }
        });


    }

    /*
     *  todo: CHANNELS PAGE
     * */

    if (page.name == 'channels') {
        myApp.closePanel();

        mySettings.redirectToHomeifCookieIsdDeleted();

        console.log(page.name + " page is loaded.");
        myApp.showPreloader('Fetching channels');


        $$.getJSON(mySettings.BASE_URL +'/categories_channels.php?username=demo&password=c514c91e4ed341f263e458d44b3bb0a7', function (data, success) {
            if (success == 200) {
                myApp.hidePreloader();
                console.log("success json response");

                var categories_tag = data.response.tv_categories.tv_category;
                var channels_tag = data.response.tv_channel;

                var count_channels = channels_tag.length;
                var count_categories = categories_tag.length;

                for (var j = 0; j < count_channels; j++) {

                    var channel_object = {
                        id: channels_tag[j].id,
                        position: channels_tag[j].number,
                        caption: channels_tag[j].caption,
                        icon_url: channels_tag[j].icon_url,
                        streaming_url: channels_tag[j].streaming_url
                    };

                    var id = channel_object.id;
                    var caption = channel_object.caption;
                    var streaming_url = channel_object.streaming_url;
                    var icon_url = channel_object.icon_url;

                    var li_element = '<li class="swipeout"><a href="channel_details.html?id=' + id + '&vurl=' + streaming_url + '" class="item-link"><div class="swipeout-content item-content"><div class="item-inner">' + caption + '</div></div></a><div class="swipeout-actions-right"><a href="#" class="delete_channel_' + id + ' bg-red">Delete</a></div></li>';
                    $$('.channels').append(li_element);
                    //$$('.contacts').append('<li class="swipeout"><a href="contact_details.html?id='+data[i].id+'" class="item-link"><div class="item-content"><div class="item-inner"><div class="item-title">'+data[i].fullname+'</div></div></div></a></li>');


                    $$('.delete_channel' + id).on('click', function () {
                        var className = $$(this).attr('class');

                        var split = className.split("_");
                        var explode_spaces = split[2].split(" ");
                        var getId = explode_spaces[0];
                        myApp.alert('Delete channel with id ' + getId);
                    });


                }

            }
        });

        // initialize search function
        var mySearchbar = myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-inner'
        });


    }

    /*
     *  todo: CHANNEL DETAILS PAGE
     * */

    if (page.name == 'channel_details') {
        myApp.closePanel();
        mySettings.redirectToHomeifCookieIsdDeleted();

        // Play a video with callbacks
        var channel_id = getRequest.id;
        var vurl = getRequest.vurl;

        var conf = {
            key: "07add0cd-89b5-475c-ba1a-8206ff10001f",
            playback: {
                autoplay: true,
                muted: false
            },
            source: {
                hls: vurl
            },
            style: {
                width: '100%',
                aspectratio: '16:9',
                controls: true
            },
            cast: {
                enable: true
            }

        };

        var player = bitdash("player");
        player.destroy();


        player = bitdash("player");
        player.setup(conf).then(function (value) {
            // Success
            console.log("Successfully created bitdash player instance");
        }, function (reason) {
            // Error!
            console.log("Error while creating bitdash player instance");
        });


        player.play();


        // window.plugins.streamingMedia.playVideo(videoUrl, options);


    }

    /*
     *  todo: CHANNELS LIST FLOW PLAYER PAGE
     * */

    if (page.name == 'channels_flow_player') {
        myApp.closePanel();

        mySettings.redirectToHomeifCookieIsdDeleted();

        console.log(page.name + " page is loaded.");
        myApp.showPreloader('Fetching channels');


        $$.getJSON('http://cloudware.air5iptv.com/categories_channels.php?username=demo&password=c514c91e4ed341f263e458d44b3bb0a7', function (data, success) {
            if (success == 200) {
                myApp.hidePreloader();
                console.log("success json response");

                var flow_channels_tag = data.response.tv_channel;

                var count_flow_channels = flow_channels_tag.length;

                for (var j = 0; j < count_flow_channels; j++) {

                    var flow_channel_object = {
                        id: flow_channels_tag[j].id,
                        position: flow_channels_tag[j].number,
                        caption: flow_channels_tag[j].caption,
                        icon_url: flow_channels_tag[j].icon_url,
                        streaming_url: flow_channels_tag[j].streaming_url
                    };

                    var id = flow_channel_object.id;
                    var caption = flow_channel_object.caption;
                    var streaming_url = flow_channel_object.streaming_url;
                    var icon_url = flow_channel_object.icon_url;

                    var li_element =
                        '<li class="swipeout">' +
                        '<a href="channel-details-flow-player.html?flowid=' + id + '&flowurl=' + streaming_url + '" class="item-link">' +
                        '<div class="swipeout-content item-content" style="height: 80px;align-items: center">' +
                        '<div class="item-inner">' +
                        '<img src="' + icon_url + '" width="60px">'
                        + caption
                        + '</div>' +
                        '</div>' +
                        '</a>' +
                        '<div class="swipeout-actions-right">' +
                        '<a href="#" class="delete_channel_' + id + ' bg-red">' +
                        'Delete' +
                        '</a>' +
                        '</div>' +
                        '</li>';
                    $$('.channels_flow_player').append(li_element);
                    //$$('.contacts').append('<li class="swipeout"><a href="contact_details.html?id='+data[i].id+'" class="item-link"><div class="item-content"><div class="item-inner"><div class="item-title">'+data[i].fullname+'</div></div></div></a></li>');

                }

            }
        });

        // initialize search function
        var flowSearchbar = myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-inner'
        });

    }

    /*
     *  todo: CHANNEL DETAILS FLOW PLAYER
     * */

    if (page.name == 'channel-details-flow-player') {
        myApp.closePanel();
        mySettings.redirectToHomeifCookieIsdDeleted();

        // Play a video with callbacks
        var flowid = getRequest.flowid;
        var flowurl = getRequest.flowurl;

        flowplayer("#hlsjslive", {
            splash: true,
            embed: false,
            ratio: 9 / 16,

            clip: {
                hlsQualities: [
                    // dimensions of all levels are the same
                    // set bitrate labels explicitly instead
                    {level: 0, label: "400k"},
                    {level: 1, label: "700k"},
                    {level: 2, label: "1000k"}
                ],
                live: true,
                sources: [
                    {
                        type: "application/x-mpegurl",
                        src: "//nasatv-lh.akamaihd.net/i/NASA_101@319270/master.m3u8"
                    }
                ]
            }

        });


        // myApp.alert("flowid: " + flowurl);

        // $$( "#videoSource" ).attr( "src", flowurl );


    }

    /*
     *  todo: CONTACTS DETAILS PAGE
     * */

    if (page.name == 'contact_details') {
        myApp.closePanel();

        mySettings.redirectToHomeifCookieIsdDeleted();
        var contact_id = getRequest.id;
        console.log("Contact id: " + contact_id);
    }

    /*
     *  todo: CONTACTS DETAILS PAGE
     * */

    if (page.name == 'html5fullscreen') {
        myApp.closePanel();

        mySettings.redirectToHomeifCookieIsdDeleted();
        var videoUrl = getRequest.src;
        var bgvid = $('#bgvid');
        // bgvid.attr('src', videoUrl)

    }

    /*
     *  todo: ABOUT PAGE
     * */

    if (page.name === 'about') {
        myApp.closePanel();
        mySettings.redirectToHomeifCookieIsdDeleted();

        console.log("about page is loaded.");

        // Following code will be executed for page with data-page attribute equal to "about"
        //myApp.alert('Here comes About page');
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
})