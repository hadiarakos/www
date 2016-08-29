var channels_list_natvice_player  = {

    _preview_id: $('.channels_preview'),
    _notfound_text_id: $('.searchbar-not-found'),

    exec: function() {
        myApp.closePanel();

        channels_preview = $('.channels_preview');
        _notfound_text_id =  $('.searchbar-not-found');

        mySettings.redirectToHomeifCookieIsdDeleted();

        myApp.showPreloader('Fetching channels');
        this._preview_id.attr('width', screen.width);
        this._preview_id.attr('height', screen.height / 4.5);
        this._notfound_text_id.css('margin-top', screen.height / 4.5);


        // $$('.list-block-for-channel-list').css('margin-top', screen.height / 4);


        $$.getJSON(mySettings.BASE_URL +'/categories_channels.php?username=hunter&password=5cd7312e6a69b42886cc1804dd257f7f', function (data, success) {
            if (success == 200) {
                myApp.hidePreloader();
                console.log("success json response");


                var channels_tag_native = data.response.tv_channel;

                var count_channels_native = channels_tag_native.length;

                console.log("count_channels_native: " + count_channels_native);

                for (var i = 0; i < count_channels_native; i++) {

                    var jsonObj = {
                        id: channels_tag_native[i].id,
                        position: channels_tag_native[i].number,
                        caption: channels_tag_native[i].caption,
                        icon_url: channels_tag_native[i].icon_url,
                        streaming_url: channels_tag_native[i].streaming_url
                    };

                    var streaming = jsonObj.streaming_url;

                    var li_element = '<li class="swipeout"><div class="swipeout-content item-content"><div class="item-inner clickable" data-streaming-url="' + streaming + '"><img width="80px" src="' + jsonObj.icon_url + '">' + jsonObj.caption + '</div></div><div class="swipeout-actions-right"><a href="#" class="delete_channel_' + jsonObj.id + ' bg-red">Delete</a></div></li>';
                    var elements = '<li class="swipeout"><a href="#" class="item-link" >' +
                        '<div class="item-content swipeout-content">' +
                        '<div class="item-media"><img width="40px" style="max-height: 30px" src="' + jsonObj.icon_url + '"></div>' +
                        '<div class="item-inner clickable" data-streaming-url="' + streaming + '">' +
                        '<div class="item-title">' + jsonObj.caption + '</div>' +
                        '<div class="item-after"></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="swipeout-actions-left"> '+
                        '</a> '+
                        '<a href="#" data-caption="'+jsonObj.caption+'" class="add_to_favorites_'+jsonObj.id+' bg-orange">Favorites</a> </div>' +
                        '</li>';

                    $('.native_player_ul').append(elements);

                    $('.channels_preview').attr('src', 'https://www.youtube.com/embed/txSJDmt4u6Q?html5=True');

                    $$('.add_to_favorites_'+jsonObj.id).on('click', function () {
                        var caption = $(this).data('caption');
                        myApp.alert('you click ' + caption);
                    });

                    /*
                     window.plugins.html5Video.initialize({
                     "channel_list_preview": channels_tag_native[0].streaming_url
                     });

                     window.plugins.html5Video.play("channel_list_preview", function videoIsFinished() {
                     console.log("Video is finished")
                     }); */
                }

                /*
                 * If user clicks on video go to fullscreen
                 * */

                function playPause(Video) {
                    if (Video.paused)
                        Video.play();
                    else
                        Video.pause();
                }

                $('#channel_list_preview').on('click', function (e) {
                    var videoUrl = $(this).attr('src');

                    // myApp.addNotification({title: 'Channel', message: videoUrl});
                    playPause(this);
                    /*
                     mainView.router.loadPage({
                     url: "html5fullscreen.html?src=" + videoUrl
                     })
                     */


                });
                $('.clickable').on('click', function (e) {



                    // myApp.showIndicator();
                    var videoUrl = $$(this).data('streaming-url');

                    $('.channels_preview').attr('src', videoUrl);

                    /*
                     window.plugins.html5Video.initialize({
                     "channel_list_preview": videoUrl
                     });

                     window.plugins.html5Video.play("channel_list_preview", function videoIsFinished() {
                     console.log("Video is finished")
                     });
                     */


                });

                /*
                 * On orientation change
                 * */

                window.addEventListener("orientationchange", function () {

                    // myApp.addNotification({title: 'Orientation', message: screen.orientation.type});
                    if (screen.orientation.type == 'landscape-primary' || screen.orientation.type == 'landscape-secondary') {

                        window.plugins.streamingMedia.playVideo($('#channel_list_preview').attr('src'));

                    } else if (screen.orientation.type == 'portrait-primary' || screen.orientation.type == 'portrait-secondary') {
                        myApp.addNotification({title: 'Action', message: 'video is stopped'});

                        mainView.router.loadPage({
                            url: "channels-list-native-player.html"
                        })
                    }
                    console.log(screen.orientation.type); // e.g. portrait
                });

            }

            mySettings.signOut('.signOut');


        });


        // initialize search function
        myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-inner'
        });
    }

};