let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = 'black';
// debugger;
function loadImage(path) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            console.log('image loaded');
            resolve(img)
            console.log('test')}
    })
}

async function loadAll() {
    const heroImg = await loadImage('./assets/player.png')
    const monsterImg = await loadImage('./assets/enemyShip.png')
    context.drawImage(heroImg, canvas.width / 2 - 45, canvas.height * 0.75)
}
loadAll()
