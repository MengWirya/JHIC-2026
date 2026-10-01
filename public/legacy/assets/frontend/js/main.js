function openForm() {
    $("#myForm").fadeIn('slow');
  }

  function closeForm() {
    $("#myForm").fadeOut('slow');
  }
$(document).ready(function ($) {
  'use strict';

  $(window).on('scroll', function () {
      closeForm();
  });

  var links = [
      {
        "bgcolor":"rgb(32, 196, 110)",
        "icon":"<i class='fab fa-whatsapp'></i>"
      },
      {
          "url":"https://api.whatsapp.com/send?phone=6281223488999",
          "bgcolor":"rgb(236 134 200)",
          "color":"#fffff",
          "icon":"<i class='fa fa-user'></i>",
          "target":"_blank",
          "title":"OFFICIAL SMK TELKOM MALANG"
      }
      // {
      //   "url":"https://api.whatsapp.com/send?phone=628111701157",
      //   "bgcolor":"rgb(62 189 238)",
      //   "color":"white",
      //   "icon":"<i class='fa fa-user'></i>",
      //   "target":"_blank",
      //   "title":"Pak Qodri"
      // }
  ]
  $('.kc_fab_wrapper').kc_fab(links);
                    

/* ---------------------------------------------
     page  Prealoader
     --------------------------------------------- */
     $(window).on('load', function () {
      $("#loading-center-page").fadeOut();
      $("#loading-page").delay(400).fadeOut("slow");
    });


 
 /* ---------------------------------------------
     Sticky header
     --------------------------------------------- */
     $(window).on('scroll', function () {
      var scroll_top=$(window).scrollTop();

      if (scroll_top > 40){
        $('.navbar').addClass('sticky');

      }
      else{
        $('.navbar').removeClass('sticky');  
      }

    });


 

/*--------------------
Slick  JS
----------------------*/

$('.testmonial-slider').slick({
  dots: false,
  padding:0,
  slidesPerRow: 1,
  rows: 1,
  arrows: true,
   prevArrow: "<button type='button' class='slick-prev text-danger'><i class='fa fa-chevron-left'></i></button>",
   nextArrow: "<button type='button' class='slick-next text-danger'><i class='fa fa-chevron-right'></i></button>",
  centerMode: true,
  margin:20,
  slidesToShow: 1,
  slidesToScroll: 1,
 
}); 
 
 
$('.client-slider').slick({
  dots: false,
  arrows: false,
  infinite: true,
  autoplay: true, 
  slidesToShow: 5,
  autoplaySpeed:3000,
  slidesToScroll: 5,
  centerMode: true,
  responsive: [
  {
   breakpoint: 1024,
   settings: {
     slidesToShow: 3,
     slidesToScroll: 3,
     infinite: true,
     
   }
 },
 {
   breakpoint: 600,
   settings: {
     slidesToShow: 2,
     slidesToScroll: 2
   }
 },
 {
   breakpoint: 480,
   settings: {
     slidesToShow: 1,
     slidesToScroll: 1
   }
 }
 ]
 });
 
 
 

/*----------------------------------------------------*/
/*  VIDEO POP PUP
/*----------------------------------------------------*/

$('.video-modal').magnificPopup({
  
  type: 'iframe',

  iframe: {
    patterns: {
      youtube: {

        index: 'youtube.com',
        src: 'https://www.youtube-nocookie.com/embed/9xofia597HI?si=2tapJ6zLgGXrsaHi'

      }
    }
  }
});
 
/*--------------------
VenoBox
----------------------*/

$('.modal-venobox').venobox({
  numeratio: true,            // default: false
  infinigall: true,
  titleattr: 'data-title',    // default: 'title'// default: false
});	


/* ---------------------------------------------
Portfolio
--------------------------------------------- */
$(document).ready(function () {

  $(".filter-btn").on('click', function (event) {

      event.preventDefault();
      var value = $(this).attr('data-filter');


      if (value == "all") {

          $('.filter').fadeIn('2000');
      } else {

          $(".filter").not('.' + value).fadeOut('3000');
          $('.filter').filter('.' + value).fadeIn('3000');

      }
      $(".filter-btn").removeClass("active"); 
      $(this).addClass("active");
  });





});

/* ---------------------------------------------
 Back top page scroll up
 --------------------------------------------- */



/* ---------------------------------------------
 WoW plugin
 --------------------------------------------- */

 new WOW().init({
  mobile: true,
});

/* ---------------------------------------------
 Smooth scroll
 --------------------------------------------- */

 $('a.section-scroll[href*="#"]:not([href="#"])').on('click', function (event) {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') ||
    location.hostname == this.hostname) {

    var target = $(this.hash);
  target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

  if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 750);
            return false;
          }
        }

      });



/*----------------------------------------
 Newsletter Subscribe
 --------------------------------------*/

 $(".subscribe-mail").ajaxChimp({
  callback: mailchimpCallRep,
    url: "mailchimp-post-url" //Replace this with your own mailchimp post URL. Just paste the url inside "".
  });

 function mailchimpCallRep(resp) {
  if (resp.result === "success") {
    $(".sucess-message").html(resp.msg).fadeIn(1000);
    $(".error-message").fadeOut(500);
  } else if (resp.result === "error") {
    $(".error-message").html(resp.msg).fadeIn(1000);
  }
}


/*--------------------
VenoBox
----------------------*/

$('.modal-venobox').venobox({
  numeratio: true,            // default: false
  infinigall: true,
  titleattr: 'data-title',    // default: 'title'// default: false
});	


/*--------------------
MAGNIFIC POPUP IMAGE  JS
----------------------*/
$('.modal-image').magnificPopup({
  type: 'image',
  removalDelay: 300,
  mainClass: 'mfp-with-zoom',
  gallery: {
      enabled: true
  },
  zoom: {
      enabled: true,

      duration: 300,
      easing: 'ease-in-out',

      opener: function (openerElement) {

          return openerElement.is('img') ? openerElement : openerElement.find('img');
      }
  }
});

$('.projetc-inner').slick({
  dots: false,
  arrows: true,
  centerMode: true,
  slidesToShow: 4,
  slidesToScroll: 4,
 cssEase: 'linear',
 prevArrow: "<button type='button' class='slick-prev'><i class='fas fa-chevron-left' aria-hidden='true'></i></button>",
 nextArrow: "<button type='button' class='slick-next'><i class='fas fa-chevron-right' aria-hidden='true'></i></button>",
 responsive: [
{
breakpoint: 1024,
settings: {
  slidesToShow: 3,
  slidesToScroll: 3,
  infinite: true,
  
}
},
{
breakpoint: 600,
settings: {
  slidesToShow: 2,
  slidesToScroll: 2
}
},
{
breakpoint: 480,
settings: {
  slidesToShow: 1,
  slidesToScroll: 1
}
}
]

});
});