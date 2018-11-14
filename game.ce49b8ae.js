// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/brain.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BrainFSM =
/** @class */
function () {
  function BrainFSM() {
    this.stack = [];
  }

  Object.defineProperty(BrainFSM.prototype, "currentStateFunction", {
    get: function get() {
      return this.getCurrentState();
    },
    enumerable: true,
    configurable: true
  });

  BrainFSM.prototype.update = function (who, dt) {
    if (this.currentStateFunction != null) {
      this.first = this.justSetState;
      this.time += this.first ? 0 : dt;
      this.justSetState = false;
      this.currentStateFunction(who, dt);
    }
  };

  BrainFSM.prototype.popState = function () {
    return this.stack.pop();
  };

  BrainFSM.prototype.pushState = function (state) {
    if (this.getCurrentState() != state) {
      this.state = state.constructor.name;
      this.time = 0;
      this.justSetState = true;
      this.stack.push(state);
    }
  };

  BrainFSM.prototype.getCurrentState = function () {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  };

  BrainFSM.prototype.is = function (state) {
    return this._currentStateFunction === state;
  };

  BrainFSM.prototype.isIn = function () {
    var _this = this;

    var states = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      states[_i] = arguments[_i];
    }

    return states.some(function (s) {
      return _this.is(s);
    });
  };

  return BrainFSM;
}();

exports.BrainFSM = BrainFSM;
},{}],"src/helper.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Helper =
/** @class */
function () {
  function Helper() {}

  Helper.getSpawnPoint = function (arr) {
    var _spawn = this.spawnUsed;

    if (_spawn == arr.length) {
      _spawn = 0;
      this.spawnUsed = 0;
    } else {
      this.spawnUsed++;
    }

    console.log("Used spawn point n\xB0 " + this.spawnUsed);
    return arr[_spawn];
  };

  Helper.getBotsName = function (arr) {
    var _spawn = this.botsNameIndex;

    if (_spawn == arr.length) {
      _spawn = 0;
      this.botsNameIndex = 0;
    } else {
      this.botsNameIndex++;
    }

    return arr[_spawn];
  };

  Helper.calculateAngle = function (cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    // if (theta < 0) theta = 360 + theta; // range [0, 360)
    //if (theta < 0) theta = Math.PI + theta; // range [0, 360)

    return theta;
  };

  Helper.calculateDistance = function (obj1, obj2) {
    var tx = obj1.x - obj2.x,
        ty = obj1.y - obj2.y,
        dist = Math.sqrt(tx * tx + ty * ty);
    return dist;
  };

  Helper.randomElementInArray = function (items) {
    return items[Math.floor(Math.random() * items.length)];
  }; // Returns a random integer between min (include) and max (include)


  Helper.randBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Helper.rand = function (min, max) {
    return Math.floor(Helper.randf(min, max));
  };

  Helper.randf = function (min, max) {
    if (max == null) {
      max = min || 1;
      min = 0;
    }

    return Math.random() * (max - min) + min;
  };

  Helper.randOneIn = function (max) {
    if (max === void 0) {
      max = 2;
    }

    return Helper.rand(0, max) === 0;
  };

  Helper.circleCollision = function (circle1, circle2) {
    var x = circle1.x - circle2.x;
    var y = circle1.y - circle2.y;
    var distance = Math.sqrt(x * x + y * y);
    return distance < circle1.r + circle2.r ? true : false;
  }; // https://yal.cc/rectangle-circle-intersection-test/
  // https://gist.github.com/vonWolfehaus/5023015


  Helper.circleRectangleCollision = function (circle, rectangle) {
    // limits value to the range min..max
    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    } // Find the closest point to the circle within the rectangle
    // Assumes axis alignment! ie rect must not be rotated


    var closestX = clamp(circle.x, rectangle.x, rectangle.x + rectangle.width);
    var closestY = clamp(circle.y, rectangle.y, rectangle.y + rectangle.height); // Calculate the distance between the circle's center and this closest point

    var distanceX = circle.x - closestX;
    var distanceY = circle.y - closestY; // If the distance is less than the circle's radius, an intersection occurs

    var distanceSquared = distanceX * distanceX + distanceY * distanceY;
    return distanceSquared < circle.r * circle.r;
  }; // https://www.emanueleferonato.com/2007/04/28/create-a-flash-artillery-game-step-1/
  // https://www.safaribooksonline.com/library/view/html5-canvas/9781449308032/ch05s03.html


  Helper.getBotsPreferences = function () {
    var preferences = [
    /* 'Rifle',  */
    'Shotgun', 'Plasma', 'Rocket', 'Railgun'];
    var weights = [0.22, 0.24, 0.27, 0.26];

    function generateWeighedList(list, weights) {
      var weighed_list = []; // Loop over weights

      for (var i = 0; i < weights.length; i++) {
        var multiples = weights[i] * 100; // Loop over the list of items

        for (var j = 0; j < multiples; j++) {
          weighed_list.push(list[i]);
        }
      }

      return weighed_list;
    }

    ;
    var weighed_list = generateWeighedList(preferences, weights);
    var random_num = Helper.rand(0, weighed_list.length - 1);
    return weighed_list[random_num];
  }; // NEW Line drawing on a grid


  Helper.dot = function (x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
  };

  Helper.lerp = function (start, end, t) {
    return start + t * (end - start);
  };

  Helper.lerp_point = function (p0, p1, t) {
    return {
      x: Helper.lerp(p0.x, p1.x, t),
      y: Helper.lerp(p0.y, p1.y, t)
    };
  };

  Helper.diagonal_distance = function (p0, p1) {
    var dx = p1.x - p0.x,
        dy = p1.y - p0.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
  };

  Helper.round_point = function (p) {
    return {
      x: Math.round(p.x),
      y: Math.round(p.y)
    };
  };

  Helper.line = function (p0, p1) {
    var points = [];
    var N = Helper.diagonal_distance(p0, p1);

    for (var step = 0; step <= N; step++) {
      var t = N == 0 ? 0.0 : step / N;
      points.push(Helper.round_point(Helper.lerp_point(p0, p1, t)));
    }

    return points;
  };

  Helper.spawnUsed = 0;
  Helper.botsNameIndex = 0;
  return Helper;
}();

exports.Helper = Helper;
},{}],"src/entities/weapons.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WeaponsInventory =
/** @class */
function () {
  function WeaponsInventory() {
    this.weapons = [{
      name: 'Rifle',
      frequency: 200,
      count: 1,
      speed: 9,
      r: 2,
      color: 'black',
      ttl: 1000,
      explode: 0,
      spread: 0.1,
      damage: 5,
      // destroy: false,
      available: true,
      shotNumber: 100 // numero di colpi iniziale

    }, {
      name: 'Shotgun',
      frequency: 800,
      count: 6,
      speed: 9,
      r: 2,
      color: '#800000',
      ttl: 1000,
      explode: 0,
      spread: 0.5,
      damage: 10,
      // destroy: false,     // SE DISTRUGGE
      available: false,
      shotNumber: 0 // 60      // numero di colpi

    }, {
      name: 'Flamer',
      frequency: 25,
      count: 1,
      speed: 6,
      r: 4,
      color: '#FFA500',
      ttl: 500,
      explode: 0,
      spread: 1.5,
      damage: 1,
      //destroy: false,
      available: true,
      shotNumber: Infinity
    }, {
      name: 'Plasma',
      frequency: 150,
      count: 1,
      speed: 10,
      r: 3,
      color: 'blue',
      ttl: 1400,
      explode: 0,
      spread: 0.01,
      damage: 3,
      // destroy: false,
      available: false,
      shotNumber: 0 // 80   

    }, {
      name: 'Rocket',
      frequency: 1000,
      count: 1,
      speed: 8,
      r: 4,
      color: 'red',
      ttl: 1500,
      explode: 1,
      spread: 0.01,
      damage: 65,
      //destroy: true,
      available: false,
      shotNumber: 0 // 10      

    }, {
      name: 'Railgun',
      frequency: 2000,
      count: 1,
      speed: 16,
      r: 3,
      color: 'green',
      ttl: 1500,
      explode: 0,
      spread: 0.01,
      damage: 110,
      //destroy: false,
      available: false,
      shotNumber: 0 // 100

    }];
    this.weapon = 0;
    this.selectedWeapon = this.weapons[this.weapon];
  }

  WeaponsInventory.prototype.setWeapon = function (index) {
    this.selectedWeapon = this.weapons[index];
  }; // ora si prende l'arma + "in alto"
  // TODO: si prende in base a probabilità pesata delle preferenze del bot e alla disponibilità


  WeaponsInventory.prototype.getBest = function () {
    for (var i = this.weapons.length - 1; i >= 0; i--) {
      var item = this.weapons[i];

      if (item && item.available && item.shotNumber > 0) {
        this.selectedWeapon = this.weapons[i];
        break;
      }
    }
  }; // dopo un respawn le munizioni vengono azzerate 
  // e rimossa la disponibilità delle armi


  WeaponsInventory.prototype.resetWeapons = function () {
    for (var i = this.weapons.length - 1; i >= 0; i--) {
      var item = this.weapons[i];
      item.shotNumber = 0;
      item.available = false;
    }

    this.weapons[0].shotNumber = 100;
    this.weapons[0].available = true;
  }; // quando si colleziona un'arma e una cassa di munizioni


  WeaponsInventory.prototype.setAvailabilityAndNumOfBullets = function (name, numOfBullet) {
    for (var i = this.weapons.length - 1; i >= 0; i--) {
      var item = this.weapons[i];

      if (item.name == name) {
        item.shotNumber += numOfBullet;
        item.available = true;
      }
    }
  };

  WeaponsInventory.prototype.setNumOfBullets = function (name, numOfBullet) {
    for (var i = this.weapons.length - 1; i >= 0; i--) {
      var item = this.weapons[i];

      if (item.name == name) {
        item.shotNumber += numOfBullet;
      }
    }
  };

  return WeaponsInventory;
}();

exports.WeaponsInventory = WeaponsInventory;
},{}],"src/entities/enemies.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var brain_1 = require("../brain");

var helper_1 = require("../helper");

var weapons_1 = require("./weapons");

