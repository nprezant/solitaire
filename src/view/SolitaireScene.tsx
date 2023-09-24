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

        // this.add.text(16, 16, 'Solitaire').setFontSize(24).setShadow(1, 1);

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

        this.input.dragDistanceThreshold = 3;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, objects: CardView[]) => {

            console.log('pointerdown');
            if (objects.length === 0) {
                return;
            }

            let card = objects[0];
            if (!(card instanceof CardView)) { return ;}
            card.registerEvent('pointerdown');
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer, objects: CardView[]) => {

            console.log('pointerup');
            if (objects.length === 0) {
                return;
            }

            let card = objects[0];
            if (!(card instanceof CardView)) { return ;}
            card.registerEvent('pointerup');

            if (!card.wasClicked()) {
                return; // Ignore if this wasn't a click event
            }

            let parent = card.parentEntity;

            switch (parent) {
                case BoardEntity.DrawPile:
                    model.drawStep();
                    break;
                case BoardEntity.WastePile:
                    let wasPlayed = model.autoPlay(card.cardName);
                    if (!wasPlayed) {
                        model.resetWastePile();
                    }
                    break;
                case BoardEntity.Tableau:
                    let wasFixed = model.fixTableauOrientations(card.parentEntityIndex);
                    if (!wasFixed) {
                        model.autoPlay(card.cardName);
                    }
                default:
                    break;
            }

        }, this);

        // This should be some kind of tap event (pointer down, then up without leaving)
        this.input.on('dragstart',  (pointer: Phaser.Input.Pointer, gameObject: CardView) => {

            if (!(gameObject instanceof CardView)) { return ;}
            gameObject.registerEvent('dragstart');
            board.cardIsDragging(gameObject);

        }, this);


        this.input.on('drag', function (pointer: Phaser.Input.Pointer, gameObject: CardView, dragX: number, dragY: number) {

            // Drags with the pointer
            if (!(gameObject instanceof CardView)) { return ;}
            gameObject.registerEvent('drag');
            gameObject.didDragTo(dragX, dragY);

        });

        this.input.on('dragleave', (pointer: Phaser.Input.Pointer, gameObject: CardView, dropZone: Phaser.GameObjects.Zone) =>
        {
            if (!(gameObject instanceof CardView)) { return ;}
            gameObject.registerEvent('dragleave');
            // console.log('dragleave');
            // dropZone.clearTint();

        });

        this.input.on('drop', (pointer: Phaser.Input.Pointer, gameObject: CardView, dropZone: CardDropZone) =>
        {
            console.log('dropped');
            if (!(gameObject instanceof CardView)) { return ;}
            gameObject.registerEvent('drop');
            model.handleCardWasMovedByHand({
                cards: gameObject.draggedCardNames,
                from: gameObject.location,
                to: dropZone.location,
                msg: "dropped",
                tweenConfig: {
                    ease: 'quart.out',
                    duration: MoveDuration / 2,
                },
            });
        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: CardView, dropped: boolean) =>
        {
            console.log('dragend');
            if (!(gameObject instanceof CardView)) { return ;}
            gameObject.registerEvent('dragend');
            if (!dropped)
            {
                // Drop cancelled; card is sent back where it started.
                model.handleCardWasMovedByHand({
                    cards: gameObject.draggedCardNames,
                    from: gameObject.location,
                    to: gameObject.location,
                    msg: "drop cancelled",
                    tweenConfig: {
                        ease: 'quart.out',
                        duration: MoveDuration / 2,
                    }
                });
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
}

export default SolitaireScene;