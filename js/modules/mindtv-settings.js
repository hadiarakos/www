var mySettings = {
    // ArabicTV Instance.
    BASE_URL: "http://arabictvgui.middleware.tv",
    BASE_URL: "http://arabictvgui.middleware.tv",



    lockOrientation: false,

    signOut: function (element) {
        $(element).click(function () {
            console.log("Logout clicked");
            Cookies.remove('username');
            Cookies.remove('email');
            Cookies.remove('status');

            mainView.router.loadPage({
                url: "index.html"
            })
        });


    },

    addSlick: function (element) {
        console.log("Slick is called");

        $(element).slick({
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 3,
            autoplay: true,
            autoplaySpeed: 5000
        });
    },

    redirectToHomeifCookieIsdDeleted: function (isLogin) {
        if (typeof Cookies != 'undefined') {
            if (isLogin) {
                console.log("Status 200");

                mainView.router.load({
                    url: "channels-list-native-player.html"
                    // url: "dashboard.html"
                });
            } else {
                console.log("Status unknown");

                mainView.router.load({
                    url: "index.html"
                })
            }
        } else {
            return null;
        }

    }


};