var Enemy =
/** @class */
function () {
  function Enemy() {}

  Enemy.prototype.init = function (main) {
    this.list = [];
    this.main = main;
    this.c = main.c;
    this.player = main.player;
    this.canvas = main.canvas;
    this.camera = main.camera;
    this.map = main.currentMap;
    this.bullet = main.bullet;
    this.ctx = main.ctx;
  };

  Enemy.prototype.create = function (x, y, num, team) {
    var bot = new Object();
    bot.brain = new brain_1.BrainFSM();
    bot.index = num;
    bot.name = helper_1.Helper.getBotsName(this.c.ENEMY_NAMES);
    bot.x = x || 75;
    bot.y = y || 50;
    bot.r = this.c.ENEMY_RADIUS;
    bot.old_x = x;
    bot.old_y = y;
    bot.velX = 0;
    bot.velY = 0;
    bot.alive = true;
    bot.speed = this.c.ENEMY_SPEED;
    bot.angleWithTarget = 0;
    bot.hp = this.c.ENEMY_HP;
    bot.ap = this.c.ENEMY_AP;
    bot.team = team; // bot.preferences= Helper.getBotsPreferences();

    bot.damage = 1; // è per il moltiplicatore del danno (quad = 4)

    bot.kills = 0;
    bot.numberOfDeaths = 0;
    bot.target = {};
    bot.aggression = Math.random() * 1 / 3 + 2 / 3;
    bot.targetItem = {};
    bot.trails = [];
    this.list[this.list.length] = bot;
    bot.brain.pushState(this.spawn.bind(this));
    bot.weaponsInventory = new weapons_1.WeaponsInventory();
    bot.currentWeapon = bot.weaponsInventory.selectedWeapon; // arma corrente

    bot.attackCounter = 0;
    bot.path = [];
    return bot;
  };

  ;

  Enemy.prototype.respawn = function (bot) {
    var _this = this;

    var spawn = helper_1.Helper.getSpawnPoint(this.main.data.spawn);
    console.log("BOT " + bot.index + " is swawning at " + spawn.x + " - " + spawn.y);
    bot.x = spawn.x;
    bot.y = spawn.y;
    bot.old_x = spawn.x;
    bot.old_y = spawn.y;
    bot.r = this.c.ENEMY_RADIUS;
    bot.velX = 0;
    bot.velY = 0;
    bot.speed = this.c.ENEMY_SPEED; // è uguale in tutte le direzioni

    bot.damage = 1; // è il moltiplicatore del danno (quad = 4)

    bot.angleWithTarget = 0; // angolo tra asse x e precedente target

    bot.hp = this.c.PLAYER_HP; // punti vita

    bot.ap = this.c.PLAYER_AP; // punti armatura

    bot.alive = true; // il bot è nuovamente presente in gioco
    // this.kills = 0;				// si mantengono...
    // this.numberOfDeaths = 0;	    // si mantengono...

    bot.target = {};
    bot.targetItem = {};
    bot.trails = [];
    var amplitude = 100;
    setTimeout(function () {
      for (var i = 0; i < 100; i++) {
        var beta = _this.main.lastRender + i * 20 + +Math.PI / 2;
        var respawnParticles = {};
        respawnParticles.x = bot.x + Math.cos(beta) * helper_1.Helper.randBetween(0, amplitude);
        respawnParticles.y = bot.y + Math.sin(beta) * helper_1.Helper.randBetween(0, amplitude);

        _this.main.particelle.create(respawnParticles.x, respawnParticles.y, 0.5, 0.5, 6, helper_1.Helper.randomElementInArray(bot.team != 'team1' ? _this.c.ENEMY_RESPAWN : _this.c.PLAYER_RESPAWN));
      }
    }, 150); //  WEAPONS

    bot.attackCounter = 0;
    bot.weaponsInventory.resetWeapons(); // munizioni e disponibilità default

    bot.weaponsInventory.setWeapon(0); // arma default

    bot.currentWeapon = bot.weaponsInventory.selectedWeapon; // arma corrente

    bot.path = []; // PATHFINDING

    bot.brain.pushState(this.spawn.bind(this)); // AI
  };

  Enemy.prototype.getBotColour = function (bot) {
    if (bot.speed > 5 / 16) {
      return 'yellow';
    }

    if (bot.damage > 1) {
      return 'violet';
    }

    return bot.team != 'team1' ? this.c.ENEMY_COLOUR_INSIDE : this.c.PLAYER_COLOUR_INSIDE;
  };

  Enemy.prototype.render = function () {
    for (var i = this.list.length - 1; i >= 0; i--) {
      var bot = this.list[i];

      if (bot.alive) {
        var pointerLength = this.c.ENEMY_RADIUS;
        var intersX = bot.x - this.camera.x + pointerLength * Math.cos(bot.angleWithTarget);
        var intersY = bot.y - this.camera.y + pointerLength * Math.sin(bot.angleWithTarget); // trails

        for (var i_1 = 0; i_1 < bot.trails.length; i_1++) {
          var ratio = (i_1 + 1) / bot.trails.length;
          this.ctx.beginPath();
          this.ctx.arc(bot.trails[i_1].x - this.camera.x, bot.trails[i_1].y - this.camera.y, ratio * bot.r * (3 / 5) + bot.r * (2 / 5), 0, 2 * Math.PI, true);
          this.ctx.fillStyle = this.ctx.fillStyle = "rgb(127, 134, 135," + ratio / 2 + ")";
          this.ctx.fill();
        } // draw the WEAPON !!


        this.ctx.beginPath();
        this.ctx.arc(intersX, intersY, 4, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = bot.currentWeapon.color;
        this.ctx.fill(); // draw the colored region

        this.ctx.beginPath();
        this.ctx.arc(bot.x - this.camera.x, bot.y - this.camera.y, bot.r, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = this.getBotColour(bot);
        this.ctx.fill(); // draw the stroke

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = bot.team != 'team1' ? this.c.ENEMY_COLOUR_OUTSIDE : this.c.PLAYER_COLOUR_OUTSIDE;
        this.ctx.stroke(); // beccuccio arma

        this.ctx.strokeStyle = bot.team != 'team1' ? this.c.ENEMY_COLOUR_OUTSIDE : this.c.PLAYER_COLOUR_OUTSIDE;
        this.ctx.beginPath();
        this.ctx.moveTo(bot.x - this.camera.x, bot.y - this.camera.y);
        this.ctx.lineTo(intersX, intersY);
        this.ctx.stroke();

        if (this.main.debug) {
          this.ctx.font = 'bold 8px/1 Arial';
          this.ctx.fillStyle = 'white';
          this.ctx.fillText(bot.hp.toString(), bot.x - this.camera.x - 5, bot.y - this.camera.y);
          this.ctx.fillStyle = 'black';
          this.ctx.fillText(bot.index.toString(), bot.x - this.camera.x - 25, bot.y - this.camera.y - 16);
          this.ctx.fillText(bot.target && bot.target.index ? bot.target.index.toString() : '', bot.x - this.camera.x + 6, bot.y - this.camera.y + 20);
          this.ctx.fillText(bot.target && bot.target.dist ? bot.target.dist.toString() : '', bot.x - this.camera.x + 22, bot.y - this.camera.y + 36);
          this.ctx.fillText(bot && bot.aggression ? bot.aggression.toFixed(2).toString() : '', bot.x - this.camera.x + 22, bot.y - this.camera.y + 20);
          this.ctx.fillText(bot.targetItem && bot.targetItem.index ? bot.targetItem.index.toString() : '', bot.x - this.camera.x + 10, bot.y - this.camera.y - 20);
          this.ctx.fillText(bot.status, bot.x - this.camera.x - 25, bot.y - this.camera.y + 20);
        }
      }
    }
  };

  Enemy.prototype.getRandomDirection = function (bot) {
    return helper_1.Helper.randomElementInArray([bot.velX, -bot.velY, bot.velY, -bot.velX]);
  };

  Enemy.prototype.isLavaOrToxic = function (bot, x, y) {
    var _this = this;

    var fy = Math.floor(y / this.c.TILE_SIZE);
    var fx = Math.floor(x / this.c.TILE_SIZE);
    var cy = Math.ceil(y / this.c.TILE_SIZE);
    var cx = Math.ceil(x / this.c.TILE_SIZE);

    if (
    /* fx || fy|| cy|| cx */
    this.map.map[fy][fx] == 3 || this.map.map[fy][cx] == 3 || this.map.map[cy][fx] == 3 || this.map.map[cy][cx] == 3 || this.map.map[fy][fx] == 4 || this.map.map[fy][cx] == 4 || this.map.map[cy][fx] == 4 || this.map.map[cy][cx] == 4) {
      bot.hp -= 0.5;

      for (var j = 0; j < 24; j++) {
        this.main.particelle.create(bot.x + helper_1.Helper.randBetween(-bot.r, bot.r), bot.y + helper_1.Helper.randBetween(-bot.r, bot.r), Math.random() * 2 - 2, Math.random() * 2 - 2, 2, helper_1.Helper.randomElementInArray(this.c.FIRE_IN_LAVA));
      }

      if (bot.hp <= 0) {
        bot.alive = false;
        bot.numberOfDeaths++;

        for (var b = 0; b < 36; b++) {
          this.main.blood.create(bot.x, bot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS); // crea il sangue
        }

        console.log("Bot killed by lava.");
        setTimeout(function () {
          _this.respawn(bot);
        }, this.c.GAME_RESPAWN_TIME);
      }
    }
  };

  Enemy.prototype.storePosForTrail = function (bot) {
    // push an item
    bot.trails.push({
      x: bot.x,
      y: bot.y
    }); //get rid of first item

    if (bot.trails.length > this.c.MOTION_TRAILS_LENGTH) {
      bot.trails.shift();
    }
  };

  Enemy.prototype.checkCollision = function (bot) {
    // collisione con i muri
    if (bot.x - bot.old_x > 0 && this.main.currentMap.map[Math.floor(bot.y / this.c.TILE_SIZE)][Math.floor((bot.x + bot.r) / this.c.TILE_SIZE)] == 1) {
      bot.x = bot.old_x;
    }

    if (bot.x - bot.old_x < 0 && this.main.currentMap.map[Math.floor(bot.y / this.c.TILE_SIZE)][Math.floor((bot.x - bot.r) / this.c.TILE_SIZE)] == 1) {
      bot.x = bot.old_x;
    }

    if (bot.y - bot.old_y > 0 && this.main.currentMap.map[Math.floor((bot.y + bot.r) / this.c.TILE_SIZE)][Math.floor(bot.x / this.c.TILE_SIZE)] == 1) {
      bot.y = bot.old_y;
    }

    if (bot.y - bot.old_y < 0 && this.main.currentMap.map[Math.floor((bot.y - bot.r) / this.c.TILE_SIZE)][Math.floor(bot.x / this.c.TILE_SIZE)] == 1) {
      bot.y = bot.old_y;
    } // Collisione con il target

    /* if (bot.target && Helper.circleCollision(bot, bot.target)) {
        bot.y += bot.old_y;
        bot.x += bot.old_x;
    } */


    this.storePosForTrail(bot);
  }; // SOURCE: https://www.redblobgames.com/grids/line-drawing.html


  Enemy.prototype.checkIfIsSeen2 = function (p0, p1) {
    var points = helper_1.Helper.line(p0, p1);
    var output = true;

    for (var i = 0; i < points.length; i += 3) {
      // STEP DI 2 PER RIDURRE I CICLI...
      var ele = points[i];

      if (this.map.map[Math.floor(ele.y / this.c.TILE_SIZE)][Math.floor(ele.x / this.c.TILE_SIZE)] == 1) {
        output = false;
        break;
      }
    }

    return output;
  };
  /* -------------------------------------------------------------------------------------- */


  Enemy.prototype.update = function (dt, timestamp) {
    for (var i = this.list.length - 1; i >= 0; i--) {
      var bot = this.list[i];

      if (bot.alive) {
        bot.brain.update(bot, dt);
        this.isLavaOrToxic(bot, bot.x, bot.y);
        this.checkCollision(bot);
      }
    }
  };

  Enemy.prototype.spawn = function (bot, dt) {
    bot.status = 'spawn';
    var opponentData = this.getNearestVisibleEnemy(bot, this.main.actors); // const power_best = this.getNearestPowerup(bot, this.main.powerup.list);
    // const waypoint_best = this.getNearestWaypoint(bot, this.main.waypoints.list);
    // bot.targetItem = power_best || waypoint_best;

    bot.target = opponentData.elem;

    if (bot.target && bot.target.alive) {
      if (bot.currentWeapon.shotNumber < 1) {
        bot.weaponsInventory.getBest();
        bot.currentWeapon = bot.weaponsInventory.selectedWeapon; // arma corrente
      }

      bot.brain.pushState(this.chaseTarget.bind(this));
    } else if (bot.targetItem) {
      bot.brain.pushState(this.wander.bind(this));
    }
  };

  Enemy.prototype.chaseTarget = function (bot, dt) {
    bot.status = 'chasing';
    bot.angleWithTarget = helper_1.Helper.calculateAngle(bot.x, bot.y, bot.target.x, bot.target.y);

    if (bot.target && bot.target.alive && this.checkIfIsSeen2(bot.target, bot)) {
      var tx = bot.target.x - bot.x,
          ty = bot.target.y - bot.y,
          dist = Math.sqrt(tx * tx + ty * ty);
      bot.old_x = bot.x;
      bot.old_y = bot.y; // da 350 a 225 ci si avvicina al target

      if (dist > 250
      /* && bot.aggression>0.55 || dist > 225 && bot.hp>40 */
      ) {
          bot.velX = tx / dist;
          bot.velY = ty / dist;
        }

      if (dist > 100 && dist < 250) {
        // comportamento random
        bot.velX = Math.random() < 0.95 ? bot.velX : this.getRandomDirection(bot);
        bot.velY = Math.random() < 0.95 ? bot.velY : this.getRandomDirection(bot);
      }

      if (dist < 100
      /* && bot.aggression < 0.95 */
      ) {
          // retreat
          bot.velX = -(tx / dist);
          bot.velY = -(ty / dist);
        }
      /* else{
        bot.velX =  -(ty / dist) * Math.cos(bot.angleWithTarget);
        bot.velY = -(tx / dist) * Math.sin(bot.angleWithTarget);
      } */


      bot.x += bot.velX * bot.speed * dt;
      bot.y += bot.velY * bot.speed * dt;
      this.shot(bot, dist, dt);
    } else {
      // bot.brain.popState();
      bot.brain.pushState(this.spawn.bind(this));
    }
  };

  Enemy.prototype.shot = function (bot, dist, dt) {
    if (dist < 350 && this.checkIfIsSeen2(bot.target, bot)) {
      // SE non troppo lontano e visibile SPARA!
      if (bot.currentWeapon.shotNumber > 0) {
        // se l'arma ha proiettili
        var now = Date.now();
        if (now - bot.attackCounter < bot.currentWeapon.frequency) return;
        bot.attackCounter = now; // bullet prediction ->how well bots are aiming!!

        var predvX = (bot.target.x - bot.target.old_x) / (bot.target.speed * dt) / (bot.speed * dt);
        var predvY = (bot.target.y - bot.target.old_y) / (bot.target.speed * dt) / (bot.speed * dt);
        var vX = bot.target.x - bot.x;
        var vY = bot.target.y - bot.y;
        var dist_1 = Math.sqrt(vX * vX + vY * vY); // si calcola la distanza

        vX = vX / dist_1 + predvX; // si normalizza e si calcola la direzione

        vY = vY / dist_1 + predvY;

        for (var i = bot.currentWeapon.count; i >= 0; i--) {
          this.bullet.create(bot.x, bot.y, vX, vY, 'enemy', bot.index, bot.damage, bot.currentWeapon);
          bot.currentWeapon.shotNumber--;
        }
      } else {
        bot.weaponsInventory.getBest();
        bot.currentWeapon = bot.weaponsInventory.selectedWeapon; // arma corrente
      }
    } else {
      // bot.targetItem = bot.target;    // ???
      bot.brain.pushState(this.wander.bind(this));
    }
  }; // TODO: https://stackoverflow.com/questions/24378155/random-moving-position-for-sprite-image


  Enemy.prototype.wander = function (bot, dt) {
    bot.status = 'wander';
    var opponentData = this.getNearestVisibleEnemy(bot, this.main.actors);
    bot.target = opponentData.elem;

    if (bot.target && bot.target.alive) {
      if (bot.currentWeapon.shotNumber < 1) {
        bot.weaponsInventory.getBest();
        bot.currentWeapon = bot.weaponsInventory.selectedWeapon; // arma corrente
      }

      bot.brain.pushState(this.chaseTarget.bind(this)); // se non si ha un target si va alla ricerca dei powerup
    } else {
      bot.attackCounter = 0;
      bot.angleWithTarget = 0;
      var power_best = this.getNearestPowerup(bot, this.main.powerup.list);
      var waypoint_best = this.getNearestWaypoint(bot, this.main.waypoints.list);
      bot.targetItem =
      /* bot.targetItem.length>0? bot.targetItem : */
      power_best || waypoint_best; // o l'ultima aposizione del target o il powerup + vicino o il waypoint

      if (bot.alive && bot.targetItem) {
        this.collectPowerUps(bot, dt);
      } else {
        bot.brain.pushState(this.spawn.bind(this));
      }
    }
  }; // trova quello con la distanza minore


  Enemy.prototype.getNearestPowerup = function (origin, data) {
    var output = {
      dist: 10000
    }; // elemento + vicino ad origin

    data = data.filter(function (elem) {
      return elem.visible == true;
    }); //  si esclude quelli non visibili (quelli già presi!)
    // data = data.filter((e:any)=>this.checkIfIsSeen2(origin, e))   // se non sono visibili si va con i waypoint...

    data = data.forEach(function (e) {
      var distanza = helper_1.Helper.calculateDistance(origin, e);

      if (output.dist > distanza && distanza < 400) {
        output = {
          dist: distanza,
          elem: e
        };
      }
    });
    return output.elem;
  }; // DA PROVARE CON UN NUOVO STATO!

  /* getNearestWaypoint(bot: any, data: any) {
      let  dist:number = 10000 ; // elemento + vicino ad bot
      let result:any =[];
      data
          .filter((elem: any) => elem[bot.index].visible == true) // solo quelli non ancora attraversati dallo specifico bot
          //.filter((e:any)=>this.checkIfIsSeen2(bot, e))       // può essere anche più vicino ma se è dall'altra parte del muro ?!?!
          .forEach((e: any) => {
              let distanza = Helper.calculateDistance(bot, e);
              if (dist > distanza && distanza < 400) {
                  dist = distanza;
                  result.push({ dist: distanza, elem: e });
              }
          });
      if(result.length==0){
          return null;
      } else if(result.length==1){
          return result[0].elem;
      }else{
          return Math.random()<0.95? result[result.length-1].elem:result[result.length-2].elem;
      }
  } */


  Enemy.prototype.getNearestWaypoint = function (bot, data) {
    var output = {
      dist: 10000
    }; // elemento + vicino ad bot

    data.filter(function (elem) {
      return elem[bot.index].visible == true;
    }) // solo quelli non ancora attraversati dallo specifico bot
    //.filter((e:any)=>this.checkIfIsSeen2(bot, e))       // può essere anche più vicino ma se è dall'altra parte del muro ?!?!
    .forEach(function (e) {
      var distanza = helper_1.Helper.calculateDistance(bot, e);

      if (output.dist > distanza && distanza < 400) {
        output = {
          dist: distanza,
          elem: e
        };
      }
    });
    return output.elem;
  };

  Enemy.prototype.getNearestVisibleEnemy = function (origin, actors) {
    var _this = this;

    var output = {
      dist: 10000
    }; // elemento + vicino ad origin

    actors.filter(function (elem) {
      return elem.index !== origin.index && elem.alive && elem.team != origin.team;
    }) // si esclude se stessi, quelli morti e quelli dell'altro team
    .filter(function (e) {
      return _this.checkIfIsSeen2(origin, e);
    }) // si escludono quelli non visibili
    .forEach(function (e) {
      var distanza = helper_1.Helper.calculateDistance(origin, e);

      if (output.dist > distanza && distanza < 350) {
        output = {
          dist: distanza,
          elem: e
        };
      }
    });
    return output;
  };

  Enemy.prototype.collectPowerUps = function (bot, dt) {
    if (bot.brain.first) {
      // console.log(`Si calcola il path per: ${bot.index}`);
      // al 1° giro si calcola il percorso
      this.findPath(bot);
    } else {
      // dal 2° in poi si 
      this.followPath(bot, dt);
    }
  };

  Enemy.prototype.findPath = function (bot) {
    var _this = this; // Calculate the path-finding path


    var map = this.main.currentMap;
    var s = map.pixelToMapPos(bot);
    var d = map.pixelToMapPos(bot.targetItem);
    var start = performance.now();
    this.main.easystar.findPath(s.x, s.y, d.x, d.y, function (path) {
      if (path === null) {// console.log("Path was not found.");
      } else {
        //console.log(`Path of bot ${bot.index} was found. First Point is ${path[0].x} ${path[0].y} `);
        bot.path = path || [];
        var end = performance.now(); //console.log(`Pathfinding took ${end - start} ms for bot ${bot.index}`);

        _this.followPath(bot, 16);
      }
    });
    this.main.easystar.calculate();
  };

  Enemy.prototype.followPath = function (bot, dt) {
    var map = this.main.currentMap; // Move along the path

    if (!bot.path.length) {
      return;
    }

    var cell = bot.path[0];
    var cellx = cell.x * map.tileSize + map.tileSize / 2;
    var celly = cell.y * map.tileSize + map.tileSize / 2;
    bot.angleWithTarget = helper_1.Helper.calculateAngle(bot.x, bot.y, cellx, celly); // We need to get the distance

    var tx = cellx - bot.x,
        ty = celly - bot.y,
        dist = Math.sqrt(tx * tx + ty * ty);

    if (dist != 0) {
      bot.velX = tx / dist;
      bot.velY = ty / dist;
      bot.old_x = bot.x;
      bot.old_y = bot.y;
      bot.x += bot.velX * bot.speed * dt;
      bot.y += bot.velY * bot.speed * dt;
    } // if finished move to the next path element


    if (dist < 3) {
      bot.path = bot.path.slice(1);

      if (bot.path.length === 0) {
        // this.findPath(bot);
        bot.brain.pushState(this.wander.bind(this));
      }
    }
  };

  return Enemy;
}();

exports.Enemy = Enemy;
},{"../brain":"src/brain.ts","../helper":"src/helper.ts","./weapons":"src/entities/weapons.ts"}],"src/entities/powerup.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helper_1 = require("../helper");

