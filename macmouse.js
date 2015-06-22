'use strict'

var $ = require('NodObjC');
$.framework('Cocoa');

var pool;

var ptX = 0;
var ptY = 0;


/**
 * Usage:  mouse.init();
 * Desc:   Initializes the macmouse module
 * Before: mouse is an uninitialized macmouse
 * After:  mouse is an initialized macmouse
 */
var init = function() {
    pool = $.NSAutoreleasePool('alloc')('init');
    var pos = getRealPos();
    setPos(pos.x, pos.y);
}

/**
 * Usage:  var pos = mouse.getRealPos();
 * Desc:   Sends request for real mouse position, more expensive than getPos
 * Before: mouse is an initialized macmouse
 * After:  pos holds x and y numbers representing the system mouse position
 */
var getRealPos = function() {
    var pos = $.NSEvent("mouseLocation");
    return { x: pos.x, y: pos.y };
}

/**
 * Usage:  var pos = mouse.getPos();
 * Desc:   Returns mouse position currently stored in the mouse module
 * Before: mouse is an initialized macmouse
 * After:  pos holds x and y numbers representing the system mouse position currently stored in the
 *         mouse module
 */
var getPos = function() {
    return { x: ptX, y: ptY };
}

// simple private helper function
var setPos = function(x, y) {
    ptX = x;
    ptY = y;
}

/**
 * Usage:  mouse.Place();
 * Desc:   Sends mouse event message to place the system mouse at a specific position
 * Before: mouse is an initialized macmouse, x and y are numbers representing a specific position
 * After:  mouse event has been sent to move the system mouse to position defined by x and y
 */
var Place = function(x, y) {
    setPos(x, y);
    var moveEvent = $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, $.CGPointMake(x, y), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, moveEvent);
}

/**
 * Usage:  mouse.DragPlace(x, y);
 * Desc:   Sends mouse event message to place the system mouse at a specific position while in a 
 *         dragging state
 * Before: mouse is an initialized macmouse, x and y are numbers representing a specific position, the 
 *         system mouse currently has (or thinks it has) the left mouse button pressed
 * After:  mouse event has been sent to move the system mouse to position defined by x and y with left 
 *         mouse button pressed
 */
var DragPlace = function(x, y) {
    setPos(x, y);
    var moveEvent = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDragged, $.CGPointMake(x, y), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, moveEvent);
}

/**
 * Usage:  mouse.Move(dx, dy);
 * Desc:   Sends mouse event message to move the system mouse (from current stored position in the mouse 
 *         module) by a vector defined by dx and dy
 * Before: mouse is an initialized macmouse, dx and dy are numbers representing our moving vector 
 * After:  mouse event has been sent to move the system mouse by a vector defined by the numbers dx and dy
 */
var Move = function(dx, dy) {
    ptX += dx;
    ptY += dy;
    var moveEvent = $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, $.CGPointMake(ptX, ptY), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, moveEvent);
}

/**
 * Usage:  mouse.DragMove(dx, dy);
 * Desc:   Sends mouse event message to move the system mouse (from current stored position in the mouse 
 *         module) by a vector defined by dx and dy while in a dragging state
 * Before: mouse is an initialized macmouse, dx and dy are numbers representing our moving vector, the 
 *         system mouse currently has (or thinks it has) the left mouse button pressed
 * After:  mouse event has been sent to move the system mouse by a vector defined by the numbers dx and dy 
 *         with left mouse button pressed
 */
var DragMove = function(dx, dy) {
    ptX += dx;
    ptY += dy;
    var moveEvent = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDragged, $.CGPointMake(ptX, ptY), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, moveEvent);
}

/**
 * Usage:  mouse.LeftButtonPress();
 * Desc:   Sends mouse event message to press and hold down the left button of the system mouse
 * Before: mouse is an initialized macmouse
 * After:  mouse event has been sent to press and hold the left button on the system mouse
 */
var LeftButtonPress = function() {
    var clickDown = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDown, $.CGPointMake(ptX, ptY), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, clickDown);
}

/**
 * Usage:  mouse.LeftButtonRelease();
 * Desc:   Sends mouse event message to release a pressed left button of the system mouse
 * Before: mouse is an initialized macmouse
 * After:  mouse event has been sent to release a pressed left button on the system mouse
 */
var LeftButtonRelease = function() {
    var clickUp = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseUp, $.CGPointMake(ptX, ptY), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, clickUp);
}

/**
 * Usage:  mouse.RightButtonPress();
 * Desc:   Sends mouse event message to press and hold down the right button of the system mouse
 * Before: mouse is an initialized macmouse
 * After:  mouse event has been sent to press and hold the right button on the system mouse
 */
