$(document).ready(function () {
    // Create hamburger functionality
    $('.hamburger').click(function () {
        $('.hamburger').toggleClass('active');
        $('.nav-menu').toggleClass('active');
        $('.nav-menu-sp').toggleClass('active');
        $('.header-top').addClass('fixed');

        if (!$('.hamburger').hasClass('active')) {
            $('.sub-menu-sp').removeClass('active');
            $('.sub-nav-title').removeClass('active');
            $('.header-top').removeClass('fixed');
        }

        const body = $('body');
        if ($('.nav-menu-sp').hasClass('active')) {
            body.addClass('no-scroll');
        } else {
            body.removeClass('no-scroll');
        }
    });

    $('.sub-nav-title').click(function (e) {
        e.stopPropagation();
        // Close all open menus
        $('.sub-menu-sp.active').not($(this).siblings('.sub-menu-sp')).removeClass('active');
        $('.sub-nav-title.active').not($(this)).removeClass('active');

        var parent = $(this).closest('.menu-sp-header');
        parent.find('.sub-menu-sp').toggleClass('active');
        parent.find('.sub-nav-title').toggleClass('active');
    })

    // Close menu when clicking outside
    $(document).click(function (e) {
        const body = $('body');
        if (
            !$(e.target).closest('.nav-menu, .hamburger, .nav-menu-sp').length &&
            $('.nav-menu').hasClass('active')
        ) {
            $('.hamburger').removeClass('active');
            $('.nav-menu').removeClass('active');
            $('.nav-menu-sp').removeClass('active');
            $('.header-top').removeClass('fixed');
            body.removeClass('no-scroll');
        }
    });

    // Close menu when clicking on a link
    $('.nav-menu a, .nav-menu-sp a').click(function () {
        $('.hamburger').removeClass('active');
        $('.nav-menu').removeClass('active');
        $('.nav-menu-sp').removeClass('active');
        $('.header-top').removeClass('fixed');
        $('body').removeClass('no-scroll');
    });

    // Create an underline animation when scrolling
    const h2Element = $('.animated-underline');
    $(window).on('scroll', function () {
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();

        h2Element.each(function () {
            const elementOffset = $(this).offset().top;
            const elementHeight = $(this).outerHeight();

            if (scrollTop + windowHeight / 2 >= elementOffset &&
                scrollTop + windowHeight / 2 <= elementOffset + elementHeight) {
                $(this).addClass("scrolled");
            }

            if (scrollTop + windowHeight / 2 < elementOffset || scrollTop === 0) {
                $(this).removeClass('scrolled');
            }
        });
    });

    // Slideshow functionality
    let currentSlide = 0;
    const slides = $('.slide');
    const dots = $('.dots .dot');
    const totalSlides = slides.length;
    const slideInterval = 5000; // 5 seconds between slides
    let autoSlide;

    function showSlide(index) {
        slides.removeClass('active');
        dots.removeClass('active');

        currentSlide = (index + totalSlides) % totalSlides; // Đảm bảo vòng lặp index
        slides.eq(currentSlide).addClass('active'); // Hiển thị slide hiện tại
        dots.eq(currentSlide).addClass('active'); // Hiển thị trạng thái dot tương ứng
    }

    // Next and previous slide functions
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    $('.next').click(function () {
        clearInterval(autoSlide);
        nextSlide();
        startAutoSlide();
    });

    $('.prev').click(function () {
        clearInterval(autoSlide);
        prevSlide();
        startAutoSlide();
    });

    dots.each(function (index) {
        $(this).on('click', function () {
            clearInterval(autoSlide);
            showSlide(index);
            startAutoSlide();
        });
    });

    function startAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, slideInterval);
    }

    $('#slideshow, .dots .dot').hover(
        function () {
            clearInterval(autoSlide);
            autoSlide = null;
        },
        function () {
            startAutoSlide();
        }
    );

    // Initialize the slideshow by showing the first slide
    showSlide(currentSlide);
    startAutoSlide();
});