exports.tipiPowerUp = {
  'health': {
    name: 'health',
    hp: 5,
    color: 'DodgerBlue',
    r: 5,
    spawnTime: 30000
  },
  'megaHealth': {
    name: 'megaHealth',
    hp: 50,
    color: 'DodgerBlue',
    r: 10,
    spawnTime: 30000
  },
  'armour': {
    name: 'armour',
    ap: 5,
    color: 'green',
    r: 5,
    spawnTime: 30000
  },
  'megaArmour': {
    name: 'megaArmour',
    ap: 50,
    color: 'green',
    r: 10,
    spawnTime: 30000
  },
  'quad': {
    name: 'quad',
    multiplier: 4,
    color: 'violet',
    r: 10,
    spawnTime: 30000,
    enterAfter: 60000,
    duration: 10000
  },
  'speed': {
    name: 'speed',
    multiplier: 1.5,
    color: 'yellow',
    r: 10,
    spawnTime: 30000,
    enterAfter: 30000,
    duration: 10000
  },
  'ammoRifle': {
    for: 'Rifle',
    color: 'brown',
    r: 8,
    spawnTime: 30000,
    amount: 30
  },
  'ammoShotgun': {
    for: 'Shotgun',
    color: 'brown',
    r: 8,
    spawnTime: 30000,
    amount: 24
  },
  'ammoPlasma': {
    for: 'Plasma',
    color: 'blue',
    r: 8,
    spawnTime: 30000,
    amount: 25
  },
  'ammoRocket': {
    for: 'Rocket',
    color: 'red',
    r: 8,
    spawnTime: 30000,
    amount: 5
  },
  'ammoRailgun': {
    for: 'Railgun',
    color: 'green',
    r: 8,
    spawnTime: 30000,
    amount: 5
  },
  'weaponShotgun': {
    for: 'Shotgun',
    color: 'brown',
    r: 16,
    spawnTime: 30000,
    amount: 24
  },
  'weaponPlasma': {
    for: 'Plasma',
    color: 'blue',
    r: 16,
    spawnTime: 30000,
    amount: 25
  },
  'weaponRocket': {
    for: 'Rocket',
    color: 'red',
    r: 16,
    spawnTime: 30000,
    amount: 5
  },
  'weaponRailgun': {
    for: 'Railgun',
    color: 'green',
    r: 16,
    spawnTime: 30000,
    amount: 5
  }
};

var PowerUp =
/** @class */
function () {
  function PowerUp() {
    this.list = [];
    this.pool = [];
  }

  PowerUp.prototype.init = function (main) {
    this.list = [];
    this.main = main;
    this.c = main.c;
    this.player = main.player;
    this.bots = main.enemy;
    this.ctx = main.ctx;
    this.particelle = main.particelle;
  };

  PowerUp.prototype.create = function (x, y, type, index) {
    var powerup = this.pool.length > 0 ? this.pool.pop() : new Object();
    powerup.type = exports.tipiPowerUp[type];
    powerup.index = index;
    powerup.x = x;
    powerup.y = y;

    if (type.startsWith('ammo') || type.startsWith('weapon')) {
      powerup.ref = type; // permette di distinguere tra bullet e weapons

      powerup.amount = powerup.type.amount; // quanti bullet

      powerup.for = powerup.type.for; // per quale arma
    }

    powerup.reloadRate = 0;
    powerup.spawnTime = powerup.type.spawnTime; // tempo impiegato per respawn

    if (powerup.type.name == 'quad' || powerup.type.name == 'speed') {
      powerup.visible = false;
      powerup.enterAfter = powerup.type.enterAfter; // delay di entrata

      powerup.durationRate = 0; // indica il contatore della durata

      powerup.duration = powerup.type.duration; // eventuale durata dell'effetto

      powerup.takenBy = {}; // indica chi l'o sta utilizzando
    } else {
      powerup.enterAfter = 0;
      powerup.visible = true;
    }

    powerup.r = powerup.type.r; // raggio esterno rotante

    powerup.r1 = powerup.type.r; // raggio interno dinamico

    powerup.color = powerup.type.color; // animazione SOURCE: https://stackoverflow.com/questions/20445357/canvas-rotate-circle-in-certain-speed-using-requestanimationframe

    powerup.startAngle = 2 * Math.PI;
    powerup.endAngle = Math.PI * 1.5;
    powerup.currentAngle = 0;
    powerup.angleForDinamicRadius = 0; // animazione del raggio dinamico

    this.list.push(powerup);
  };

  ;

  PowerUp.prototype.upgrade = function (powerup, who) {
    powerup.takenBy = who;

    if (powerup.type.name == 'health') {
      who.hp += powerup.type.hp;
    } else if (powerup.type.name == 'armour') {
      who.ap += powerup.type.ap;
    } else if (powerup.type.name == 'megaHealth') {
      who.hp += powerup.type.hp;
    } else if (powerup.type.name == 'megaArmour') {
      who.ap += powerup.type.ap;
    } else if (powerup.type.name == 'quad') {
      who.damage *= powerup.type.multiplier;
    } else if (powerup.type.name == 'speed') {
      who.speed *= powerup.type.multiplier;
    }
  };

  PowerUp.prototype.deupgrade = function (powerup) {
    if (powerup.type.name == 'regeneration') {
      console.log('TO DO!');
    } else if (powerup.type.name == 'speed') {
      powerup.takenBy.speed /= powerup.type.multiplier;
    } else if (powerup.type.name == 'quad') {
      powerup.takenBy.damage /= powerup.type.multiplier;
    }
  };

  PowerUp.prototype.update = function (dt, timestamp) {
    for (var i = this.list.length - 1; i >= 0; i--) {
      var powerup = this.list[i];
      powerup.currentAngle += dt * 0.004; // animazione del cerchio esterno...

      powerup.angleForDinamicRadius += 2 * Math.PI / 60; // animazione del raggio dinamico di 6° a frame
      /// reset angle

      powerup.currentAngle %= 2 * Math.PI;

      if (!powerup.visible) {
        powerup.reloadRate += dt; // si inizia a contare se non visibile
      } // se non è visibile e ha una durata inizia a contare la durata dell'effetto (quad, speed, etc)


      if (!powerup.visible && powerup.duration && powerup.startDurationRate) {
        powerup.durationRate += dt;
      } // si guarda se i powerup entrano in contatto con il player


      if (powerup.visible && helper_1.Helper.circleCollision(powerup, this.player)) {
        for (var j = 0; j < 10; j++) {
          // TODO: cambiare effetto !!!
          this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 2, Math.random() * 2 - 2, 2, powerup.color);
        }

        powerup.visible = false;

        if (powerup.duration) {
          powerup.startDurationRate = true;
        }

        this.upgrade(powerup, this.player); // se AMMO o WEAPON

        if (powerup.ref) {
          if (powerup.ref.startsWith('weapon')) {
            this.player.weaponsInventory.setAvailabilityAndNumOfBullets(powerup.for, powerup.amount);
          } else {
            this.player.weaponsInventory.setNumOfBullets(powerup.for, powerup.amount);
          }
        }
      } // si guarda se i powerup entrano in contatto con qualche nemico


      for (var i_1 = this.bots.list.length - 1; i_1 >= 0; i_1--) {
        var bot = this.bots.list[i_1];

        if (powerup.visible && helper_1.Helper.circleCollision(powerup, bot)) {
          for (var j = 0; j < 12; j++) {
            this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 2, Math.random() * 2 - 2, 5, powerup.color);
          }

          powerup.visible = false;

          if (powerup.duration) {
            powerup.startDurationRate = true;
          }

          this.upgrade(powerup, bot); // se AMMO o WEAPON

          if (powerup.ref) {
            if (powerup.ref.startsWith('weapon')) {
              bot.weaponsInventory.setAvailabilityAndNumOfBullets(powerup.for, powerup.amount);
              bot.weaponsInventory.getBest();
              bot.currentWeapon = bot.weaponsInventory.selectedWeapon; // arma corrente
            } else {
              bot.weaponsInventory.setNumOfBullets(powerup.for, powerup.amount);
            }
          }
        }
      } // RESPAWN


      if (powerup.reloadRate > powerup.spawnTime + powerup.enterAfter) {
        // numero di cicli oltre il quale è nuovamente visibile
        powerup.visible = true;
        powerup.reloadRate = 0;
      } // FINE EFFETTO 


      if (powerup.durationRate > powerup.duration) {
        this.deupgrade(powerup); // FIXME: per ora è solo per il player...

        powerup.startDurationRate = false;
        powerup.durationRate = 0;
      }
    }
  };

  PowerUp.prototype.render = function () {
    for (var i = this.list.length - 1; i >= 0; i--) {
      var powerup = this.list[i]; // tutti i powerup tranne ammo e weapons

      if (powerup.visible && !powerup.ref) {
        // centro pulsante
        powerup.r1 = 2 + 0.1 + Math.sin(powerup.angleForDinamicRadius) * 2; // il sin va da -1 a +1

        var x = powerup.x - this.main.camera.x;
        var y = powerup.y - this.main.camera.y;
        this.ctx.beginPath();
        this.ctx.arc(x, y, powerup.r1, 0, 6.2832);
        this.ctx.fillStyle = powerup.color;
        this.ctx.fill();
        this.ctx.closePath(); // cerchio esterno

        this.ctx.beginPath();
        this.ctx.arc(x, y, powerup.r + 2.5, powerup.startAngle + powerup.currentAngle, powerup.endAngle + powerup.currentAngle, false);
        this.ctx.strokeStyle = powerup.color;
        this.ctx.lineWidth = 2.0;
        this.ctx.stroke();

        if (this.main.debug) {
          this.ctx.font = 'bold 8px/1 Arial';
          this.ctx.fillStyle = 'black';
          this.ctx.fillText(powerup.index.toString(), powerup.x - this.main.camera.x - 6, powerup.y - this.main.camera.y - 12);
        }
      }

      if (powerup.visible) {
        // AMMO e WEAPONS
        var x = powerup.x - this.main.camera.x;
        var y = powerup.y - this.main.camera.y;
        this.ctx.beginPath();
        this.ctx.arc(x, y, powerup.r, 0, 6.2832);
        this.ctx.fillStyle = powerup.color;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  };

  return PowerUp;
}();

exports.PowerUp = PowerUp;
},{"../helper":"src/helper.ts"}],"src/controller.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helper_1 = require("./helper");
/* import Game from './game'; */


var ControlHandler =
/** @class */
function () {
  function ControlHandler(main) {
    this.a = false;
    this.d = false;
    this.w = false;
    this.s = false;
    this.mouseLeft = false;
    this.mouseRight = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.back2Player = true;
    this.main = main;
    this.canvas = main.canvas;
    this.camera = main.camera;
    this.player = main.player;
    this.canvas.addEventListener('keydown', this.keyDownEvent.bind(this));
    this.canvas.addEventListener('keyup', this.keyUpEvent.bind(this));
    this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
    this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this));
    window.addEventListener('mousewheel', this.mouseWheelEvent.bind(this));
    window.addEventListener('DOMMouseScroll', this.mouseWheelEvent.bind(this));
  }

  ControlHandler.prototype.keyDownEvent = function (e) {
    if (e.keyCode == 87) {
      this.w = true;
    } else if (e.keyCode == 83) {
      this.s = true;
    } else if (e.keyCode == 65) {
      this.a = true;
    } else if (e.keyCode == 68) {
      this.d = true;
    } else if ((e.keyCode >= 48 || e.keyCode <= 57) && this.main.state == 'game') {
      this.player.hotKey(e.keyCode);
    }

    if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
      e.preventDefault();
      return false;
    }
  };

  ControlHandler.prototype.keyUpEvent = function (e) {
    if (e.keyCode == 87 || e.keyCode == 38) {
      this.w = false;
    } else if (e.keyCode == 83) {
      this.s = false;
    } else if (e.keyCode == 65) {
      this.a = false;
    } else if (e.keyCode == 66) {
      this.back2Player = !this.back2Player;
      this.followBot(this.back2Player);
    } else if (e.keyCode == 68) {
      this.d = false;
    } else if (e.keyCode == 71) {
      // g
      this.main.player.godMode = !this.main.player.godMode;
    } else if (e.keyCode == 73) {
      // i per debug
      this.main.debug = !this.main.debug;
    } else if (e.keyCode == 80) {
      if (!this.main.paused) {
        // se non è già in pausa...
        this.main.paused = !this.main.paused;

        if (this.main.paused) {
          this.main.loadPauseScreen(this.main);
        }
      }
    } else if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
      e.preventDefault();
      return false;
    }
  }; // permette di ciclare tra i bot


  ControlHandler.prototype.followBot = function (back) {
    var botIndex = helper_1.Helper.getBotsName(this.main.enemy.list.map(function (e) {
      return e.index;
    })); // FIXME: è usato sia per i nomi che per l'index

    var currentActorInCamera = back ? this.player : this.main.enemy.list[botIndex];
    this.main.camera.setCurrentPlayer(currentActorInCamera);
    this.main.camera.adjustCamera(currentActorInCamera);
  };

  ControlHandler.prototype.mouseDownEvent = function (e) {
    if (e.button == 0) {
      this.mouseLeft = true;
    } else if (e.button == 2) {
      this.mouseRight = true;
    }
  };

  ControlHandler.prototype.mouseUpEvent = function (e) {
    if (this.mouseLeft) {
      if (this.main.state == 'menuScreen') {
        // this.main.startGame();
        console.log(e);
      }

      if (this.main.paused) {
        this.main.paused = false;
      }

      if (this.main.state == 'statsScreen') {
        this.main.startGame();
      }
    }

    if (e.button == 0) {
      this.mouseLeft = false;
    } else if (e.button == 2) {
      this.mouseRight = false;
    }
  };

  ControlHandler.prototype.mouseMoveEvent = function (e) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left; // tra 0 e 800

    this.mouseY = e.clientY - rect.top; // tra 0 e 600
    // angolo tra il player e il mirino

    this.player.angle = helper_1.Helper.calculateAngle(this.player.x - this.camera.x, this.player.y - this.camera.y, this.mouseX, this.mouseY);
  };

  ControlHandler.prototype.mouseWheelEvent = function (e) {
    if (this.main.state == 'game') {
      this.player.wheel(e.wheelDelta ? e.wheelDelta : -e.detail);
      return true;
    }

    if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
      e.preventDefault();
      return false;
    }
  };

  ControlHandler.prototype.contextMenuEvent = function (e) {
    e.preventDefault();
  };

  return ControlHandler;
}();

exports.ControlHandler = ControlHandler;
},{"./helper":"src/helper.ts"}],"src/entities/player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helper_1 = require("../helper");

var weapons_1 = require("./weapons");

