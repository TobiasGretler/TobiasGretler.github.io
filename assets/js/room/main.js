;
(function(window) {

    'use strict';
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var DOM = {};
    // The loader.
    DOM.loader = document.querySelector('.overlay--loader');
    // The room wrapper. This will be the element to be transformed in order to move around.
    DOM.scroller = document.querySelector('.container > .scroller');
    // The rooms.
    DOM.rooms = [].slice.call(DOM.scroller.querySelectorAll('.room'));
    // The content wrapper.
    DOM.content = document.querySelector('.content');
    // Rooms navigation controls.
    DOM.nav = {
        leftCtrl: DOM.content.querySelector('nav > .btn--nav-left'),
        rightCtrl: DOM.content.querySelector('nav > .btn--nav-right')
    };

    var currentRoom = 0,
        // Total number of rooms.
        totalRooms = DOM.rooms.length,
        // Initial transform.
        initTransform = {
            translateX: 0,
            translateY: 0,
            translateZ: '500px',
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
        },
        // Reset transform.
        resetTransform = {
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
        },
        // View from top.
        menuTransform = {
            translateX: 0,
            translateY: '150%',
            translateZ: 0,
            rotateX: '15deg',
            rotateY: 0,
            rotateZ: 0
        },
        menuTransform = {
            translateX: 0,
            translateY: '50%',
            translateZ: 0,
            rotateX: '-10deg',
            rotateY: 0,
            rotateZ: 0
        },
        // Info view transform.
        infoTransform = {
            translateX: 0,
            translateY: 0,
            translateZ: '200px',
            rotateX: '2deg',
            rotateY: 0,
            rotateZ: '4deg'
        },
        // Room moving transition.
        roomTransition = {
            speed: '0.4s',
            easing: 'ease'
        },
        // View from top transition.
        menuTransition = {
            speed: '1.5s',
            easing: 'cubic-bezier(0.2,1,0.3,1)'
        },
        // Info transition.
        infoTransition = {
            speed: '15s',
            easing: 'cubic-bezier(0.3,1,0.3,1)'
        },
        // Tilt transition
        tiltTransition = {
            speed: '0.2s',
            easing: 'ease-out'
        },
        tilt = false,
        // How much to rotate when the mouse moves.
        tiltRotation = {
            rotateX: 1, // a relative rotation of -1deg to 1deg on the x-axis
            rotateY: -3 // a relative rotation of -3deg to 3deg on the y-axis
        },
        // Transition end event handler.
        onEndTransition = function(el, callback) {
            var onEndCallbackFn = function(ev) {
                this.removeEventListener('transitionend', onEndCallbackFn);
                if (callback && typeof callback === 'function') {
                    callback.call();
                }
            };
            el.addEventListener('transitionend', onEndCallbackFn);
        },
        // Window sizes.
        win = {
            width: window.innerWidth,
            height: window.innerHeight
        },
        // Check if moving inside the room and check if navigating.
        isMoving, isNavigating;

    function init() {
        // Move into the current room.
        move({
            transition: roomTransition,
            transform: initTransform
        }).then(function() {
            initTilt();
            applyRoomTransition('none');
        });
        // Animate the current slide in.
        showSlide();
        // Init/Bind events.
        initEvents();
    }

    function initTilt() {
        //applyRoomTransition(tiltTransition);
        tilt = true;
    }

    function removeTilt() {
        tilt = false;
    }

    function move(opts) {
        return new Promise(function(resolve, reject) {
            if (isMoving && !opts.stopTransition) {
                return false;
            }
            isMoving = true;

            if (opts.transition) {
                applyRoomTransition(opts.transition);
            }

            if (opts.transform) {
                applyRoomTransform(opts.transform);
                var onEndFn = function() {
                    isMoving = false;
                    resolve();
                };
                onEndTransition(DOM.scroller, onEndFn);
            } else {
                resolve();
            }

        });
    }

    function initEvents() {
        // Mousemove event / Tilt functionality.
        var onMouseMoveFn = function(ev) {
                requestAnimationFrame(function() {
                    if (!tilt) return false;

                    // apply transform
                    applyRoomTransform({
                        'translateX': initTransform.translateX,
                        'translateY': initTransform.translateY,
                        'translateZ': initTransform.translateZ,
                        'rotateX': rotX + 'deg',
                        'rotateY': rotY + 'deg',
                        'rotateZ': initTransform.rotateZ
                    });
                });
            },
            // Window resize.
            debounceResizeFn = debounce(function() {
                win = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            }, 10);

        document.addEventListener('mousemove', onMouseMoveFn);
        window.addEventListener('resize', debounceResizeFn);

        // Room navigation.
        var onNavigatePrevFn = function() {
                navigate('prev');
            },
            onNavigateNextFn = function() {
                navigate('next');
            };

        DOM.nav.leftCtrl.addEventListener('click', onNavigatePrevFn);
        DOM.nav.rightCtrl.addEventListener('click', onNavigateNextFn);

    }

    function applyRoomTransform(transform) {
        DOM.scroller.style.transform = 'translate3d(' + transform.translateX + ', ' + transform.translateY + ', ' + transform.translateZ + ') ' +
            'rotate3d(1,0,0,' + transform.rotateX + ') rotate3d(0,1,0,' + transform.rotateY + ') rotate3d(0,0,1,' + transform.rotateZ + ')';
    }

    function applyRoomTransition(transition) {
        DOM.scroller.style.transition = transition === 'none' ? transition : 'transform ' + transition.speed + ' ' + transition.easing;
    }

    function toggleSlide(dir, delay) {
        delay = delay !== undefined ? delay : 0;

        var animeOpts = {
            duration: dir === 'in' ? 400 : 400,
            //delay: 0,//dir === 'in' ? 150 : 0,
            delay: function(t, i, c) {
                return delay + 75 + i * 75;
            },
            easing: [0.25, 0.1, 0.25, 1],
            opacity: {
                value: dir === 'in' ? [0, 1] : [1, 0],
                duration: dir === 'in' ? 550 : 250
            },
            translateY: function(t, i) {
                return dir === 'in' ? [150, 0] : [0, -150];
            }
        };
        if (dir === 'in') {
            animeOpts.begin = function() {
            };
        } else {
            animeOpts.complete = function() {
            };
        }
        anime(animeOpts);
    }

    function showSlide(delay) {
        toggleSlide('in', delay);
    }

    function hideSlide(delay) {
        toggleSlide('out', delay);
    }

    function navigate(dir) {
        if (isMoving || isNavigating) {
            return false;
        }
        isNavigating = true;

        var room = DOM.rooms[currentRoom];

        // Remove tilt.
        removeTilt();
        // Animate the current slide out - animate the name, title and date elements.
        hideSlide();

        // Update currentRoom.
        if (dir === 'next') {
            currentRoom = currentRoom < totalRooms - 1 ? currentRoom + 1 : 0;
        } else {
            currentRoom = currentRoom > 0 ? currentRoom - 1 : totalRooms - 1;
        }

        // Position the next room.
        var nextRoom = DOM.rooms[currentRoom];
        nextRoom.style.transform = 'translate3d(' + (dir === 'next' ? 100 : -100) + '%,0,0) translate3d(' + (dir === 'next' ? 1 : -1) + 'px,0,0)';
        nextRoom.style.opacity = 1;

        // Move back.
        move({
                transition: roomTransition,
                transform: resetTransform
            })
            .then(function() {
                // Move left or right.
                return move({
                    transform: {
                        translateX: (dir === 'next' ? -100 : 100) + '%',
                        translateY: 0,
                        translateZ: 0,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0
                    }
                });
            })
            .then(function() {
                // Update current room class.
                nextRoom.classList.add('room--current');
                room.classList.remove('room--current');
                room.style.opacity = 0;

                // Show the next slide.
                showSlide();

                // Move into room.
                // Update final transform state:
                return move({
                    transform: {
                        translateX: (dir === 'next' ? -100 : 100) + '%',
                        translateY: 0,
                        translateZ: '500px',
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0
                    }
                });
            })
            .then(function() {
                // Reset positions.
                applyRoomTransition('none');
                nextRoom.style.transform = 'translate3d(0,0,0)';
                applyRoomTransform(initTransform);

                setTimeout(function() {
                    initTilt();
                }, 60);
                isNavigating = false;
            });
    }

    // Preload all the images.
    imagesLoaded(DOM.scroller, function() {
        var extradelay = 1000;
        // Slide out loader.
        anime({
            targets: DOM.loader,
            duration: 600,
            easing: 'easeInOutCubic',
            delay: extradelay,
            translateY: '-100%',
            complete: function() {
                DOM.loader.classList.remove('overlay--active');
            }
        });
        setTimeout(function() {
            init();
        }, extradelay + 300);
    });

})(window);