var RightButtonPress = function() {
    var clickDown = $.CGEventCreateMouseEvent(null, $.kCGEventRightMouseDown, $.CGPointMake(ptX, ptY), $.kCGEventRightMouseDown);
    $.CGEventPost($.kCGHIDEventTap, clickDown);
}

/**
 * Usage:  mouse.RightButtonRelease();
 * Desc:   Sends mouse event message to release a pressed right button of the system mouse
 * Before: mouse is an initialized macmouse
 * After:  mouse event has been sent to release a pressed right button on the system mouse
 */
var RightButtonRelease = function() {
    var clickUp = $.CGEventCreateMouseEvent(null, $.kCGEventRightMouseUp, $.CGPointMake(ptX, ptY), $.kCGEventRightMouseDown);
    $.CGEventPost($.kCGHIDEventTap, clickUp);
}

/**
 * Usage:  mouse.doubleClick();
 * Desc:   Sends mouse event message to double click the system mouse
 * Before: mouse is an initialized macmouse
 * After:  mouse event has been sent to double click the system mouse
 */
var doubleClick = function() {
  var evt = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDown, $.CGPointMake(ptX, ptY), $.kCGMouseButtonLeft);

  $.CGEventSetIntegerValueField(evt, $.kCGMouseEventClickState, 2);
  $.CGEventPost($.kCGHIDEventTap, evt);

  $.CGEventSetType(evt, $.kCGEventLeftMouseUp);
  $.CGEventPost($.kCGHIDEventTap, evt);

  $.CGEventSetType(evt, $.kCGEventLeftMouseDown);
  $.CGEventPost($.kCGHIDEventTap, evt);

  $.CGEventSetType(evt, $.kCGEventLeftMouseUp);
  $.CGEventPost($.kCGHIDEventTap, evt);
}

/**
 *  Helper function for converting a key string in an Apple compatible keycode
 *  See http://stackoverflow.com/a/14529841/3899784
 */
var keycodeFromString = function(keyString) {
    if (keyString == "a") return 0;
    if (keyString == "s") return 1;
    if (keyString == "d") return 2;
    if (keyString == "f") return 3;
    if (keyString == "h") return 4;
    if (keyString == "g") return 5;
    if (keyString == "z") return 6;
    if (keyString == "x") return 7;
    if (keyString == "c") return 8;
    if (keyString == "v") return 9;
    // what is 10?
    if (keyString == "b") return 11;
    if (keyString == "q") return 12;
    if (keyString == "w") return 13;
    if (keyString == "e") return 14;
    if (keyString == "r") return 15;
    if (keyString == "y") return 16;
    if (keyString == "t") return 17;
    if (keyString == "1") return 18;
    if (keyString == "2") return 19;
    if (keyString == "3") return 20;
    if (keyString == "4") return 21;
    if (keyString == "6") return 22;
    if (keyString == "5") return 23;
    if (keyString == "=") return 24;
    if (keyString == "9") return 25;
    if (keyString == "7") return 26;
    if (keyString == "-") return 27;
    if (keyString == "8") return 28;
    if (keyString == "0") return 29;
    if (keyString == "]") return 30;
    if (keyString == "o") return 31;
    if (keyString == "u") return 32;
    if (keyString == "[") return 33;
    if (keyString == "i") return 34;
    if (keyString == "p") return 35;
    if (keyString == "RETURN") return 36;
    if (keyString == "l") return 37;
    if (keyString == "j") return 38;
    if (keyString == "'") return 39;
    if (keyString == "k") return 40;
    if (keyString == ";") return 41;
    if (keyString == "\\") return 42;
    if (keyString == ",") return 43;
    if (keyString == "/") return 44;
    if (keyString == "n") return 45;
    if (keyString == "m") return 46;
    if (keyString == ".") return 47;
    if (keyString == "TAB") return 48;
    if (keyString == "SPACE") return 49;
    if (keyString == "`") return 50;
    if (keyString == "DELETE") return 51;
    if (keyString == "ENTER") return 52;
    if (keyString == "ESCAPE") return 53;

    // some more missing codes abound, reserved I presume, but it would
    // have been helpful for Apple to have a document with them all listed

    if (keyString == ".") return 65;

    if (keyString == "*") return 67;

    if (keyString == "+") return 69;

    if (keyString == "CLEAR") return 71;

    if (keyString == "/") return 75;
    if (keyString == "ENTER") return 76;  // numberpad on full kbd

    if (keyString == "=") return 78;

    if (keyString == "=") return 81;
    if (keyString == "0") return 82;
    if (keyString == "1") return 83;
    if (keyString == "2") return 84;
    if (keyString == "3") return 85;
    if (keyString == "4") return 86;
    if (keyString == "5") return 87;
    if (keyString == "6") return 88;
    if (keyString == "7") return 89;

    if (keyString == "8") return 91;
    if (keyString == "9") return 92;

    if (keyString == "F5") return 96;
    if (keyString == "F6") return 97;
    if (keyString == "F7") return 98;
    if (keyString == "F3") return 99;
    if (keyString == "F8") return 100;
    if (keyString == "F9") return 101;

    if (keyString == "F11") return 103;

    if (keyString == "F13") return 105;

    if (keyString == "F14") return 107;

    if (keyString == "F10") return 109;

    if (keyString == "F12") return 111;

    if (keyString == "F15") return 113;
    if (keyString == "HELP") return 114;
    if (keyString == "HOME") return 115;
    if (keyString == "PGUP") return 116;
    if (keyString == "DELETE") return 117;
    if (keyString == "F4") return 118;
    if (keyString == "END") return 119;
    if (keyString == "F2") return 120;
    if (keyString == "PGDN") return 121;
    if (keyString == "F1") return 122;
    if (keyString == "LEFT") return 123;
    if (keyString == "RIGHT") return 124;
    if (keyString == "DOWN") return 125;
    if (keyString == "UP") return 126;

    return 0;
}