var Player =
/** @class */
function () {
  function Player() {
    this.score = 0; // numero di uccisioni

    this.trails = [];
    this.respawnTime = 0;
    this.godMode = false;
    this.attackCounter = 0; // frequenza di sparo
  }

  Player.prototype.init = function (main) {
    this.main = main;
    this.c = main.c;
    this.canvas = main.canvas;
    this.ctx = main.ctx;
    this.camera = main.camera;
    this.enemy = main.enemy;
    this.bullet = main.bullet;
    this.map = main.currentMap;
    this.control = main.control;
  };

  Player.prototype.createPlayer = function () {
    this.name = "Lorenzo";
    this.index = 100;
    this.alive = true; // 
    // const spawn = Helper.getSpawnPoint(this.main.data.spawn);

    this.x = 400;
    this.old_x = 400;
    this.y = 300;
    this.old_y = 300;
    this.team = 'team1'; //this.camera.adjustCamera(this);

    this.r = this.c.PLAYER_RADIUS;
    this.speed = this.c.PLAYER_SPEED; // è uguale in tutte le direzioni

    this.damage = 1; // danno da moltiplicare per 4 con quad damage

    this.angle = 0; // angolo tra asse x e puntatore del mouse

    this.hp = this.c.PLAYER_HP; // punti vita

    this.ap = this.c.PLAYER_AP; // punti armatura

    this.kills = 0; // uccisioni

    this.numberOfDeaths = 0; // numero di volte in cui è stato ucciso

    this.weaponsInventory = new weapons_1.WeaponsInventory();
    this.currentWeapon = this.weaponsInventory.selectedWeapon; // arma corrente
  };

  Player.prototype.storePosForTrail = function (x, y) {
    // push an item
    this.trails.push({
      x: x,
      y: y
    }); //get rid of first item

    if (this.trails.length > this.c.MOTION_TRAILS_LENGTH) {
      this.trails.shift();
    }
  };

  Player.prototype.hotKey = function (keyCode) {
    if (keyCode == 48) {
      keyCode = 58;
    }

    if (keyCode - 49 in this.weaponsInventory.weapons) {
      this.weaponsInventory.weapon = keyCode - 49; // se disponibile si sceglie

      if (this.weaponsInventory.weapons[this.weaponsInventory.weapon].available) {
        this.weaponsInventory.selectedWeapon = this.weaponsInventory.weapons[this.weaponsInventory.weapon];
        this.currentWeapon = this.weaponsInventory.selectedWeapon; // arma corrente
      }
    }
  };

  Player.prototype.wheel = function (delta) {
    if (delta > 0) {
      if (this.weaponsInventory.weapon <= 0) {
        this.weaponsInventory.weapon = this.weaponsInventory.weapons.length - 1;
      } else {
        this.weaponsInventory.weapon--;
      }
    } else {
      if (this.weaponsInventory.weapon >= this.weaponsInventory.weapons.length - 1) {
        this.weaponsInventory.weapon = 0;
      } else {
        this.weaponsInventory.weapon++;
      }
    } // se disponibile si sceglie


    if (this.weaponsInventory.weapons[this.weaponsInventory.weapon].available) {
      this.weaponsInventory.selectedWeapon = this.weaponsInventory.weapons[this.weaponsInventory.weapon];
      this.currentWeapon = this.weaponsInventory.selectedWeapon; // arma corrente
    }
  };

  Player.prototype.getPlayerColour = function () {
    if (this.speed > 4 / 16) {
      return 'yellow';
    }

    if (this.damage > 1) {
      return 'violet';
    }

    return this.c.PLAYER_COLOUR_INSIDE;
  };

  Player.prototype.render = function () {
    if (this.alive) {
      // solo se il player è vivo!
      // trails
      for (var i = 0; i < this.trails.length; i++) {
        var ratio = (i + 1) / this.trails.length;
        this.ctx.beginPath();
        this.ctx.arc(this.trails[i].x - this.camera.x, this.trails[i].y - this.camera.y, ratio * this.r * (3 / 5) + this.r * (2 / 5), 0, 2 * Math.PI, true);
        this.ctx.fillStyle = this.ctx.fillStyle = "rgb(127, 134, 135," + ratio / 2 + ")";
        this.ctx.fill();
      } // draw the colored region


      this.ctx.beginPath();
      this.ctx.arc(this.x - this.camera.x, this.y - this.camera.y, this.r, 0, 2 * Math.PI, true);
      this.ctx.fillStyle = this.getPlayerColour();
      this.ctx.fill(); // draw the stroke

      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = this.c.PLAYER_COLOUR_OUTSIDE;
      this.ctx.stroke(); // beccuccio arma

      this.ctx.strokeStyle = this.c.PLAYER_COLOUR_OUTSIDE;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - this.camera.x, this.y - this.camera.y);
      var pointerLength = 12.5;
      this.ctx.lineTo(this.x - this.camera.x + pointerLength * Math.cos(this.angle), this.y - this.camera.y + pointerLength * Math.sin(this.angle));
      this.ctx.stroke();

      if (this.main.debug) {
        this.ctx.font = 'bold 8px/1 Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.x.toFixed(2).toString(), this.x - this.camera.x - 5, this.y - this.camera.y - 15);
        this.ctx.fillText(this.y.toFixed(2).toString(), this.x - this.camera.x - 5, this.y - this.camera.y + 20);
      }
    }
  };

  Player.prototype.respawn = function (timestamp) {
    var _this = this;

    var spawn = helper_1.Helper.getSpawnPoint(this.main.data.spawn);
    console.log("Player is swawning at " + spawn.x + " - " + spawn.y);
    this.index = 100;
    this.x = spawn.x;
    this.y = spawn.y;
    this.camera.setCurrentPlayer(this);
    this.camera.adjustCamera(this);
    var amplitude = 100;
    setTimeout(function () {
      for (var i = 0; i < 100; i++) {
        var beta = timestamp + i * 20 + +Math.PI / 2;
        var respawnParticles = {};
        respawnParticles.x = _this.x + Math.cos(beta) * helper_1.Helper.randBetween(0, amplitude);
        respawnParticles.y = _this.y + Math.sin(beta) * helper_1.Helper.randBetween(0, amplitude);

        _this.main.particelle.create(respawnParticles.x, respawnParticles.y, 0.5, 0.5, 6, helper_1.Helper.randomElementInArray(_this.c.PLAYER_RESPAWN));
      }
    }, 150);
    this.r = this.c.PLAYER_RADIUS;
    this.speed = this.c.PLAYER_SPEED; // è uguale in tutte le direzioni

    this.damage = 1; // è il moltiplicatore del danno (quad = 4)

    this.angle = 0; // angolo tra asse x e puntatore del mouse

    this.hp = this.c.PLAYER_HP; // punti vita

    this.ap = this.c.PLAYER_AP; // punti armatura

    this.alive = true; // il player è nuovamente presente in gioco
    // this.kills = 0;					// si mantengono...
    // this.numberOfDeaths = 0;	    	// si mantengono...

    this.weaponsInventory.resetWeapons(); // munizioni e disponibilità default

    this.weaponsInventory.setWeapon(0); // arma default

    this.currentWeapon = this.weaponsInventory.selectedWeapon; // arma corrente
  }; // collisione tra elementi della stessa dimensione (tile e player)
  // SOURCE: https://codereview.stackexchange.com/questions/60439/2d-tilemap-collision-method


  Player.prototype.checkmove = function (x, y) {
    if (this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 1 || this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 1 || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 1 || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 1) {
      return false;
    } else {
      return true;
    }
  };

  Player.prototype.isLavaOrToxic = function (x, y) {
    if (this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 3 || this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 3 || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 3 || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 3 || this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 4 || this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 4 || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 4 || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 4) {
      this.hp -= 0.5;

      for (var j = 0; j < 24; j++) {
        this.main.particelle.create(this.x + helper_1.Helper.randBetween(-this.r, this.r), this.y + helper_1.Helper.randBetween(-this.r, this.r), Math.random() * 2 - 2, Math.random() * 2 - 2, 2, helper_1.Helper.randomElementInArray(this.c.FIRE_IN_LAVA));
      }

      if (this.hp <= 0) {
        this.alive = false;
        this.numberOfDeaths++;

        for (var b = 0; b < 36; b++) {
          this.main.blood.create(this.x, this.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS); // crea il sangue
        }

        var currentActorInCamera = this.enemy.list[0];
        this.main.camera.setCurrentPlayer(currentActorInCamera);
        this.main.camera.adjustCamera(currentActorInCamera); // setTimeout(() =>this.player.respawn(), this.c.GAME_RESPAWN_TIME);

        console.log("Player killed by lava.");
      }
    }
  };

  Player.prototype.collisionDetection = function (dt) {
    var _this = this;

    var spostamento = this.speed * dt;
    this.old_x = this.x;
    this.old_y = this.y;

    if (this.control.w) {
      // W 
      // collisione con nemici
      this.enemy.list.forEach(function (enemy) {
        if (enemy.alive && helper_1.Helper.circleCollision(enemy, _this)) {
          _this.y += 4 * spostamento;
        }
      });

      if (this.checkmove(this.x - this.r, this.y - this.r - spostamento)) {
        this.y -= spostamento;

        if (this.y - this.r < this.camera.y) {
          this.y = this.camera.y + this.r;
        }
      }
    }

    if (this.control.s) {
      // S
      // collisione con nemici
      this.enemy.list.forEach(function (enemy) {
        if (enemy.alive && helper_1.Helper.circleCollision(enemy, _this)) {
          _this.y -= 4 * spostamento;
        }
      });

      if (this.checkmove(this.x - this.r, this.y - this.r + spostamento)) {
        this.y += spostamento;

        if (this.y + this.r >= this.camera.y + this.camera.h) {
          this.y = this.camera.y + this.camera.h - this.r;
        }
      }
    }

    if (this.control.a) {
      // a
      // collisione con nemici
      this.enemy.list.forEach(function (enemy) {
        if (enemy.alive && helper_1.Helper.circleCollision(enemy, _this)) {
          _this.x += 4 * spostamento;
        }
      });

      if (this.checkmove(this.x - this.r - spostamento, this.y - this.r)) {
        this.x -= spostamento;

        if (this.x - this.r < this.camera.x) {
          this.x = this.camera.x + this.r;
        }
      }
    }

    if (this.control.d) {
      // d
      // collisione con nemici
      this.enemy.list.forEach(function (enemy) {
        if (enemy.alive && helper_1.Helper.circleCollision(enemy, _this)) {
          _this.y -= 4 * spostamento;
        }
      });

      if (this.checkmove(this.x - this.r + spostamento, this.y - this.r)) {
        this.x += spostamento;

        if (this.x + this.r >= this.map.mapSize.w) {
          this.x = this.camera.x + this.camera.w - this.r;
        }
      }
    }

    this.storePosForTrail(this.x, this.y);
  };

  Player.prototype.shoot = function (dt) {
    if (this.alive && this.currentWeapon.shotNumber > 0) {
      var now = Date.now();
      if (now - this.attackCounter < this.currentWeapon.frequency) return;
      this.attackCounter = now;
      var vX = this.control.mouseX - (this.x - this.camera.x);
      var vY = this.control.mouseY - (this.y - this.camera.y);
      var dist = Math.sqrt(vX * vX + vY * vY); // si calcola la distanza

      vX = vX / dist; // si normalizza

      vY = vY / dist;

      for (var i = this.currentWeapon.count - 1; i >= 0; i--) {
        this.bullet.create(this.x, this.y, vX, vY, 'player', this.index, this.damage, this.currentWeapon); // 8 è la velocità del proiettile

        this.currentWeapon.shotNumber--;
      }
    } else {
      // da valutare se prevederlo in automatico
      this.weaponsInventory.getBest();
      this.currentWeapon = this.weaponsInventory.selectedWeapon; // arma corrente
    }
  };

  Player.prototype.update = function (dt, timestamp) {
    if (this.alive) {
      this.isLavaOrToxic(this.x, this.y);
      this.collisionDetection(dt);

      if (this.control.mouseLeft) {
        // SE è PREMUTO IL btn del mouse
        this.shoot(dt);
      }
    }

    if (!this.alive) {
      this.respawnTime += dt;

      if (this.respawnTime > this.c.GAME_RESPAWN_TIME) {
        // numero di cicli oltre il quale è nuovamente visibile
        this.respawn(timestamp);
        this.respawnTime = 0;
      }
    }
  };

  return Player;
}();

exports.Player = Player;
},{"../helper":"src/helper.ts","./weapons":"src/entities/weapons.ts"}],"src/config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Config =
/** @class */
function () {
  function Config() {
    // CANVAS
    this.CANVAS_WIDTH = 800;
    this.CANVAS_HEIGHT = 600; // MAP

    this.TILE_SIZE = 25; // GAME

    this.GAME_KILLS_TO_WIN = 15;
    this.GAME_MATCH_DURATION = 300000; // in ms 

    this.GAME_BOTS_PER_MATCH = 5;
    this.GAME_RESPAWN_TIME = 5000; // in ms

    this.GAME_MATCH_TYPE = 'team'; // 'deathmatch'  // o team, ctf

    this.WAYPOINTS_TIMING = 8000; // HUD

    this.FONT_FAMILY = '"Segoe UI",Arial,sans-serif';
    this.HUD_BACKGROUND = "rgba(102, 136, 204, 0.5)"; // PLAYER

    this.PLAYER_SPEED = 3.5 / 16;
    this.PLAYER_RADIUS = 12.5;
    this.PLAYER_HP = 100;
    this.PLAYER_AP = 100;
    this.PLAYER_COLOUR_INSIDE = '#6688cc';
    this.PLAYER_COLOUR_OUTSIDE = '#4b58a0';
    this.PLAYER_RESPAWN = ['#808080', '#608feb', '#7da1ea', '#99b2e8', '#b4c4ea', '#cdd5ef', '#e6e6fa']; // Crimson, red, yellow, lightyellow
    // ENEMIES

    this.ENEMY_SPEED = 3.5 / 16;
    this.ENEMY_RADIUS = 12.5;
    this.ENEMY_HP = 100;
    this.ENEMY_AP = 100;
    this.ENEMY_STARTING_WEAPON = 'rifle';
    this.ENEMY_COLOUR_INSIDE = '#f90c00';
    this.ENEMY_COLOUR_OUTSIDE = '#bb0b00';
    this.ENEMY_NAMES = ['Ranger', 'Phobos', 'Mynx', 'Orbb', 'Sarge', 'Grunt', 'Hunter', 'Klesk', 'Slash', 'Anarki', 'Razor', 'Visor', 'Bones', 'Doom', 'Major', 'Xaero'];
    this.ENEMY_RESPAWN = ['#ff0000', '#eb0001', '#d60002', '#c40002', '#b10002', '#9d0002', '#8b0000']; // from red to darkred

    this.MOTION_TRAILS_LENGTH = 10; // BULLETS

    this.BULLET_RADIUS = 2.5;
    this.BULLET_DAMAGE = 5;
    this.BULLET_TTL = 1000; // DETRITI

    this.DEBRIS_COLOR = ['#800000', '#812314', '#823624', '#814734', '#7e5544', '#796556', '#727267']; // from maroon to #727267

    this.DEBRIS_RADIUS = 3; // SANGUE

    this.BLOOD_COLOUR = ['#ff0000', '#eb0001', '#d60002', '#c40002', '#b10002', '#9d0002', '#8b0000']; // from red to darkred

    this.BLOOD_RADIUS = 4; // WEAPONS

    this.FIRE_IN_LAVA = ['#ffffe0', '#fff1c4', '#ffe2a5', '#ffd587', '#ffc667', '#ffb541', '#ffa500']; // lightyellow, orange, #FFA500

    this.FIRE_EXPLOSION = ['#808080', '#ff6000', '#ff8811', '#ffab2b', '#ffcb4b', '#ffe878', '#ffffe0']; // Crimson, red, yellow, lightyellow
    // POWERUP

    this.POWERUP_RADIUS = 6;
    this.POWERUP_SPAWN_TIME = 30 * 1000;
  }

  return Config;
}();

exports.Config = Config;
/*
Poteva essere usato anche una classe con proprietà statiche:
https://medium.com/@haidermalik504/classes-in-typescript-ec5e75196201
*/

