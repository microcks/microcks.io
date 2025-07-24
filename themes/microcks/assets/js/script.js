'use strict';

// main script
(function () {
  "use strict";

  // gallery slider
  new Swiper(".gallery-slider", {
    slidesPerView: 1,
    loop: true,
    autoHeight: true,
    spaceBetween: 0,
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // video play button
  var videoPlay = document.querySelectorAll(".video-loader-btn");
  videoPlay.forEach(function (video) {
    video.addEventListener("click", function () {
      var thumbnail = this.parentNode.children;
      var thumbWidth = thumbnail[1].width;
      var video =
        '<div class="ratio ratio-16x9 mx-auto bg-dark rounded-2 overflow-hidden" style="max-width:' +
        thumbWidth +
        'px"><iframe src="' +
        this.getAttribute("data-src") +
        "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" +
        '" allowscriptaccess="always" allow="autoplay" allowfullscreen></iframe></div>';
      this.parentNode.innerHTML = video;
    });
  });

  // counterUp
  document.addEventListener("DOMContentLoaded", function () {
    // You can change this class to specify which elements are going to behave as counters.
    var elements = document.querySelectorAll(".counter");

    elements.forEach(function (item) {
      // Add new attributes to the elements with the '.counter' HTML class
      item.counterAlreadyFired = false;
      item.counterSpeed = item.getAttribute("data-counter-time") / 45;
      item.counterTarget = +item.innerText;
      item.counterCount = 0;
      item.counterStep = item.counterTarget / item.counterSpeed;

      item.updateCounter = function () {
        item.counterCount = item.counterCount + item.counterStep;
        item.innerText = Math.ceil(item.counterCount);

        if (item.counterCount < item.counterTarget) {
          setTimeout(item.updateCounter, item.counterSpeed);
        } else {
          item.innerText = item.counterTarget;
        }
      };
    });

    // Function to determine if an element is visible in the web page
    var isElementVisible = function isElementVisible(el) {
      var scroll = window.scrollY || window.pageYOffset;
      var boundsTop = el.getBoundingClientRect().top + scroll;
      var viewport = {
        top: scroll,
        bottom: scroll + window.innerHeight,
      };
      var bounds = {
        top: boundsTop,
        bottom: boundsTop + el.clientHeight,
      };
      return (
        (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom) ||
        (bounds.top <= viewport.bottom && bounds.top >= viewport.top)
      );
    };

    // Funciton that will get fired uppon scrolling
    var handleScroll = function handleScroll() {
      elements.forEach(function (item, id) {
        if (true === item.counterAlreadyFired) return;
        if (!isElementVisible(item)) return;
        item.updateCounter();
        item.counterAlreadyFired = true;
      });
    };

    // Fire the function on scroll
    window.addEventListener("scroll", handleScroll);
  });

  //slider
  new Swiper(".single-slider", {
    loop: true,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // brandCarousel init
  new Swiper(".brand-carousel", {
    spaceBetween: 0,
    speed: 1000,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      767: {
        slidesPerView: 4,
        spaceBetween: 0,
      },
      991: {
        slidesPerView: 6,
        spaceBetween: 0,
      },
    },
  });

  // testimonial-carousel init
  new Swiper(".testimonial-carousel", {
    spaceBetween: 70,
    speed: 600,
    loop: true,
    autoplay: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 70,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
})();

// searchToggler keyboard shortcut
const searchToggler = document.querySelectorAll('[data-search-toggler]');
searchToggler.forEach((item) => {
	let userAgentData = navigator?.userAgentData?.platform || navigator?.platform || 'unknown';

	if (userAgentData == 'macOS') {
		item.innerText = `⌘ + K`
	} else {
		item.innerText = `Ctrl + K`
	}
});

// Navbar fixed
window.onscroll = function () {
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
		document.querySelector(".navigation").classList.add("nav-bg");
	} else {
		document.querySelector(".navigation").classList.remove("nav-bg");
	}
};

// masonry
window.onload = function () {
	let masonryWrapper = document.querySelector('.masonry-wrapper');
	// if masonryWrapper is not null, then initialize masonry
	if (masonryWrapper) {
		let masonry = new Masonry(masonryWrapper, {
			columnWidth: 1
		});
	}
};

// copy to clipboard
let blocks = document.querySelectorAll("pre");
blocks.forEach((block) => {
	if (navigator.clipboard) {
		let button = document.createElement("span");
		button.innerText = "copy";
		button.className = "copy-to-clipboard";
		block.appendChild(button);
		button.addEventListener("click", async () => {
			await copyCode(block, button);
		});
	}
});
async function copyCode(block, button) {
	let code = block.querySelector("code");
	let text = code.innerText;
  // Remove extra new lines.
  text = text.replace(/(\n\n)/gm, '\n');
	await navigator.clipboard.writeText(text);
	button.innerText = "copied";
	setTimeout(() => {
		button.innerText = "copy";
	}, 700);
}

// table of content
let toc = document.querySelector("#TableOfContents a");
if (toc) {
	new ScrollMenu("#TableOfContents a", {
		duration: 50,
		activeOffset: 110,
		scrollOffset: 110,
	})
}

// Mobile sidebar navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile sidebar toggle functionality
  const mobileSidebarItems = document.querySelectorAll('.doc-sidenav-mobile .sidelist-mobile.parent > a');
  
  mobileSidebarItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const parent = this.closest('.sidelist-mobile');
      const submenu = parent.querySelector('.mobile-submenu');
      const toggleIcon = this.querySelector('.toggle-icon');
      
      // Close other open submenus
      const otherOpenMenus = document.querySelectorAll('.doc-sidenav-mobile .sidelist-mobile.parent.active');
      otherOpenMenus.forEach(openMenu => {
        if (openMenu !== parent) {
          openMenu.classList.remove('active');
          const otherSubmenu = openMenu.querySelector('.mobile-submenu');
          const otherIcon = openMenu.querySelector('.toggle-icon');
          if (otherSubmenu) otherSubmenu.style.display = 'none';
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });
      
      // Toggle current submenu
      if (parent.classList.contains('active')) {
        parent.classList.remove('active');
        if (submenu) submenu.style.display = 'none';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
      } else {
        parent.classList.add('active');
        if (submenu) submenu.style.display = 'block';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Auto-expand current page's parent menu on mobile
  const currentPageItem = document.querySelector('.doc-sidenav-mobile .sidelist-mobile.active');
  if (currentPageItem) {
    const parentMenu = currentPageItem.closest('.sidelist-mobile.parent');
    if (parentMenu) {
      parentMenu.classList.add('active');
      const submenu = parentMenu.querySelector('.mobile-submenu');
      const toggleIcon = parentMenu.querySelector('.toggle-icon');
      if (submenu) submenu.style.display = 'block';
      if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
    }
  }

  // Scroll to active item when mobile sidebar opens
  const mobileSidebar = document.getElementById('mobileSidebar');
  if (mobileSidebar) {
    mobileSidebar.addEventListener('shown.bs.collapse', function() {
      const activeItem = this.querySelector('.sidelist-mobile.active');
      if (activeItem) {
        const scrollContainer = this.querySelector('.mobile-sidebar-scroll');
        if (scrollContainer) {
          const itemTop = activeItem.offsetTop;
          const containerHeight = scrollContainer.clientHeight;
          const scrollTop = itemTop - (containerHeight / 2);
          
          scrollContainer.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // Close mobile sidebar when clicking outside
  document.addEventListener('click', function(e) {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const toggleButton = document.querySelector('[data-bs-target="#mobileSidebar"]');
    
    if (mobileSidebar && mobileSidebar.classList.contains('show')) {
      if (!mobileSidebar.contains(e.target) && !toggleButton.contains(e.target)) {
        const bsCollapse = new bootstrap.Collapse(mobileSidebar);
        bsCollapse.hide();
      }
    }
  });

  // Smooth scroll for anchor links in documentation
  const docLinks = document.querySelectorAll('.doc-content a[href^="#"]');
  docLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.navigation').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
