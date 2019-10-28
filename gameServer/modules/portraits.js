const shuffle = require('lodash/shuffle');

class Portraits {
    constructor(cards = []) {
        this.portraitsLists = [
            "https://imgflip.com/s/meme/Conspiracy-Keanu.jpg",
            "https://i.pinimg.com/564x/36/28/01/3628011fd54e82a36a726651f6b54bad.jpg",
            "https://i.pinimg.com/564x/40/d1/42/40d142f29f381753e4b2b1c45ea901e2.jpg",
            "https://i.pinimg.com/564x/ec/07/47/ec07471f5cb80eb528b0c5a81ceb0b67.jpg",
            "https://i.pinimg.com/564x/68/52/e7/6852e79e123a58e0fdc36ddca43691c1.jpg",
            "https://i.pinimg.com/564x/8f/5c/f5/8f5cf5b89f9e7c06ce28558f8cf248d4.jpg",
            "https://i.pinimg.com/564x/db/27/a1/db27a16918f4dea83f37a40dce458a3c.jpg",
            "https://i.pinimg.com/564x/92/9a/f1/929af1a44b9c2032b0a511f445e636a2.jpg",
            "https://i.pinimg.com/564x/bf/44/4c/bf444c616aa1de1bc7208dcf5144db58.jpg",
            "https://i.pinimg.com/564x/3f/c4/12/3fc4121abf6a725d76c3e985c832d6e2.jpg",
            "https://i.pinimg.com/564x/20/fc/09/20fc092a6aa92cef4cadaea338a7042f.jpg",
            "https://i.pinimg.com/564x/a7/17/a8/a717a887e36fd6bafc587df340e953b4.jpg",
            "https://i.pinimg.com/564x/d4/eb/59/d4eb59b7e04030ba13751781bbca5b48.jpg",
            "https://i.pinimg.com/564x/79/17/4d/79174deb5412fac1adbb0956ce495bf3.jpg",
            "https://i.pinimg.com/564x/59/4c/52/594c52def47ff6331f0371c9998b4180.jpg",
        ];
        this.portraits = [...this.portraitsLists];
        this.shuffle();
    }

    shuffle(){
        this.portraits = shuffle(this.portraits);
    }

    pop() {
        return this.portraits.pop();
    }

    push(portrait){
        this.portraits.push(portrait);
    }

}

module.exports = Portraits;