/*

    For colors: http://gka.github.io/chroma.js/#cubehelix-hue
    https://gka.github.io/palettes

*/
},{}],"src/camera.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Camera =
/** @class */
function () {
  function Camera() {}

  Camera.prototype.init = function (x, y, w, h, main) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 800;
    this.h = h || 600;
    this.currentPlayer = main.player;
    this.main = main;
    this.c = main.c;
    this.map = main.currentMap;
  }; // setta la telecamera sull'eventuale bot...


  Camera.prototype.setCurrentPlayer = function (player) {
    this.currentPlayer = player;
  };

  Camera.prototype.update = function (dt, timestamp) {
    // si evita di aggiornare la camera quando si arriva al bordo della mappa
    if (this.currentPlayer.x > this.w / 2 && this.currentPlayer.x < this.map.mapSize.w - this.w / 2) {
      this.x = this.currentPlayer.x - this.w / 2;
    }

    if (this.currentPlayer.y > this.h / 2 && this.currentPlayer.y < this.map.mapSize.h - this.h / 2) {
      this.y = this.currentPlayer.y - this.h / 2;
    }
  }; // adjust camera after respawn


  Camera.prototype.adjustCamera = function (actor) {
    if (actor.x > this.map.mapSize.w - this.c.CANVAS_WIDTH) {
      this.x = this.map.mapSize.w - this.c.CANVAS_WIDTH;
    }

    if (actor.x < this.c.CANVAS_WIDTH) {
      this.x = 0;
    }

    if (actor.y < this.c.CANVAS_HEIGHT) {
      this.y = 0;
    }

    if (actor.y > this.map.mapSize.h - this.c.CANVAS_HEIGHT) {
      this.y = this.map.mapSize.h - this.c.CANVAS_HEIGHT;
    }
  };

  return Camera;
}();

exports.Camera = Camera;
;
},{}],"src/maps/dm1.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoMap2 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 25, 0, 0, 0, 25, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], [1, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 11, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], [1, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 39, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 40, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 10, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 40, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 10, 0, 0, 0, 0, 40, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,, 1, 1, 1, 1, 1, 1], [1, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 29, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 1, 1, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 10, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 12, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 0, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 1, 1, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 10, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 1], [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 29, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 12, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 40, 0, 0, 0, 0, 0, 0, 34, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 24, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 40, 0, 0, 1, 1, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 40, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
},{}],"src/maps.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dm1_1 = require("./maps/dm1");

exports.types = [{
  id: 0,
  colour: '#ddd5d5',
  solid: 0
}, {
  id: 1,
  colour: '#868679',
  solid: 1
  /*// tile solida
  // ENVIRONMENT
  { id: 2, colour: '#ddd5d5', solid: 0, desc: 'SPAWN' },                            // spawn points
  { id: 3, colour: '#ddd5d5', solid: 0, desc: 'lava', damage: 1 },                  // lava
  { id: 4, colour: '#ddd5d5', solid: 0, desc: 'toxic water', damage: 1 },           // toxic water
  { id: 5, colour: '#ddd5d5', solid: 0, desc: 'water', friction: 1 },               //  water
  { id: 6, colour: '#ddd5d5', solid: 0, desc: 'portals', destination: {r:1,c:2} },  // portals
  { id: 7, colour: '#ddd5d5', solid: 0, desc: 'bounce pad', force: {x:1,y:2} },     // piattaforme di jump
  // POWERUPS
  { id: 10, colour: '#ddd5d5', solid: 0, desc: 'health' },
  { id: 11, colour: '#ddd5d5', solid: 0, desc: 'megaHealth' },
  { id: 12, colour: '#ddd5d5', solid: 0, desc: 'armour' },
  { id: 13, colour: '#ddd5d5', solid: 0, desc: 'megaArmour' },     // a tempo
  { id: 14, colour: '#ddd5d5', solid: 0, desc: 'quad damage' },    // a tempo
  { id: 15, colour: '#ddd5d5', solid: 0, desc: 'speed' },          // a tempo
  { id: 15, colour: '#ddd5d5', solid: 0, desc: 'regeneration' },   // a tempo
  // WEAPONS AMMO
  { id: 23, colour: '#ddd5d5', solid: 0, desc: 'ammo for Machine Gun/Rifle' },
  { id: 24, colour: '#ddd5d5', solid: 0, desc: 'ammo for Shotgun' },
  { id: 25, colour: '#ddd5d5', solid: 0, desc: 'ammo for Plasma Gun' },
  { id: 26, colour: '#ddd5d5', solid: 0, desc: 'ammo for ' },
  { id: 27, colour: '#ddd5d5', solid: 0, desc: 'ammo for Rocket Launcher' },
  { id: 28, colour: '#ddd5d5', solid: 0, desc: 'ammo for Lightning Gun' },
  { id: 29, colour: '#ddd5d5', solid: 0, desc: 'ammo for Railgun' },
  // WEAPONS
  { id: 33, colour: '#ddd5d5', solid: 0, desc: 'Machine Gun' },
  { id: 34, colour: '#ddd5d5', solid: 0, desc: 'Shotgun' },
  { id: 35, colour: '#ddd5d5', solid: 0, desc: 'Plasma Gun' },
  { id: 36, colour: '#ddd5d5', solid: 0, desc: 'Grenade Launcher' },
  { id: 37, colour: '#ddd5d5', solid: 0, desc: 'Rocket Launcher' },
  { id: 38, colour: '#ddd5d5', solid: 0, desc: 'Lightning Gun' },
  { id: 39, colour: '#ddd5d5', solid: 0, desc: 'Railgun' }
  
  */

}];

var Map =
/** @class */
function () {
  function Map() {}

  Map.prototype.init = function (main) {
    this.camera = main.camera;
    this.main = main;
    this.c = main.c;
    this.tileSize = this.c.TILE_SIZE;
    this.powerup = main.powerup;
    this.ctx = main.ctx;
    this.map = dm1_1.demoMap2; // dimensioni in pixels

    this.mapSize = {
      h: this.map.length * this.tileSize,
      w: this.map[0].length * this.tileSize
    };
    console.log("Mappa: " + this.mapSize.w + " x " + this.mapSize.h + " pixel, Righe: " + this.map.length + " - Colonne:" + this.map[0].length + " ");
  };

  Map.prototype.drawBorder = function (xPos, yPos, width, height, thickness) {
    if (thickness === void 0) {
      thickness = 1;
    }

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(xPos - thickness, yPos - thickness, width + thickness * 2, height + thickness * 2);
  };

  Map.prototype.render = function () {
    var onXTile = Math.floor((this.camera.x + this.camera.w / 2) / this.tileSize);
    var onYTile = Math.floor((this.camera.y + this.camera.h / 2) / this.tileSize);
    this.ctx.beginPath();

    for (var j = onYTile - 13; j < onYTile + 13; j++) {
      // sono 24 righe
      for (var l = onXTile - 17; l < onXTile + 17; l++) {
        // sono 32 colonne
        if (j >= 0 && l >= 0 && j < this.map.length && l < this.map[j].length) {
          // if (this.map[j][l] !== 1 || this.map[j][l] !== 3 || this.map[j][l] !== 4) {
          //     this.drawBorder(l * this.tileSize - this.camera.x, j * this.tileSize - this.camera.y, this.tileSize, this.tileSize);
          // }
          // si renderizza relativamente alla camera !!!
          this.ctx.fillStyle = this.getColor(this.map[j][l]);
          this.ctx.fillRect(l * this.tileSize - this.camera.x, j * this.tileSize - this.camera.y, this.tileSize, this.tileSize);

          if (this.main.debug) {
            this.ctx.font = 'bold 8px/1 Arial';
            this.ctx.fillStyle = '#494242';
            this.ctx.fillText(j.toString(), l * this.tileSize - this.camera.x + 2, j * this.tileSize - this.camera.y + 10);
            this.ctx.fillText(l.toString(), l * this.tileSize - this.camera.x + 2, j * this.tileSize - this.camera.y + 20);
          }
        }
      }
    }
  };

  Map.prototype.getColor = function (tile) {
    var color;

    switch (tile) {
      case 0:
        color = 'LightSteelBlue';
        break;
      // empty

      case 1:
        color = 'SlateGray';
        break;
      // solid

      case 3:
        color = 'red';
        break;
      // lava

      case 4:
        color = 'green';
        break;
      // toxic water

      default:
        color = 'LightSteelBlue';
        break;
    }

    return color;
  };

  Map.prototype.pixelToMapPos = function (pos) {
    return {
      x: Math.floor(pos.x / this.tileSize),
      y: Math.floor(pos.y / this.tileSize)
    };
  };

  Map.prototype.mapToPixelPos = function (mapPos) {
    return {
      x: mapPos.x * this.tileSize,
      y: mapPos.y * this.tileSize
    };
  };

  Map.prototype.loadSpawnPointsAndPowerUps = function () {
    var output = {};
    output.spawn = [];
    output.powerup = [];
    output.waypoints = [];

    for (var j = 0; j < this.map.length; j++) {
      for (var l = 0; l < this.map[j].length; l++) {
        if (j >= 0 && l >= 0 && j < this.map.length && l < this.map[j].length) {
          if (this.map[j][l] == 2) {
            output.spawn.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5
            });
          } // POWERUPS


          if (this.map[j][l] == 10) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'health'
            });
          }

          if (this.map[j][l] == 11) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'megaHealth'
            });
          }

          if (this.map[j][l] == 12) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'armour'
            });
          }

          if (this.map[j][l] == 13) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'megaArmour'
            });
          }

          if (this.map[j][l] == 14) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'quad'
            });
          }

          if (this.map[j][l] == 15) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'speed'
            });
          }
          /* --------------------- WEAPONS --------------------- */


          if (this.map[j][l] == 34) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'weaponShotgun',
              for: 'Shotgun',
              amount: 25
            });
          }

          if (this.map[j][l] == 35) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'weaponPlasma',
              for: 'Plasma',
              amount: 25
            });
          }

          if (this.map[j][l] == 37) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'weaponRocket',
              for: 'Rocket',
              amount: 10
            });
          }

          if (this.map[j][l] == 39) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'weaponRailgun',
              for: 'Railgun',
              amount: 5
            });
          }
          /* --------------------- AMMO --------------------- */


          if (this.map[j][l] == 23) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'ammoRifle',
              for: 'Rifle'
            });
          }

          if (this.map[j][l] == 24) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'ammoShotgun',
              for: 'Shotgun',
              amount: 25
            });
          }

          if (this.map[j][l] == 25) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'ammoPlasma',
              for: 'Plasma',
              amount: 25
            });
          }

          if (this.map[j][l] == 27) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'ammoRocket',
              for: 'Rocket',
              amount: 10
            });
          }

          if (this.map[j][l] == 29) {
            output.powerup.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'ammoRailgun',
              for: 'Railgun',
              amount: 5
            });
          } // WAYPOINTS


          if (this.map[j][l] == 40) {
            output.waypoints.push({
              x: l * this.tileSize - this.camera.x + 12.5,
              y: j * this.tileSize - this.camera.y + 12.5,
              type: 'waypoint'
            });
          }
        }
      }
    } // console.log(output);


    return output;
  };

  return Map;
}();

exports.Map = Map;
},{"./maps/dm1":"src/maps/dm1.ts"}],"src/entities/bullet.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helper_1 = require("../helper");

