let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = 'black';
function loadImage(path) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img)
            }
    })
}

async function loadAll() {
    const fighterImg = await loadImage('./assets/fighter4.png')
    const monsterImg = await loadImage('./assets/monster.png')
    context.drawImage(fighterImg, canvas.width / 2 - 45, canvas.height * 0.85)
    let monster_row = 4
    let monster_col = 5
    let x_start = (canvas.width - monster_col * monsterImg.width) / 2
    let x_end = x_start + (monster_col - 1) * monsterImg.width
    let y_end = (monster_row - 1) * monsterImg.height
    for (let x=x_start; x<=x_end; x+=monsterImg.width) {
        for (let y=0; y<=y_end; y+=monsterImg.height) {
            context.drawImage(monsterImg, x, y)
        }
    }
}
loadAll()
