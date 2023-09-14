import Phaser from 'phaser';
import SolitaireModel from '../model/solitaire/SolitaireModel';
import BoardEntity from '../model/solitaire/BoardEntity';
import CardView from './CardView'
import SolitaireBoardView from './SolitaireBoardView';
import MoveData from '../model/solitaire/MoveData';
import { MoveDuration } from './Animations';
import CardDropZone from './CardDropZone';

class SolitaireScene extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/casinotable.png');
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        this.add.text(16, 16, 'Bring to Top on Drag').setFontSize(24).setShadow(1, 1);

        // Setup the deck of cards
        const allFrames = this.textures.get('cards').getFrameNames(); // includes back and joker
        const frames = allFrames.filter(x => x !== "joker" && x !== "back");

        if (frames.length !== 52) {
            console.warn('Deck does not have 52 cards! Found ' + frames.length);
        }

        // Phaser.Utils.Array.Shuffle(frames);

        var cards: CardView[] = [];

        let x = 140;
        let y = 180;

        for (var frame of frames)
        {
            const card = new CardView(this, x, y, 'cards', frame);

            card.canBeMoved = true;

            cards.push(card);

            x += 14;
            y += 12;
        }

        // This should be some kind of tap event (pointer down, then up without leaving)
        this.input.on('dragstart',  (pointer: Phaser.Input.Pointer, gameObject: CardView) => {

            switch (gameObject.parentEntity) {
                case BoardEntity.DrawPile:
                    model.drawStep();
                    break;
                case BoardEntity.WastePile:
                    model.resetWastePile();
                    break;
                case BoardEntity.Tableau:
                    board.cardIsDragging(gameObject);
                    break;
                default:
                    console.log('no dragstart event for object with parent entity ' + gameObject.parentEntity);
                    break;
            }

        }, this);


        this.input.on('drag', function (pointer: Phaser.Input.Pointer, gameObject: CardView, dragX: number, dragY: number) {

            // Drags with the pointer
            gameObject.didDragTo(dragX, dragY);

        });

        this.input.on('dragleave', (pointer: Phaser.Input.Pointer, gameObject: CardView, dropZone: Phaser.GameObjects.Zone) =>
        {

            // console.log('dragleave');
            // dropZone.clearTint();

        });

        this.input.on('drop', (pointer: Phaser.Input.Pointer, gameObject: CardView, dropZone: CardDropZone) =>
        {
            // this.tweens.add({
            //     targets: gameObject,
            //     x: dropZone.x,
            //     y: dropZone.y,
            //     ease: 'quart.out',
            //     duration: MoveDuration / 2,
            // });
            // gameObject.bringToTop();this

            console.log('dropped')
            model.handleCardWasMovedByHand({ cards: gameObject.draggedCardNames, from: gameObject.location, to: dropZone.location, msg: "dropped"});
        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: CardView, dropped: boolean) =>
        {
            if (!dropped)
            {
                // this.tweens.add({
                //     targets: gameObject,
                //     x: gameObject.input!.dragStartX,
                //     y: gameObject.input!.dragStartY,
                //     ease: 'quart.out',
                //     duration: MoveDuration / 2,
                // });

                // Drop cancelled; card is sent back where it started.
                model.handleCardWasMovedByHand({ cards: gameObject.draggedCardNames, from: gameObject.location, to: gameObject.location, msg: "drop cancelled" });
            }

            gameObject.dragDidEnd();
        });

        // Setup solitaire model
        const model = new SolitaireModel(3);

        // Setup the board state
        const board = new SolitaireBoardView(0, 0, cards, this);

        // Connect model and view
        model.moveHook = (data: MoveData) => { board.handleCardsMoved(data); };

        // Setup the board
        model.setup();
    }

    private sendCardPickedUp() {

    }
}

export default SolitaireScene;