var BulletHandler =
/** @class */
function () {
  function BulletHandler() {
    this.list = [];
    this.pool = [];
  }

  BulletHandler.prototype.init = function (main) {
    this.list.length = 0;
    this.main = main;
    this.c = main.c;
    this.player = main.player;
    this.enemy = main.enemy;
    this.particelle = main.particelle;
    this.map = main.currentMap;
    this.blood = main.blood;
  };

  BulletHandler.prototype.myCheckCollision = function (shot, map) {
    if (shot.x - shot.old_x > 0 && map[Math.floor(shot.y / this.c.TILE_SIZE)][Math.floor((shot.x + this.c.BULLET_RADIUS) / this.c.TILE_SIZE)] == 1) {
      shot.x = shot.old_x;
      return true;
    }

    if (shot.x - shot.old_x > 0 && map[Math.floor(shot.y / this.c.TILE_SIZE)][Math.floor((shot.x - this.c.BULLET_RADIUS) / this.c.TILE_SIZE)] == 1) {
      shot.x = shot.old_x;
      return true;
    }

    if (shot.y + shot.old_y > 0 && map[Math.floor((shot.y + this.c.BULLET_RADIUS) / this.c.TILE_SIZE)][Math.floor(shot.x / this.c.TILE_SIZE)] == 1) {
      shot.y = shot.old_y;
      return true;
    }

    if (shot.y + shot.old_y < 0 && map[Math.floor((shot.y - this.c.BULLET_RADIUS) / this.c.TILE_SIZE)][Math.floor(shot.x / this.c.TILE_SIZE)] == 1) {
      shot.y = shot.old_y;
      return true;
    }

    return false;
  };

  BulletHandler.prototype.doExplosion = function (shot) {
    var magnitude = 3; // let type =Object.assign(shot.type,{r:this.c.TILE_SIZE*1.5})
    // si crea uno shot che verrà analizzato nel prossimo update() avente il raggio dell'esplosione
    // this.create( shot.x, shot.y, 0, 0, shot.firedBy, shot.index, 50, type)

    for (var b = 0; b < 50; b++) {
      //this.main.particelle.create(shot.x, shot.y, Math.random() * magnitude - magnitude, Math.random() * magnitude - magnitude, Helper.randf(this.c.DEBRIS_RADIUS, 20), Helper.randomElementInArray(this.c.FIRE_EXPLOSION))
      this.main.particelle.create(shot.x, shot.y, Math.random() * magnitude - 1, Math.random() * magnitude - 1, helper_1.Helper.randf(this.c.DEBRIS_RADIUS, 20), helper_1.Helper.randomElementInArray(this.c.FIRE_EXPLOSION));
    }
  };

  BulletHandler.prototype.calculateHealth = function (actor, damage) {
    if (actor.ap > 0) {
      actor.ap -= damage;
      var what = actor.ap;

      if (what < 0) {
        actor.hp += what;
      }
    } else {
      actor.ap = 0;
      actor.hp -= damage;
    }
  };

  BulletHandler.prototype.update = function (dt, timestamp) {
    var _this = this;

    var shot, i;

    var _loop_1 = function _loop_1() {
      shot = this_1.list[i];
      shot.old_x = shot.x;
      shot.old_y = shot.y;
      shot.x += shot.vX;
      shot.y += shot.vY;
      shot.angleForDinamicRadius += 2 * Math.PI / 30; // animazione del raggio dinamico di 36° a frame
      // collisione con i muri

      if (this_1.myCheckCollision(shot, this_1.map.map)) {
        // TODO: la velocità deve invertire su un solo asse quella del bullet...
        this_1.main.particelle.create(shot.x, shot.y, Math.random() * shot.vX / 3.5, Math.random() * shot.vY / 3.5, this_1.c.DEBRIS_RADIUS);

        if (shot.explode) {
          this_1.doExplosion(shot);
        }

        this_1.pool.push(shot);
        this_1.list.splice(i, 1);
        return "continue";
      } // bullet sparati da bot a bot (non il player... chiSparaTarget.index!=100 )


      var chiSpara = this_1.enemy.list[shot.index];

      if (chiSpara) {
        var chiSparaTarget_1 = chiSpara.target || {};

        if (shot.index == chiSpara.index && chiSparaTarget_1.alive && chiSparaTarget_1.index != 100 && helper_1.Helper.circleCollision(shot, chiSparaTarget_1)) {
          if (shot.explode) {
            this_1.doExplosion(shot);
          } //chiSparaTarget.hp -= shot.damage;


          this_1.calculateHealth(chiSparaTarget_1, shot.damage);
          this_1.blood.create(shot.x, shot.y, Math.random() * 4 - 4, Math.random() * 4 - 4, this_1.c.BLOOD_RADIUS); // crea il sangue

          this_1.pool.push(shot);
          this_1.list.splice(i, 1);

          if (chiSparaTarget_1.hp <= 0) {
            chiSparaTarget_1.alive = false;
            chiSparaTarget_1.numberOfDeaths++;

            for (var b = 0; b < 36; b++) {
              this_1.blood.create(shot.x, shot.y, Math.random() * 4 - 2, Math.random() * 4 - 2, this_1.c.BLOOD_RADIUS); // crea il sangue
            }

            this_1.enemy.list[shot.index].kills++; // si aumenta lo score del bot che ha sparato il proiettile

            console.log("BOT " + chiSpara.index + " killed BOT " + chiSparaTarget_1.index);
            setTimeout(function () {
              _this.enemy.respawn(chiSparaTarget_1);
            }, this_1.c.GAME_RESPAWN_TIME);
          }

          this_1.pool.push(shot);
          this_1.list.splice(i, 1);
          return "continue";
        }
      } // si guarda se i proiettili di qualche nemico impattano il player


      if (shot.firedBy == 'enemy' && this_1.player.alive && helper_1.Helper.circleCollision(shot, this_1.player)) {
        if (shot.explode) {
          this_1.doExplosion(shot);
        }

        if (!this_1.player.godMode) {
          //this.player.hp -= shot.damage;
          this_1.calculateHealth(this_1.player, shot.damage);
        }

        this_1.blood.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this_1.c.BLOOD_RADIUS); // crea il sangue

        this_1.pool.push(shot);
        this_1.list.splice(i, 1);

        if (this_1.player.hp <= 0) {
          this_1.player.alive = false;
          this_1.player.numberOfDeaths++;

          for (var b = 0; b < 36; b++) {
            this_1.blood.create(shot.x, shot.y, Math.random() * 4 - 2, Math.random() * 4 - 2, this_1.c.BLOOD_RADIUS); // crea il sangue
          }

          this_1.enemy.list[shot.index].kills++; // si aumenta lo score del bot che ha sparato il proiettile

          var currentActorInCamera = this_1.enemy.list[shot.index];
          this_1.main.camera.setCurrentPlayer(currentActorInCamera);
          this_1.main.camera.adjustCamera(currentActorInCamera); // setTimeout(() =>this.player.respawn(), this.c.GAME_RESPAWN_TIME);

          console.log("BOT " + shot.index + " killed Player " + this_1.player.index + ".");
        }

        this_1.pool.push(shot);
        this_1.list.splice(i, 1);
        return "continue";
      }

      var _loop_2 = function _loop_2(i_1) {
        var bot = this_1.enemy.list[i_1];

        if (shot.firedBy == 'player' && bot.alive && helper_1.Helper.circleCollision(shot, bot)) {
          if (shot.explode) {
            this_1.doExplosion(shot);
          } //bot.hp -= shot.damage;


          this_1.calculateHealth(bot, shot.damage);
          this_1.blood.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this_1.c.BLOOD_RADIUS); // crea il sangue

          if (bot.hp <= 0) {
            bot.alive = false;
            this_1.player.kills++;
            bot.numberOfDeaths++;

            for (var b = 0; b < 36; b++) {
              this_1.blood.create(shot.x, shot.y, Math.random() * 4 - 2, Math.random() * 4 - 2, this_1.c.BLOOD_RADIUS); // crea il sangue
            }

            console.log("PLayer killed BOT " + bot.index + ".");
            setTimeout(function () {
              _this.enemy.respawn(bot);
            }, this_1.c.GAME_RESPAWN_TIME);
            this_1.main.fragMessage = "You fragged " + bot.name + " " + this_1.calculateRanking() + " place with " + this_1.player.kills;
          }

          this_1.pool.push(shot);
          this_1.list.splice(i_1, 1);
          return "continue";
        }
      }; // si guarda se i proiettili del player impattano qualche nemico


      for (var i_1 = this_1.enemy.list.length - 1; i_1 >= 0; i_1--) {
        _loop_2(i_1);
      } // diverse visualizzazioni proiettili


      if (shot.type.name == 'Plasma') {
        shot.r = 1 + Math.abs(Math.sin(shot.angleForDinamicRadius)) * 5;
      }

      if (shot.type.name == 'Railgun') {
        var amplitude = 8; // in px

        var beta = timestamp + Math.PI / 2;
        var p1 = {};
        var p2 = {};
        p1.x = shot.x + Math.cos(beta) * amplitude;
        p1.y = shot.y + Math.sin(beta) * amplitude;
        p2.x = shot.x + Math.cos(beta) * amplitude;
        p2.y = shot.y + Math.sin(beta) * amplitude;
        this_1.main.particelle.create(p1.x, p1.y, 0, 0, 3, shot.color);
        this_1.main.particelle.create(p2.x, p2.y, 0, 0, 3, shot.color);
      }

      if (shot.type.name == 'Rocket') {
        var amplitude = 2; // in px

        var beta = timestamp + Math.PI / 2;

        for (var i_2 = 0; i_2 < 2; i_2++) {
          var scia = {};
          scia.x = shot.x + Math.cos(beta) * amplitude;
          scia.y = shot.y + Math.sin(beta) * amplitude;
          this_1.main.particelle.create(scia.x, scia.y, 0, 0, 3, helper_1.Helper.randomElementInArray(this_1.c.FIRE_EXPLOSION));
        }
      } // decremento del proiettile


      shot.ttl -= dt;

      if (shot.ttl <= 0) {
        this_1.pool.push(shot);
        this_1.list.splice(i, 1);
        return "continue";
      }
    };

    var this_1 = this;

    for (i = this.list.length - 1; i >= 0; i--) {
      _loop_1();
    }
  };

  BulletHandler.prototype.calculateRanking = function () {
    var index;
    this.main.actors = this.main.actors.sort(function (obj1, obj2) {
      return obj2.kills - obj1.kills;
    });

    for (var i = 0; i < this.main.actors.length; i++) {
      var element = this.main.actors[i];

      if (element.index == 100) {
        index = i;
        break;
      }
    }

    var output;

    switch (index) {
      case 0:
        output = '1st';
        break;

      case 1:
        output = '2nd';
        break;

      case 2:
        output = '3rd';
        break;

      case 3:
        output = '4th';
        break;

      case 4:
        output = '5th';
        break;

      case 5:
        output = '6th';
        break;

      case 6:
        output = '7th';
        break;

      case 7:
        output = '0th';
        break;

      default:
        break;
    }

    return output;
  };

  BulletHandler.prototype.render = function () {
    for (var j = this.list.length - 1; j >= 0; j--) {
      var shot = this.list[j];
      var x = shot.x - this.main.camera.x;
      var y = shot.y - this.main.camera.y;
      this.main.ctx.beginPath();
      this.main.ctx.arc(x, y, shot.r, 0, 6.2832);

      if (shot.type.name == 'Flamer') {
        this.main.ctx.fillStyle = helper_1.Helper.randomElementInArray(this.c.FIRE_EXPLOSION);
      } else {
        this.main.ctx.fillStyle = shot.color; // 'rgba(0,0,0,0.66)';
      }

      this.main.ctx.fill();
      this.main.ctx.closePath();
    }
  };

  BulletHandler.prototype.create = function (x, y, vX, vY, firedBy, index, damage, type) {
    var shot =
    /* this.pool.length > 0 ? this.pool.pop() : */
    {};
    shot.old_x = x;
    shot.x = x;
    shot.old_y = y;
    shot.y = y;
    shot.index = index; // è l'id del 

    shot.firedBy = firedBy; // indica da chi è sparato il colpo ( player, enemy )

    shot.type = type;

    if (shot.type.name == 'Plasma') {
      shot.angleForDinamicRadius = 0;
    }

    shot.vX = vX * type.speed + Math.random() * type.spread * 2 - type.spread;
    shot.vY = vY * type.speed + Math.random() * type.spread * 2 - type.spread;
    shot.r = type.r;
    shot.ttl = type.ttl;
    shot.color = type.color;
    shot.damage = damage ? damage * type.damage : type.damage;
    shot.explode = type.explode;
    this.list.push(shot);
  };

  return BulletHandler;
}();

exports.BulletHandler = BulletHandler;
},{"../helper":"src/helper.ts"}],"src/entities/particelle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helper_1 = require("../helper");

var Particelle =
/** @class */
function () {
  function Particelle() {}

  Particelle.prototype.init = function (main) {
    this.list = [];
    this.pool = [];
    this.main = main;
    this.c = main.c;
  };
  /**
   * Invocata con:
   * this.debrisHandler.create(shot.x, shot.y, Math.random() * 2 - 1, Math.random() * 2 - 1, 3)
   * @param {*} x coordinata x del detrito
   * @param {*} y coordinata y del detrito
   * @param {*} vX    veocità x
   * @param {*} vY    velocità y
   * @param {*} r raggio del detrito (default =3)
   * @memberof Particelle
   */


  Particelle.prototype.create = function (x, y, vX, vY, r, color) {
    if (r === void 0) {
      r = 3;
    }

    var obj = this.pool.length > 0 ? this.pool.pop() : new Object();
    obj.x = x;
    obj.y = y;
    obj.vX = vX;
    obj.vY = vY;
    obj.r = r;
    obj.color = color;
    this.list.push(obj);
  };

  ;

  Particelle.prototype.update = function (dt, timestamp) {
    if (this.list.length > 0) {
      var obj;

      for (var i = this.list.length - 1; i >= 0; i--) {
        obj = this.list[i];
        obj.x += -obj.vX; // si inverte il segno

        obj.y += -obj.vY; // si inverte il segno

        obj.vX *= 0.97;
        obj.vY *= 0.97;
        obj.r -= 0.1;

        if (obj.r <= 0) {
          this.pool.push(obj);
          this.list.splice(i, 1);
          continue;
        }
      }
    }
  };

  Particelle.prototype.render = function () {
    for (var i = this.list.length - 1; i >= 0; i--) {
      var detrito = this.list[i];
      var x = detrito.x - this.main.camera.x;
      var y = detrito.y - this.main.camera.y;
      this.main.ctx.beginPath();
      this.main.ctx.arc(x, y, detrito.r, 0, 6.2832);
      this.main.ctx.fillStyle = detrito.color || helper_1.Helper.randomElementInArray(this.c.DEBRIS_COLOR);
      this.main.ctx.fill();
      this.main.ctx.closePath();
    }
  };

  return Particelle;
}();

exports.Particelle = Particelle;
},{"../helper":"src/helper.ts"}],"src/entities/blood.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helper_1 = require("../helper");

var Blood =
/** @class */
function () {
  function Blood() {}

  Blood.prototype.init = function (main) {
    this.list = [];
    this.pool = [];
    this.main = main;
    this.c = main.c;
  };

  Blood.prototype.update = function (dt, timestamp) {
    if (this.list.length > 0) {
      var obj;

      for (var i = this.list.length - 1; i >= 0; i--) {
        obj = this.list[i];
        obj.x += -obj.vX;
        obj.y += -obj.vY;
        obj.vX *= 0.96;
        obj.vY *= 0.96;
        obj.radius -= 0.1;

        if (obj.radius <= 0) {
          this.pool.push(obj);
          this.list.splice(i, 1);
          continue;
        }
      }
    }
  };

  ;
  /**
   * Invocata con:
   *  this.blood(shot.x, shot.y, shot.vX * 0.4, shot.vY * 0.4, 4) // crea il sangue
   * @param {*} x coordinata x della particella di sangue
   * @param {*} y coordinata y della particella di sangue
   * @param {*} vX    veocità x
   * @param {*} vY    velocità y
   * @param {*} radius raggio della particella di sangue (default =3)
   */

  Blood.prototype.create = function (x, y, vX, vY, radius) {
    if (radius === void 0) {
      radius = 3;
    }

    var obj = this.pool.length > 0 ? this.pool.pop() : new Object();
    obj.x = x;
    obj.y = y;
    obj.vX = vX;
    obj.vY = vY;
    obj.radius = radius;
    this.list.push(obj);
  };

  ;

  Blood.prototype.render = function () {
    for (var i = this.list.length - 1; i >= 0; i--) {
      var sangue = this.list[i];
      var x = sangue.x - this.main.camera.x;
      var y = sangue.y - this.main.camera.y;
      this.main.ctx.beginPath();
      this.main.ctx.arc(x, y, sangue.radius, 0, 6.2832);
      this.main.ctx.fillStyle = helper_1.Helper.randomElementInArray(this.c.BLOOD_COLOUR);
      this.main.ctx.fill();
      this.main.ctx.closePath();
    }
  };

  return Blood;
}();

exports.Blood = Blood;
},{"../helper":"src/helper.ts"}],"src/entities/waypoints.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helper_1 = require("../helper");

var Waypoints =
/** @class */
function () {
  function Waypoints() {
    this.list = [];
    this.pool = [];
  }

  Waypoints.prototype.init = function (main) {
    this.list = [];
    this.main = main;
    this.c = main.c;
    this.player = main.player;
    this.bots = main.enemy;
    this.ctx = main.ctx;
  }; // ogni waypoint ha un riferimento di ogni bot per essere attraverasabile


  Waypoints.prototype.linkToActors = function () {
    var _this = this;

    this.list.forEach(function (e) {
      _this.bots.list.forEach(function (bot) {
        e[bot.index] = {
          visible: true,
          reloadRate: 0
        };
      });
    });
  };

  Waypoints.prototype.create = function (x, y, index) {
    var waypoint = this.pool.length > 0 ? this.pool.pop() : new Object();
    waypoint.type = 'waypoint';
    waypoint.index = index;
    waypoint.x = x;
    waypoint.y = y;
    waypoint.reloadRate = 0;
    waypoint.spawnTime = this.c.WAYPOINTS_TIMING; // tempo necessario per essere nuovamente attraverabili da ogni bot

    waypoint.r = 3;
    waypoint.color = 'orange';
    this.list.push(waypoint);
  };

  ;

  Waypoints.prototype.update = function (dt, timestamp) {
    for (var i = this.list.length - 1; i >= 0; i--) {
      var waypoint = this.list[i]; // si guarda se i waypoint entrano in contatto con qualche nemico

      for (var i_1 = this.bots.list.length - 1; i_1 >= 0; i_1--) {
        var bot = this.bots.list[i_1];

        if (waypoint[bot.index].visible && helper_1.Helper.circleCollision(waypoint, bot)) {
          waypoint[bot.index].visible = false;
        }
      } // contatori di visibilità


      for (var a = 0; a < this.bots.list.length; a++) {
        var actor = this.bots.list[a];

        if (!waypoint[actor.index].visible) {
          waypoint[actor.index].reloadRate += dt; // si inizia a contare se non visibile
        }
      } // RESPAWN


      for (var a = 0; a < this.bots.list.length; a++) {
        var actor = this.bots.list[a];

        if (waypoint[actor.index].reloadRate > waypoint.spawnTime) {
          // numero di cicli oltre il quale è nuovamente visibile
          waypoint[actor.index].visible = true;
          waypoint[actor.index].reloadRate = 0;
        }
      }
    }
  };

  Waypoints.prototype.render = function () {
    if (this.main.debug) {
      for (var i = this.list.length - 1; i >= 0; i--) {
        var waypoint = this.list[i]; //if (waypoint.visible) {
        // centro pulsante

        var x = waypoint.x - this.main.camera.x;
        var y = waypoint.y - this.main.camera.y;
        this.ctx.beginPath();
        this.ctx.arc(x, y, waypoint.r, 0, 6.2832);
        this.ctx.fillStyle = waypoint.color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.font = 'bold 8px/1 Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(waypoint.index.toString(), waypoint.x - this.main.camera.x - 6, waypoint.y - this.main.camera.y - 12); //}
      }
    }
  };

  return Waypoints;
}();