/**
 * Usage:  mouse.modifierKey();
 * Desc:   Sends keyboard event to hold down one or more of the command and shift key, press a key and release the modifiers again
 * Before: mouse is an initialized macmouse
 * After:  keyboard event has been sent to hold down the command and/or shift key, press a key and release the modifiers
 */
var modifierKey = function(key, shift, cmd) {
    var flags;
    if(cmd) {
        flags = flags | $.kCGEventFlagMaskCommand;
    }
    if(shift) {
        flags = flags | $.kCGEventFlagMaskShift;
    }

    var src = $.CGEventSourceCreate($.kCGEventSourceStateHIDSystemState);

    var keycode = keycodeFromString(key);

    var evt = $.CGEventCreateKeyboardEvent(src, keycode, true);
    $.CGEventSetFlags(evt, flags | $.CGEventGetFlags(evt));
    $.CGEventPost($.kCGHIDEventTap, evt);
    $.CFRelease(evt);

    evt = $.CGEventCreateKeyboardEvent(src, keycode, false);
    $.CGEventSetFlags(evt, flags | $.CGEventGetFlags(evt));
    $.CGEventPost($.kCGHIDEventTap, evt);
    $.CFRelease(evt);

    $.CFRelease(src);
}
/**
 * Usage:  mouse.cmdKey();
 * Desc:   Sends keyboard event to hold down the command key, press a key and release the command key
 * Before: mouse is an initialized macmouse
 * After:  keyboard event has been sent to hold down the command key, press a key and release the command key
 */
var cmdKey = function(key) {
    modifierKey(key, false, true);
}


/**
 * Usage:  mouse.shiftKey();
 * Desc:   Sends keyboard event to hold down the shift key, press a key and release the shift key
 * Before: mouse is an initialized macmouse
 * After:  keyboard event has been sent to hold down the command key, press a key and release the command key
 */
var shiftKey = function(key) {
    modifierKey(key, true, false);
}

/**
 * Usage:  mouse.key();
 * Desc:   Sends keyboard event to press a key
 * Before: mouse is an initialized macmouse
 * After:  keyboard event has been sent to press a key
 */
var key = function(key) {
    modifierKey(key, false, false);
}


/**
 * Usage:  mouse.quit();
 * Desc:   Does garbage collection some on objective c stuff, be a good lad and call this when 
 *         you're done using the macmouse module
 * Before: mouse is an initialized macmouse
 * After:  mouse is an uninitialized macmouse
 */
var quit = function() {
    pool('drain');
}

module.exports = {
    init: init,
    getRealPos: getRealPos,
    getPos: getPos,
    Place: Place,
    DragPlace: DragPlace,
    Move: Move,
    DragMove: DragMove,
    LeftButtonPress: LeftButtonPress,
    LeftButtonRelease: LeftButtonRelease,
    RightButtonPress: RightButtonPress,
    RightButtonRelease: RightButtonRelease,
    doubleClick: doubleClick,
    cmdKey: cmdKey,
    shiftKey: shiftKey,
    modifierKey: modifierKey,
    key: key,
    quit: quit
}
