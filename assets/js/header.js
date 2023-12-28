document.addEventListener('DOMContentLoaded', function () {
    // Create header element
    var header = document.createElement('header');
    header.id = 'header';
    header.className = 'header d-flex align-items-center fixed-top';
  
    // Create container element
    var container = document.createElement('div');
    container.className = 'container-fluid d-flex align-items-center justify-content-between';
  
    // Create logo element
    var logo = document.createElement('a');
    logo.href = 'index.html';
    logo.className = 'logo d-flex align-items-center me-auto me-lg-0';
    logo.innerHTML = '<i class="bi bi-camera"></i><h1>NƎ⅁Ǝ⅁SICHT</h1>';
  
    // Create navbar element
    var navbar = document.createElement('nav');
    navbar.id = 'navbar';
    navbar.className = 'navbar';
  
    // Create navbar ul element
    var navbarUl = document.createElement('ul');
  
    // Add list items to navbar
    var navItems = [
      '<li><a href="index.html">Home</a></li>',
      '<li><a href="about.html">About</a></li>',
      '<li class="dropdown"><a href="gallery.html"><span>Gallery</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>' +
      '<ul>' +
      '<li><a href="Nature.html">Nature</a></li>' +
      '<li><a href="Architecture.html">Architecture</a></li>' +
      '<li><a href="Animals.html">Animals</a></li>' +
      '<li><a href="Sports.html">Sports</a></li>' +
      '<li><a href="Travel.html">Travel</a></li>' +
      '<li class="dropdown"><a href="#"><span>Sub Menu</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>' +
      '<ul>' +
      '<li><a href="#">Sub Menu 1</a></li>' +
      '<li><a href="#">Sub Menu 2</a></li>' +
      '<li><a href="#">Sub Menu 3</a></li>' +
      '</ul>' +
      '</li>' +
      '</ul>' +
      '</li>',
      '<li><a href="contact.html">Contact</a></li>'
    ];
  
    // Append list items to navbar ul
    navItems.forEach(function (item) {
      navbarUl.innerHTML += item;
    });
  
    // Append navbar ul to navbar
    navbar.appendChild(navbarUl);
  
    // Create social links element
    var socialLinks = document.createElement('div');
    socialLinks.className = 'header-social-links';
    var socialIcons = ['twitter', 'facebook', 'instagram', 'linkedin'];
    socialIcons.forEach(function (icon) {
      socialLinks.innerHTML += '<a href="#" class="' + icon + '"><i class="bi bi-' + icon + '"></i></a>';
    });
  
    // Create mobile nav toggle elements
    var mobileNavToggleShow = document.createElement('i');
    mobileNavToggleShow.className = 'mobile-nav-toggle mobile-nav-show bi bi-list';
  
    var mobileNavToggleHide = document.createElement('i');
    mobileNavToggleHide.className = 'mobile-nav-toggle mobile-nav-hide d-none bi bi-x';
  
    // Append elements to container
    container.appendChild(logo);
    container.appendChild(navbar);
    container.appendChild(socialLinks);
    container.appendChild(mobileNavToggleShow);
    container.appendChild(mobileNavToggleHide);
  
    // Append container to header
    header.appendChild(container);
  
    // Append header to body
    document.body.insertBefore(header, document.body.firstChild);
  });