exports.Waypoints = Waypoints;
},{"../helper":"src/helper.ts"}],"node_modules/easystarjs/src/instance.js":[function(require,module,exports) {
/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
module.exports = function() {
    this.pointsToAvoid = {};
    this.startX;
    this.callback;
    this.startY;
    this.endX;
    this.endY;
    this.nodeHash = {};
    this.openList;
};
},{}],"node_modules/easystarjs/src/node.js":[function(require,module,exports) {
/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
module.exports = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.costSoFar = costSoFar;
    this.simpleDistanceToTarget = simpleDistanceToTarget;

    /**
    * @return {Number} Best guess distance of a cost using this node.
    **/
    this.bestGuessDistance = function() {
        return this.costSoFar + this.simpleDistanceToTarget;
    }
};
},{}],"node_modules/heap/lib/heap.js":[function(require,module,exports) {
var define;
// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);

},{}],"node_modules/heap/index.js":[function(require,module,exports) {
module.exports = require('./lib/heap');

},{"./lib/heap":"node_modules/heap/lib/heap.js"}],"node_modules/easystarjs/src/easystar.js":[function(require,module,exports) {
/**
*   EasyStar.js
*   github.com/prettymuchbryce/EasyStarJS
*   Licensed under the MIT license.
*
*   Implementation By Bryce Neal (@prettymuchbryce)
**/

var EasyStar = {}
var Instance = require('./instance');
var Node = require('./node');
var Heap = require('heap');

const CLOSED_LIST = 0;
const OPEN_LIST = 1;

module.exports = EasyStar;

var nextInstanceId = 1;

EasyStar.js = function() {
    var STRAIGHT_COST = 1.0;
    var DIAGONAL_COST = 1.4;
    var syncEnabled = false;
    var pointsToAvoid = {};
    var collisionGrid;
    var costMap = {};
    var pointsToCost = {};
    var directionalConditions = {};
    var allowCornerCutting = true;
    var iterationsSoFar;
    var instances = {};
    var instanceQueue = [];
    var iterationsPerCalculation = Number.MAX_VALUE;
    var acceptableTiles;
    var diagonalsEnabled = false;

    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array|Number} tiles An array of numbers that represent
    * which tiles in your grid should be considered
    * acceptable, or "walkable".
    **/
    this.setAcceptableTiles = function(tiles) {
        if (tiles instanceof Array) {
            // Array
            acceptableTiles = tiles;
        } else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
            // Number
            acceptableTiles = [tiles];
        }
    };

    /**
    * Enables sync mode for this EasyStar instance..
    * if you're into that sort of thing.
    **/
    this.enableSync = function() {
        syncEnabled = true;
    };

    /**
    * Disables sync mode for this EasyStar instance.
    **/
    this.disableSync = function() {
        syncEnabled = false;
    };

    /**
     * Enable diagonal pathfinding.
     */
    this.enableDiagonals = function() {
        diagonalsEnabled = true;
    }

    /**
     * Disable diagonal pathfinding.
     */
    this.disableDiagonals = function() {
        diagonalsEnabled = false;
    }

    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array} grid The collision grid that this EasyStar instance will read from.
    * This should be a 2D Array of Numbers.
    **/
    this.setGrid = function(grid) {
        collisionGrid = grid;

        //Setup cost map
        for (var y = 0; y < collisionGrid.length; y++) {
            for (var x = 0; x < collisionGrid[0].length; x++) {
                if (!costMap[collisionGrid[y][x]]) {
                    costMap[collisionGrid[y][x]] = 1
                }
            }
        }
    };

    /**
    * Sets the tile cost for a particular tile type.
    *
    * @param {Number} The tile type to set the cost for.
    * @param {Number} The multiplicative cost associated with the given tile.
    **/
    this.setTileCost = function(tileType, cost) {
        costMap[tileType] = cost;
    };

    /**
    * Sets the an additional cost for a particular point.
    * Overrides the cost from setTileCost.
    *
    * @param {Number} x The x value of the point to cost.
    * @param {Number} y The y value of the point to cost.
    * @param {Number} The multiplicative cost associated with the given point.
    **/
    this.setAdditionalPointCost = function(x, y, cost) {
        if (pointsToCost[y] === undefined) {
            pointsToCost[y] = {};
        }
        pointsToCost[y][x] = cost;
    };

    /**
    * Remove the additional cost for a particular point.
    *
    * @param {Number} x The x value of the point to stop costing.
    * @param {Number} y The y value of the point to stop costing.
    **/
    this.removeAdditionalPointCost = function(x, y) {
        if (pointsToCost[y] !== undefined) {
            delete pointsToCost[y][x];
        }
    }

    /**
    * Remove all additional point costs.
    **/
    this.removeAllAdditionalPointCosts = function() {
        pointsToCost = {};
    }

    /**
    * Sets a directional condition on a tile
    *
    * @param {Number} x The x value of the point.
    * @param {Number} y The y value of the point.
    * @param {Array.<String>} allowedDirections A list of all the allowed directions that can access
    * the tile.
    **/
    this.setDirectionalCondition = function(x, y, allowedDirections) {
        if (directionalConditions[y] === undefined) {
            directionalConditions[y] = {};
        }
        directionalConditions[y][x] = allowedDirections;
    };

    /**
    * Remove all directional conditions
    **/
    this.removeAllDirectionalConditions = function() {
        directionalConditions = {};
    };

    /**
    * Sets the number of search iterations per calculation.
    * A lower number provides a slower result, but more practical if you
    * have a large tile-map and don't want to block your thread while
    * finding a path.
    *
    * @param {Number} iterations The number of searches to prefrom per calculate() call.
    **/
    this.setIterationsPerCalculation = function(iterations) {
        iterationsPerCalculation = iterations;
    };

    /**
    * Avoid a particular point on the grid,
    * regardless of whether or not it is an acceptable tile.
    *
    * @param {Number} x The x value of the point to avoid.
    * @param {Number} y The y value of the point to avoid.
    **/
    this.avoidAdditionalPoint = function(x, y) {
        if (pointsToAvoid[y] === undefined) {
            pointsToAvoid[y] = {};
        }
        pointsToAvoid[y][x] = 1;
    };

    /**
    * Stop avoiding a particular point on the grid.
    *
    * @param {Number} x The x value of the point to stop avoiding.
    * @param {Number} y The y value of the point to stop avoiding.
    **/
    this.stopAvoidingAdditionalPoint = function(x, y) {
        if (pointsToAvoid[y] !== undefined) {
            delete pointsToAvoid[y][x];
        }
    };

    /**
    * Enables corner cutting in diagonal movement.
    **/
    this.enableCornerCutting = function() {
        allowCornerCutting = true;
    };

    /**
    * Disables corner cutting in diagonal movement.
    **/
    this.disableCornerCutting = function() {
        allowCornerCutting = false;
    };

    /**
    * Stop avoiding all additional points on the grid.
    **/
    this.stopAvoidingAllAdditionalPoints = function() {
        pointsToAvoid = {};
    };

    /**
    * Find a path.
    *
    * @param {Number} startX The X position of the starting point.
    * @param {Number} startY The Y position of the starting point.
    * @param {Number} endX The X position of the ending point.
    * @param {Number} endY The Y position of the ending point.
    * @param {Function} callback A function that is called when your path
    * is found, or no path is found.
    * @return {Number} A numeric, non-zero value which identifies the created instance. This value can be passed to cancelPath to cancel the path calculation.
    *
    **/
    this.findPath = function(startX, startY, endX, endY, callback) {
        // Wraps the callback for sync vs async logic
        var callbackWrapper = function(result) {
            if (syncEnabled) {
                callback(result);
            } else {
                setTimeout(function() {
                    callback(result);
                });
            }
        }

        // No acceptable tiles were set
        if (acceptableTiles === undefined) {
            throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
        }
        // No grid was set
        if (collisionGrid === undefined) {
            throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
        }

        // Start or endpoint outside of scope.
        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 ||
        startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 ||
        endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
            throw new Error("Your start or end point is outside the scope of your grid.");
        }

        // Start and end are the same tile.
        if (startX===endX && startY===endY) {
            callbackWrapper([]);
            return;
        }

        // End point is not an acceptable tile.
        var endTile = collisionGrid[endY][endX];
        var isAcceptable = false;
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (endTile === acceptableTiles[i]) {
                isAcceptable = true;
                break;
            }
        }

        if (isAcceptable === false) {
            callbackWrapper(null);
            return;
        }

        // Create the instance
        var instance = new Instance();
        instance.openList = new Heap(function(nodeA, nodeB) {
            return nodeA.bestGuessDistance() - nodeB.bestGuessDistance();
        });
        instance.isDoneCalculating = false;
        instance.nodeHash = {};
        instance.startX = startX;
        instance.startY = startY;
        instance.endX = endX;
        instance.endY = endY;
        instance.callback = callbackWrapper;

        instance.openList.push(coordinateToNode(instance, instance.startX,
            instance.startY, null, STRAIGHT_COST));

        var instanceId = nextInstanceId ++;
        instances[instanceId] = instance;
        instanceQueue.push(instanceId);
        return instanceId;
    };

    /**
     * Cancel a path calculation.
     *
     * @param {Number} instanceId The instance ID of the path being calculated
     * @return {Boolean} True if an instance was found and cancelled.
     *
     **/
    this.cancelPath = function(instanceId) {
        if (instanceId in instances) {
            delete instances[instanceId];
            // No need to remove it from instanceQueue
            return true;
        }
        return false;
    };

    /**
    * This method steps through the A* Algorithm in an attempt to
    * find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
    * You can change the number of calculations done in a call by using
    * easystar.setIteratonsPerCalculation().
    **/
    this.calculate = function() {
        if (instanceQueue.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
            return;
        }
        for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
            if (instanceQueue.length === 0) {
                return;
            }

            if (syncEnabled) {
                // If this is a sync instance, we want to make sure that it calculates synchronously.
                iterationsSoFar = 0;
            }

            var instanceId = instanceQueue[0];
            var instance = instances[instanceId];
            if (typeof instance == 'undefined') {
                // This instance was cancelled
                instanceQueue.shift();
                continue;
            }

            // Couldn't find a path.
            if (instance.openList.size() === 0) {
                instance.callback(null);
                delete instances[instanceId];
                instanceQueue.shift();
                continue;
            }

            var searchNode = instance.openList.pop();

            // Handles the case where we have found the destination
            if (instance.endX === searchNode.x && instance.endY === searchNode.y) {
                var path = [];
                path.push({x: searchNode.x, y: searchNode.y});
                var parent = searchNode.parent;
                while (parent!=null) {
                    path.push({x: parent.x, y:parent.y});
                    parent = parent.parent;
                }
                path.reverse();
                var ip = path;
                instance.callback(ip);
                delete instances[instanceId];
                instanceQueue.shift();
                continue;
            }

            searchNode.list = CLOSED_LIST;

            if (searchNode.y > 0) {
                checkAdjacentNode(instance, searchNode,
                    0, -1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y-1));
            }
            if (searchNode.x < collisionGrid[0].length-1) {
                checkAdjacentNode(instance, searchNode,
                    1, 0, STRAIGHT_COST * getTileCost(searchNode.x+1, searchNode.y));
            }
            if (searchNode.y < collisionGrid.length-1) {
                checkAdjacentNode(instance, searchNode,
                    0, 1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y+1));
            }
            if (searchNode.x > 0) {
                checkAdjacentNode(instance, searchNode,
                    -1, 0, STRAIGHT_COST * getTileCost(searchNode.x-1, searchNode.y));
            }
            if (diagonalsEnabled) {
                if (searchNode.x > 0 && searchNode.y > 0) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1, searchNode) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y, searchNode))) {

                        checkAdjacentNode(instance, searchNode,
                            -1, -1, DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y-1));
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1, searchNode) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y, searchNode))) {

                        checkAdjacentNode(instance, searchNode,
                            1, 1, DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y+1));
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1, searchNode) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y, searchNode))) {

                        checkAdjacentNode(instance, searchNode,
                            1, -1, DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y-1));
                    }
                }
                if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1, searchNode) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y, searchNode))) {

                        checkAdjacentNode(instance, searchNode,
                            -1, 1, DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y+1));
                    }
                }
            }

        }
    };

    // Private methods follow
    var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
        var adjacentCoordinateX = searchNode.x+x;
        var adjacentCoordinateY = searchNode.y+y;

        if ((pointsToAvoid[adjacentCoordinateY] === undefined ||
             pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX] === undefined) &&
            isTileWalkable(collisionGrid, acceptableTiles, adjacentCoordinateX, adjacentCoordinateY, searchNode)) {
            var node = coordinateToNode(instance, adjacentCoordinateX,
                adjacentCoordinateY, searchNode, cost);

            if (node.list === undefined) {
                node.list = OPEN_LIST;
                instance.openList.push(node);
            } else if (searchNode.costSoFar + cost < node.costSoFar) {
                node.costSoFar = searchNode.costSoFar + cost;
                node.parent = searchNode;
                instance.openList.updateItem(node);
            }
        }
    };

    // Helpers
    var isTileWalkable = function(collisionGrid, acceptableTiles, x, y, sourceNode) {
        var directionalCondition = directionalConditions[y] && directionalConditions[y][x];
        if (directionalCondition) {
            var direction = calculateDirection(sourceNode.x - x, sourceNode.y - y)
            var directionIncluded = function () {
                for (var i = 0; i < directionalCondition.length; i++) {
                    if (directionalCondition[i] === direction) return true
                }
                return false
            }
            if (!directionIncluded()) return false
        }
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (collisionGrid[y][x] === acceptableTiles[i]) {
                return true;
            }
        }

        return false;
    };

    /**
     * -1, -1 | 0, -1  | 1, -1
     * -1,  0 | SOURCE | 1,  0
     * -1,  1 | 0,  1  | 1,  1
     */
    var calculateDirection = function (diffX, diffY) {
        if (diffX === 0 && diffY === -1) return EasyStar.TOP
        else if (diffX === 1 && diffY === -1) return EasyStar.TOP_RIGHT
        else if (diffX === 1 && diffY === 0) return EasyStar.RIGHT
        else if (diffX === 1 && diffY === 1) return EasyStar.BOTTOM_RIGHT
        else if (diffX === 0 && diffY === 1) return EasyStar.BOTTOM
        else if (diffX === -1 && diffY === 1) return EasyStar.BOTTOM_LEFT
        else if (diffX === -1 && diffY === 0) return EasyStar.LEFT
        else if (diffX === -1 && diffY === -1) return EasyStar.TOP_LEFT
        throw new Error('These differences are not valid: ' + diffX + ', ' + diffY)
    };

    var getTileCost = function(x, y) {
        return (pointsToCost[y] && pointsToCost[y][x]) || costMap[collisionGrid[y][x]]
    };

    var coordinateToNode = function(instance, x, y, parent, cost) {
        if (instance.nodeHash[y] !== undefined) {
            if (instance.nodeHash[y][x] !== undefined) {
                return instance.nodeHash[y][x];
            }
        } else {
            instance.nodeHash[y] = {};
        }
        var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
        if (parent!==null) {
            var costSoFar = parent.costSoFar + cost;
        } else {
            costSoFar = 0;
        }
        var node = new Node(parent,x,y,costSoFar,simpleDistanceToTarget);
        instance.nodeHash[y][x] = node;
        return node;
    };

    var getDistance = function(x1,y1,x2,y2) {
        if (diagonalsEnabled) {
            // Octile distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            if (dx < dy) {
                return DIAGONAL_COST * dx + dy;
            } else {
                return DIAGONAL_COST * dy + dx;
            }
        } else {
            // Manhattan distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            return (dx + dy);
        }
    };
}

EasyStar.TOP = 'TOP'
EasyStar.TOP_RIGHT = 'TOP_RIGHT'
EasyStar.RIGHT = 'RIGHT'
EasyStar.BOTTOM_RIGHT = 'BOTTOM_RIGHT'
EasyStar.BOTTOM = 'BOTTOM'
EasyStar.BOTTOM_LEFT = 'BOTTOM_LEFT'
EasyStar.LEFT = 'LEFT'
EasyStar.TOP_LEFT = 'TOP_LEFT'

},{"./instance":"node_modules/easystarjs/src/instance.js","./node":"node_modules/easystarjs/src/node.js","heap":"node_modules/heap/index.js"}],"src/game.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var enemies_1 = require("./entities/enemies");

var powerup_1 = require("./entities/powerup");

var controller_1 = require("./controller");

var player_1 = require("./entities/player");

var config_1 = require("./config");

var camera_1 = require("./camera");

var maps_1 = require("./maps");

var bullet_1 = require("./entities/bullet");

var particelle_1 = require("./entities/particelle");

var blood_1 = require("./entities/blood");

var waypoints_1 = require("./entities/waypoints");

var EasyStar = __importStar(require("easystarjs"));

window.onload = function () {
  var app = new Game();
  app.loadMenuScreen(app);
};

