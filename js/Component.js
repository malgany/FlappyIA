function Component(obj) {

    const DIR_IMG = "images/";

    this.width = obj.width;
    this.height = obj.height;
    this.x = obj.x;
    this.y = obj.y;
    this.id = obj.id;
    this.name = obj.name;
    this.value = obj.value;
    this.type = obj.type;
    this.fill = obj.fill;
    this.aux = obj.aux;
    this.img = DIR_IMG + obj.img;

    this.score = 0;
    this.speedX = 0;
    this.speedY = 0;

    this.gravity = 0;
    this.gravitySpeed = 0;

    this.mais_perto_left = 0;
    this.mais_perto_top = 0;
    this.mais_perto_mytop = 0;

    this.update = function () {

        ctx = myGameArea.context;

        if (this.type == "text") {

            ctx.font = this.font;
            ctx.fillStyle = this.fill;
            ctx.fillText(this.value, this.x, this.y);
        } else if (this.type == "image") {

            var imageObj = new Image();
            imageObj.src = this.img;
            ctx.drawImage(imageObj, this.x, this.y, this.width, this.height);
        } else {

            ctx.fillStyle = this.fill;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;

    }

    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    this.crashWith = function (otherobj) {

        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;

        if (otherobj.id == 'botton') {

            if (this.mais_perto_left <= 0 || otherleft < this.mais_perto_left) {
                this.mais_perto_left = otherleft;
                this.mais_perto_top = othertop;
                this.mais_perto_mytop = mytop;
            } else {
                this.mais_perto_left--;
            }

            if (this.mais_perto_left < myleft)
                this.mais_perto_left = 0;
        }

        if ((mytop > otherbottom) || (mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }

        if (mytop < 0 || myright < 0 || mybottom > 450) {
            crash = true;
        }

        return crash;
    }
}