/*GIGDAY Approachable Functions*/
var gd = gd || {};
gd.gdMainFunction = function() {
    gd.lazyLoadInit();
    gd.onModalOpenRemoveBounce();
    gd.onModalCarouselSwipe();
    gd.onOutsideMenuClick();
    gd.onMenuClick();
    gd.onNavbarMenuClick();
    gd.initMenuSlideAnimation();
};

gd.lazyLoadInit = function() {
    gd.lazyImages = $('img.lazy').toArray();
    gd.lazyLoadingImages = false;
    document.addEventListener("scroll", gd.lazyLoadScrolling);
	window.addEventListener("resize", gd.lazyLoadImages);
	window.addEventListener("orientationchange", gd.lazyLoadImages);
	gd.lazyLoadImages();
};

gd.lazyLoadImages = function() {
    console.log('Checking for lazy images');
    gd.lazyImages.forEach(function(lazyImage) {
        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight + 200 && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
            gd.loadLazyImage(lazyImage);
            // after loading the image, update the the class and the associated logic when loading an image
            lazyImage.classList.remove("lazy");
            gd.lazyImages = gd.lazyImages.filter(function(image) {
                return image !== lazyImage;
            });
        
            if (gd.lazyImages.length === 0) {
                document.removeEventListener("scroll", gd.lazyLoadScrolling);
                window.removeEventListener("resize", gd.lazyLoadImages);
                window.removeEventListener("orientationchange", gd.lazyLoadImages);
            }
        }
    });
};

gd.loadLazyImage = function(lazyImage) {
    lazyImage.src = lazyImage.dataset.src;
    if (lazyImage.dataset.srcset) {
        lazyImage.srcset = lazyImage.dataset.srcset;
    }
};

gd.lazyLoadScrolling = function() {
    if (gd.lazyLoadingImages === false) {
        gd.lazyLoadingImages = true;

        setTimeout(function() {
            gd.lazyLoadImages();
            gd.lazyLoadingImages = false;
        }, 200);
    }
};

gd.onModalOpenRemoveBounce = function(){
    var modal = $('.modal');
    // Prevent modal from bouncing
    modal.on('shown.bs.modal',function () {
        $(this).find('.modal-lazy').each(function() {
            gd.loadLazyImage(this);
            this.classList.remove('modal-lazy');
        });
        $("html").addClass("noScroll");
    });
    modal.on('hidden.bs.modal', function () {
        $("html").removeClass("noScroll");
    });
};

gd.onOutsideMenuClick = function () {
    $(document).click(function (event) {
        var clickOutsideMenu = $(event.target);
        var menuOpen = $(".collapse").hasClass("cbp-spmenu-open");
        // console.log(clickOutsideMenu);
        // console.log(menuOpen);
        if (menuOpen === true && !clickOutsideMenu.hasClass("navbar-toggler")) {
            $("button#close-navbar-button").click();
        }
    });
};

gd.onMenuClick = function () {
    var navbarMenuLink = $(".nav-item .nav-link");
    navbarMenuLink.on("click",function () {
        $("button#close-navbar-button").click();
    });
};

gd.onModalCarouselSwipe = function () {
    var pageCarousel = $(".carousel");
    var pageCarouselPrevButton = $(".carousel-control-prev");
    var pageCarouselNextButton = $(".carousel-control-next");
    pageCarousel.swipe({
        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == 'left') $(this).carousel('next');
            if (direction == 'right') $(this).carousel('prev');
        },
        allowPageScroll:"vertical"
    });
    //Fix button not working on mobile screen
    pageCarouselPrevButton.click(function() {
        // console.log("Prev button trigger!");
        pageCarousel.carousel('prev');
    });

    pageCarouselNextButton.click(function() {
        // console.log("Next button trigger!");
        pageCarousel.carousel('next');
    });
};
gd.onNavbarMenuClick = function(){
    //Navbar menu
    $(".nav-link").bind('click', function(e) {
        e.preventDefault(); // prevent hard jump, the default behavior

        var target = $(this).attr("href"); // Set the target as variable

        // perform animated scrolling by getting top-position of target-element and set it as scroll target
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top
        }, 600, function() {
            location.hash = target; //attach the hash (#jumptarget) to the pageurl
        });

        return false;
    });


    $(window).on("scroll",function() {
        var scrollDistance = $(window).scrollTop();

        // Assign active class to nav links while scolling
        $('.page-section').each(function(i) {
            if ($(this).position().top <= scrollDistance) {
                $('.navbar-nav a.active').removeClass('active');
                $('.navbar-nav a').eq(i).addClass('active');
            }
        });
    }).scroll();
};
gd.initMenuSlideAnimation = function () {
    var menuLeft2 = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft2 = document.getElementById( 'close-navbar-button' ),
        body2 = document.body;

    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'icon-transition' ),
        body = document.body;

    showLeft2.onclick = function() {
        classie.toggle( this, 'active' );
        classie.toggle( menuLeft2, 'cbp-spmenu-open' );
        showLeft.classList.remove("active");
    };

    showLeft.onclick = function() {
        classie.toggle( this, 'active' );
        classie.toggle( menuLeft, 'cbp-spmenu-open' );
    };
};


$(function(){
    gd.gdMainFunction();
});