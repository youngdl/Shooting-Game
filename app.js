// import { GameObject, Fighter, Monster, EventEmitter } from './classes_define.js';

const Messages = {
    'up': 'Messages-KEY_EVENT_UP',
    'down': 'Messages-KEY_EVENT_DOWN',
    'left': 'Messages-KEY_EVENT_LEFT',
    'right': 'Messages-KEY_EVENT_RIGHT',
}

window.onload = async () => {
    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');
    window.addEventListener('keydown', preventDefaultKeyDown)
    const fighterImg = await loadImage('./assets/fighter4.png')
    const monsterImg = await loadImage('./assets/monster.png')
    all_objects = initGame(canvas, context, fighterImg, monsterImg);
    let gameLoopId = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        all_objects.forEach(obj => obj.draw(context))
    }, 100);
};

function loadImage(path) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img)
            }
    })
}

function preventDefaultKeyDown (e) {
    switch (e.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
        case 32:
            e.preventDefault();
            break;
        default:
            break;
    }
};

function initGame(canvas, context, fighterImg, monsterImg) {
    let all_objects = []
    let fighter = createFighter(canvas, fighterImg);
    let monsters = createMonsters(canvas, monsterImg);
    all_objects.push(fighter)
    all_objects.push(...monsters)
    all_objects.forEach(obj => obj.draw(context))
    let eventEmitter = new EventEmitter();
    messageRegistry(eventEmitter, Messages, fighter)
    window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp': 
            eventEmitter.emit(Messages['up']);
            break;
        case 'ArrowDown': 
            eventEmitter.emit(Messages['down']);
            break;
        case 'ArrowLeft': 
            eventEmitter.emit(Messages['left']);
            break;
        case 'ArrowRight': 
            eventEmitter.emit(Messages['right']);
            break;
    }
    })
    return all_objects
}

function createFighter(canvas, fighterImg) {
    let fighter = new Fighter(canvas.width / 2 - 45, canvas.height * 0.85)
    fighter.img = fighterImg
    return fighter
}

function createMonsters(canvas, monsterImg) {
    let monsters = [];
    let monster_row = 4;
    let monster_col = 5;
    let monster_width = monsterImg.width
    let monster_height = monsterImg.height
    let x_start = (canvas.width - monster_col * monster_width) / 2;
    let x_end = x_start + (monster_col - 1) * monster_width;
    let y_end = (monster_row - 1) * monster_height;
    for (let x=x_start; x<=x_end; x+=monster_width) {
        for (let y=0; y<=y_end; y+=monster_height) {
            let monster = new Monster(x, y, canvas);
            monster.img = monsterImg;
            monsters.push(monster)
        }
    }
    return monsters
}

function messageRegistry(eventEmitter, Messages, fighter) {
    eventEmitter.on(Messages['up'], () => {
        fighter.y -= 5;
    })
    eventEmitter.on(Messages['down'], () => {
        fighter.y += 5;
    })
    eventEmitter.on(Messages['left'], () => {
        fighter.x -= 5;
    })
    eventEmitter.on(Messages['right'], () => {
        fighter.x += 5;
    })
}

class GameObject {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = '';
        this.width = 0;
        this.height = 0;
        this.img = undefined; 
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Fighter extends GameObject {
    constructor (x, y) {
        super(x, y);
        this.width = 100;
        this.height = 78;
        this.speed = 0;
    }   
}

class Monster extends GameObject {
    constructor (x, y, canvas) {
        super(x, y);
        this.width = 98;
        this.height = 88;
        this.type = 'Enemy';
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;
            } else {
                clearInterval(id);
            }
        }, 300)
    }
}

class EventEmitter {
    constructor() {
        this.listeners = {}
    }
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener)
    }
    emit(message, payload=null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload))
        }
    }
}