var Game =
/** @class */
function () {
  function Game() {
    this.paused = false;
    this.debug = false;
    this.canvas = document.getElementById('canvas');
    this.canvas.height = 600; // window.innerHeight

    this.canvas.width = 800; // window.innerWidth

    this.ctx = this.canvas.getContext("2d");
    this.player = new player_1.Player(); // PLAYER

    this.enemy = new enemies_1.Enemy(); // ENEMY

    this.bullet = new bullet_1.BulletHandler();
    this.camera = new camera_1.Camera();
    this.control = new controller_1.ControlHandler(this);
    this.currentMap = new maps_1.Map();
    this.particelle = new particelle_1.Particelle();
    this.powerup = new powerup_1.PowerUp();
    this.waypoints = new waypoints_1.Waypoints();
    this.blood = new blood_1.Blood();
    this.state = 'loading';
  } // fa partire il gameloop


  Game.prototype.startGame = function (gametype) {
    var _this = this;

    if (gametype === void 0) {
      gametype = 'deathmatch';
    }

    this.c = new config_1.Config();
    this.canvas.height = this.c.CANVAS_HEIGHT; // window.innerHeight

    this.canvas.width = this.c.CANVAS_WIDTH; // window.innerWidth

    this.state = 'game';
    this.start = true; // flags that you want the countdown to start

    this.lastRender = 0; // ultimo timestamp

    this.fps = 0;
    this.stopTime = 0; // used to hold the stop time

    this.stop = false; // flag to indicate that stop time has been reached

    this.timeTillStop = 0; // holds the display time

    this.killsToWin = this.c.GAME_KILLS_TO_WIN;
    this.matchDuration = this.c.GAME_MATCH_DURATION;
    this.numberOfBots = this.c.GAME_BOTS_PER_MATCH;
    this.gameType = gametype;
    this.canvas.style.cursor = 'crosshair';
    this.fontFamily = this.c.FONT_FAMILY;
    this.actors = [];
    this.easystar = {};
    this.fragMessage = '';
    this.durationfragMessage = 0; // bots names

    var botsArray = Array(this.numberOfBots).fill(null).map(function (e, i) {
      return i;
    }); // init entities

    this.currentMap.init(this);
    this.player.init(this);
    this.camera.init(0, 0, this.c.CANVAS_WIDTH, this.c.CANVAS_HEIGHT, this);
    this.enemy.init(this);
    this.bullet.init(this);
    this.blood.init(this);
    this.particelle.init(this);
    this.powerup.init(this);
    this.waypoints.init(this); // loading spawnPoint + powerups + weapons

    this.data = this.currentMap.loadSpawnPointsAndPowerUps(); // POWERUP & WEAPONS

    this.data.powerup.map(function (e, i) {
      e.index = i;
      return e;
    }) // si mette un indice
    .forEach(function (e, index) {
      _this.powerup.create(e.x, e.y, e.type, index);
    }); // waypoint

    this.data.waypoints.map(function (e, i) {
      e.index = i;
      return e;
    }) // si mette un indice
    .forEach(function (e, index) {
      _this.waypoints.create(e.x, e.y, index);
    }); // si inizializza il player

    this.player.createPlayer();
    this.actors[0] = this.player; // si crea i bots

    botsArray.forEach(function (elem, index) {
      var e = _this.data.spawn[index];

      var bot = _this.enemy.create(e.x, e.y, index, _this.defineTeams(index)); // si crea un nemico


      _this.actors[_this.actors.length] = bot;
    });
    this.waypoints.linkToActors();
    this.easystar = new EasyStar.js();
    this.easystar.setGrid(this.currentMap.map); // Get the walkable tile indexes

    this.easystar.setAcceptableTiles([0, 2, 10, 11, 12, 13, 14, 15, 16, 23, 24, 25, 27, 29, 34, 35, 37, 39, 40]);
    this.easystar.enableDiagonals();
    this.easystar.enableCornerCutting();
    requestAnimationFrame(this.gameLoop.bind(this));
  };

  Game.prototype.defineTeams = function (index) {
    if (this.gameType == 'deathmatch') {
      // tutti i bot hanno un team diverso...
      return "team" + (index + 2);
    } else {
      // per teamDeathMatch e CTF
      if (index < Math.floor(this.c.GAME_BOTS_PER_MATCH / 2) + 1) {
        return "team2";
      } else {
        return "team1";
      }
    }
  };

  Game.prototype.gameLoop = function (timestamp) {
    this.canvas.style.cursor = 'crosshair';
    var dt = timestamp - this.lastRender;
    this.fps = Math.floor(1000 / dt);

    if (this.start) {
      // do we need to start the timer
      this.stopTime = timestamp + this.matchDuration; // yes the set the stoptime

      this.start = false; // clear the start flag
    } else {
      // waiting for stop
      if (timestamp >= this.stopTime) {
        // has stop time been reached?
        this.stop = true; // yes the flag to stop
      }
    }

    this.timeTillStop = Math.floor(this.stopTime - timestamp) / 1000; // for display of time till stop

    if (this.state != 'game') {
      return;
    }

    if (this.fragMessage) {
      this.durationfragMessage += dt;
    }

    if (this.durationfragMessage > 1500) {
      this.fragMessage = '';
      this.durationfragMessage = 0;
    }

    for (var i = 0; i < this.enemy.list.length; i++) {
      var bot = this.enemy.list[i];

      if (this.player.kills == this.killsToWin || bot.kills == this.killsToWin) {
        this.loadStatsScreen(this);
        return;
      }
    }

    if (!this.paused) {
      this.updateAll(dt, timestamp);
      this.renderAll();
    }

    this.lastRender = timestamp;

    if (!this.stop) {
      requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      this.loadStatsScreen(this);
      return;
    }
  };

  Game.prototype.updateAll = function (dt, timestamp) {
    this.player.update(dt, timestamp);
    this.enemy.update(dt, timestamp);
    this.camera.update(dt, timestamp);
    this.bullet.update(dt, timestamp);
    this.powerup.update(dt, timestamp);
    this.waypoints.update(dt, timestamp); // waypoints

    this.particelle.update(dt, timestamp);
    this.blood.update(dt, timestamp); // particles:esplosioni
  };

  Game.prototype.renderAll = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // svuota il canvas

    this.currentMap.render();
    this.player.render();
    this.enemy.render();
    this.bullet.render();
    this.powerup.render();
    this.waypoints.render(); // waypoints

    this.particelle.render();
    this.blood.render(); // particles:esplosioni

    this.renderHUD(); // HUD
  };

  Game.prototype.countDown = function () {
    var minutes, seconds;
    minutes = Math.floor(this.timeTillStop / 60);
    seconds = Math.floor(this.timeTillStop % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  };

  Game.prototype.renderHUD = function () {
    this.ctx.fillStyle = this.c.HUD_BACKGROUND;
    this.ctx.fillRect(0, 0, this.c.CANVAS_WIDTH, this.c.TILE_SIZE);
    this.ctx.textAlign = 'LEFT';
    this.ctx.font = 'bold 14px/1 Arial';
    this.ctx.fillStyle = '#565454';
    this.ctx.fillText('HP ', 5, this.c.TILE_SIZE / 2);
    this.ctx.fillText('AP ', 85, this.c.TILE_SIZE / 2);
    this.ctx.fillText('Kills ', 165, this.c.TILE_SIZE / 2);
    this.ctx.fillText(this.player.currentWeapon.name, 245, this.c.TILE_SIZE / 2);
    this.ctx.fillText('TIME ', 600, this.c.TILE_SIZE / 2);
    this.ctx.fillText('FPS ', 710, this.c.TILE_SIZE / 2);

    if (this.player.godMode) {
      this.ctx.fillText('god', 770, this.c.TILE_SIZE / 2);
    }

    this.ctx.font = 'bold 14px/1 Arial';
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillText(this.player.hp.toString(), 30, this.c.TILE_SIZE / 2);
    this.ctx.fillText(this.player.ap.toString(), 110, this.c.TILE_SIZE / 2);
    this.ctx.fillText(this.player.kills.toString(), 200, this.c.TILE_SIZE / 2);
    this.ctx.fillText(this.player.currentWeapon.shotNumber.toString(), 310, this.c.TILE_SIZE / 2);
    this.ctx.fillText(this.countDown(), 640, this.c.TILE_SIZE / 2);
    this.ctx.fillText(this.fps.toString(), 750, this.c.TILE_SIZE / 2); // RESPAWN MESSAGE

    if (!this.player.alive) {
      this.ctx.fillStyle = '#565454';
      this.ctx.font = 'bold 28px/1 Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText("Respawn in " + Math.ceil((this.c.GAME_RESPAWN_TIME - this.player.respawnTime) / 1000).toString(), 400, 120);
    } // FRAG MESSAGE


    if (this.fragMessage) {
      this.ctx.fillStyle = '#565454';
      this.ctx.font = 'bold 20px/1 Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.fragMessage, 400, 120);
    }
  };

  Game.prototype.textONCanvas = function (context, text, x, y, font, style, align, baseline) {
    context.font = typeof font === 'undefined' ? 'normal 16px/1 Arial' : font;
    context.fillStyle = typeof style === 'undefined' ? '#000000' : style;
    context.textAlign = typeof align === 'undefined' ? 'center' : align;
    context.textBaseline = typeof baseline === 'undefined' ? 'middle' : baseline;
    context.fillText(text, x, y);
  };

  Game.prototype.loadMenuScreen = function (main) {
    var _this = this;

    var gameType;
    main.canvas.addEventListener('click', function (e) {
      var rect = _this.canvas.getBoundingClientRect();

      var pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      if (deathBtn.contains(pos.x, pos.y)) {
        gameType = 'deathmatch';
      }

      if (teamBtn.contains(pos.x, pos.y)) {
        gameType = 'team';
      }

      if (playBtn.contains(pos.x, pos.y)) {
        _this.startGame(gameType);
      }
    });
    main.canvas.style.cursor = 'pointer';
    main.state = 'menuScreen';
    main.control.mouseLeft = false;
    main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
    var hW = main.canvas.width * 0.5;
    var hH = main.canvas.height * 0.5;
    var dark = 'rgba(0,0,0)';
    var medium = 'rgba(0,0,0)';
    var light = 'rgba(0,0,0)';
    this.textONCanvas(main.ctx, 'Arena Shooter 2D', hW, hH - 100, 'normal 36px/1 ' + main.fontFamily, light);
    this.textONCanvas(main.ctx, 'Use "WASD" to move and "Left Click" to shoot.', hW, hH - 30, 'normal 15px/1 ' + main.fontFamily, medium);
    this.textONCanvas(main.ctx, 'Use mouse wheel to change weapons.', hW, hH - 10, 'normal 15px/1 ' + main.fontFamily, medium);
    this.textONCanvas(main.ctx, 'P or ESC for pause screen (i for debug, g for godmode, b to cycle camera).', hW, hH + 10, 'normal 15px/1 ' + main.fontFamily, medium); // this.textONCanvas(main.ctx, 'Click to Start', hW, hH + 80, 'normal 18px/1 ' + main.fontFamily, dark);

    this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 12px/1 ' + main.fontFamily, light, 'left');
    var deathBtn = new MyBTN(150, 350, 200, 100);
    deathBtn.draw(main.ctx);
    this.textONCanvas(main.ctx, 'DeathMatch', 250, 375, 'normal 15px/1 ' + main.fontFamily, medium);
    var teamBtn = new MyBTN(450, 350, 200, 100);
    teamBtn.draw(main.ctx);
    this.textONCanvas(main.ctx, 'Team DeathMatch', 550, 375, 'normal 15px/1 ' + main.fontFamily, medium);
    var playBtn = new MyBTN(300, 475, 200, 100);
    playBtn.draw(main.ctx);
    this.textONCanvas(main.ctx, 'Click to start', 400, 525, 'normal 15px/1 ' + main.fontFamily, medium);
  };

  Game.prototype.loadStatsScreen = function (main) {
    main.canvas.style.cursor = 'pointer';
    main.state = 'statsScreen';
    main.control.mouseLeft = false;
    main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
    var hW = main.canvas.width * 0.5;
    var hH = main.canvas.height * 0.5;
    var dark = 'rgba(0,0,0)';
    var medium = 'rgba(0,0,0)';
    var light = 'rgba(0,0,0)';
    this.textONCanvas(main.ctx, 'Corbe Shooter 2D', hW, hH - 150, 'normal 42px/1 ' + main.fontFamily, light);
    this.textONCanvas(main.ctx, 'Partita completata!', hW, hH - 70, 'normal 22px/1 ' + main.fontFamily, dark); // this.textONCanvas(main.ctx, `${main.player.name} - ${main.player.kills} - ${main.player.numberOfDeaths}`, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
    // for (let i = 0; i < this.enemy.list.length; i++) {
    //     const bot = this.enemy.list[i];
    //     this.textONCanvas(main.ctx, `${bot.name} - ${bot.kills} - ${bot.numberOfDeaths}`, hW, hH - 30 +(20*(i+1)), 'normal 16px/1 ' + main.fontFamily, medium);
    // }

    this.actors = this.actors.sort(function (obj1, obj2) {
      return obj2.kills - obj1.kills;
    });

    for (var i = 0; i < this.actors.length; i++) {
      var actor = this.actors[i];
      this.textONCanvas(main.ctx, actor.name + " - " + actor.kills + " - " + actor.numberOfDeaths, hW, hH - 30 + 20 * (i + 1), 'normal 16px/1 ' + main.fontFamily, medium);
    }

    this.textONCanvas(main.ctx, 'Click to Restart', hW, main.canvas.height - 120, 'normal 18px/1 ' + main.fontFamily, dark);
    this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 12px/1 ' + main.fontFamily, light, 'left');
  }; // screen di pausa


  Game.prototype.loadPauseScreen = function (main) {
    main.canvas.style.cursor = 'pointer';
    main.paused = true;
    main.control.mouseDown = false;
    main.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    main.ctx.fillRect(0, 0, main.canvas.width, main.canvas.height);
    var hW = main.canvas.width * 0.5;
    var hH = main.canvas.height * 0.5;
    var dark = 'rgba(0,0,0,0.9)';
    var medium = 'rgba(0,0,0,0.5)';
    var light = 'rgba(0,0,0,0.3)';
    this.textONCanvas(main.ctx, 'Paused', hW, hH - 60, 'normal 22px/1 ' + main.fontFamily, dark); // this.textONCanvas(main.ctx, `${main.player.name} - ${main.player.kills} - ${main.player.numberOfDeaths}`, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
    // for (let i = 0; i < this.enemy.list.length; i++) {
    //     const bot = this.enemy.list[i];
    //     this.textONCanvas(main.ctx, `${bot.name} - ${bot.kills} - ${bot.numberOfDeaths}`, hW, hH - 30 +(20*(i+1)), 'normal 16px/1 ' + main.fontFamily, medium);
    // }

    this.actors = this.actors.sort(function (obj1, obj2) {
      return obj2.kills - obj1.kills;
    });

    for (var i = 0; i < this.actors.length; i++) {
      var actor = this.actors[i];
      this.textONCanvas(main.ctx, actor.name + " - " + actor.kills + " - " + actor.numberOfDeaths, hW, hH - 30 + 20 * (i + 1), 'normal 16px/1 ' + main.fontFamily, medium);
    }

    this.textONCanvas(main.ctx, 'Click to Continue', hW, hH + 150, 'normal 17px/1 ' + main.fontFamily, dark);
  };

  return Game;
}();

exports.default = Game;

var MyBTN =
/** @class */
function () {
  function MyBTN(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  MyBTN.prototype.contains = function (x, y) {
    return this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height;
  };

  MyBTN.prototype.draw = function (ctx) {
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  };

  return MyBTN;
}();

exports.MyBTN = MyBTN;
},{"./entities/enemies":"src/entities/enemies.ts","./entities/powerup":"src/entities/powerup.ts","./controller":"src/controller.ts","./entities/player":"src/entities/player.ts","./config":"src/config.ts","./camera":"src/camera.ts","./maps":"src/maps.ts","./entities/bullet":"src/entities/bullet.ts","./entities/particelle":"src/entities/particelle.ts","./entities/blood":"src/entities/blood.ts","./entities/waypoints":"src/entities/waypoints.ts","easystarjs":"node_modules/easystarjs/src/easystar.js"}],"node_modules/parcel-bundler/lib/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59611" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/lib/builtins/hmr-runtime.js","src/game.ts"], null)
//# sourceMappingURL=/game.ce49b8ae.map