document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử cần thiết
    const form = document.querySelector(".contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const confirmEmailInput = document.getElementById("confirm-email");
    const emailError = document.getElementById("email-error");
    const confirmEmailError = document.getElementById("confirm-email-error");
    const emailErrorIcon = document.getElementById("email-error-icon");
    const confirmEmailErrorIcon = document.getElementById("confirm-email-error-icon");
    const privacyCheckbox = document.getElementById("privacy-agree");
    const submitButton = document.querySelector(".submit-button");
  
    // Tìm tất cả các trường bắt buộc (có class "required")
    const requiredFields = form.querySelectorAll(".form-group .required");
    const requiredInputs = Array.from(requiredFields).map((required) => {
      const formGroup = required.closest(".form-group");
      return formGroup.querySelector("input, select, textarea");
    });
  
    // Hàm kiểm tra định dạng email
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    // Hàm hiển thị/ẩn thông báo lỗi và thay đổi trạng thái icon
    function showError(errorElement, iconElement, message) {
      errorElement.textContent = message;
      errorElement.classList.add("active");
      iconElement.classList.add("active"); // Đổi nền icon thành đỏ
    }
  
    function hideError(errorElement, iconElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("active");
      iconElement.classList.remove("active"); // Trở về nền đen
    }
  
    // Hàm kiểm tra trạng thái form và checkbox
    function checkFormValidity() {
      let allRequiredFieldsValid = true;
  
      // Kiểm tra từng trường bắt buộc
      requiredInputs.forEach((input) => {
        const value = input.value.trim();
        const formGroup = input.closest(".form-group");
        const errorElement = formGroup.querySelector(".error-message");
        const errorIconElement = formGroup.querySelector(".error-icon");
  
        if (input === emailInput) {
          // Kiểm tra email
          const isEmailValid = value !== "" && validateEmail(value);
          if (value === "") {
            hideError(errorElement, errorIconElement);
            allRequiredFieldsValid = false;
          } else if (!isEmailValid) {
            showError(errorElement, errorIconElement, "正しいメールアドレスの形式を入力ください");
            allRequiredFieldsValid = false;
          } else {
            hideError(errorElement, errorIconElement);
          }
        } else if (input === confirmEmailInput) {
          // Kiểm tra confirm email
          const emailValue = emailInput.value.trim();
          const isConfirmEmailValid = value !== "" && validateEmail(value) && value === emailValue;
          if (value === "") {
            hideError(errorElement, errorIconElement);
            allRequiredFieldsValid = false;
          } else if (!validateEmail(value)) {
            showError(errorElement, errorIconElement, "正しいメールアドレスの形式を入力ください");
            allRequiredFieldsValid = false;
          } else if (value !== emailValue) {
            showError(errorElement, errorIconElement, "メールアドレスが一致しません");
            allRequiredFieldsValid = false;
          } else {
            hideError(errorElement, errorIconElement);
          }
        } else {
          // Kiểm tra các trường bắt buộc khác (như name)
          if (value === "") {
            allRequiredFieldsValid = false;
          }
        }
      });
  
      // Kiểm tra checkbox
      const isPrivacyChecked = privacyCheckbox.checked;
  
      // Bật nút submit chỉ khi tất cả trường bắt buộc hợp lệ và checkbox được tích
      submitButton.disabled = !(allRequiredFieldsValid && isPrivacyChecked);
    }
  
    // Lắng nghe sự kiện thay đổi trên các trường input và checkbox
    requiredInputs.forEach((input) => {
      input.addEventListener("input", checkFormValidity);
    });
    privacyCheckbox.addEventListener("change", checkFormValidity);
  
    // Gọi hàm kiểm tra ngay khi trang tải để đảm bảo trạng thái ban đầu
    checkFormValidity();
    
  });