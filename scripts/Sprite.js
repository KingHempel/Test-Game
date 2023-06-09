class Sprite {
    constructor(config) {

        // Set up the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        // Shadow
        this.shadow = new Image();
        this.useShadow = true;
        if (this.useShadow) {
            this.shadow.src = "images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }
        // Configure Animation & Initial State
        this.animations = config.animations || {
            "idle-down": [[0, 0]],
            "idle-right": [[0, 1]],
            "idle-up": [[0, 2]],
            "idle-left": [[0, 3]],
            "walk-down": [[1, 0], [0, 0], [3, 0], [0, 0]],
            "walk-right": [[1, 1], [0, 1], [3, 1], [0, 1]],
            "walk-up": [[1, 2], [0, 2], [3, 2], [0, 2]],
            "walk-left": [[1, 3], [0, 3], [3, 3], [0, 3]],
        }
        this.currentAnimation = "idle-down"; //config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;

        // Reference the game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        // Downtick Frame Progress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        // Reset the counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson) {
        const x = this.gameObject.x + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 3 + utils.withGrid(6) - cameraPerson.y;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y + 2);

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 16,  // left cut
            frameY * 16,  // top cut
            16, // width of cut
            16, // height of cut
            x,  // position x
            y,  // position y
            16, // scale width
            16  // scale height
        )
        this.updateAnimationProgress();
    }
}