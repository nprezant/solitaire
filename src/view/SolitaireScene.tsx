import Phaser from 'phaser';
import SolitaireModel from '../model/solitaire/SolitaireModel';
import BoardEntity from '../model/solitaire/BoardEntity';
import CardView from './CardView'
import DrawPileView from './DrawPileView';
import SolitaireBoardView from './SolitaireBoardView';
import StackLocation from '../model/solitaire/StackLocation';
import { MoveData } from '../model/solitaire/MoveData';
import Card from '../model/solitaire/Card';

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

        this.input.on('dragstart',  (pointer: any, gameObject: CardView) => {

            switch (gameObject.parentEntity) {
                case BoardEntity.DrawPile:
                    model.drawStep();
                    break;
                case BoardEntity.WastePile:
                    model.resetWastePile();
                    break;
                default:
                    console.log('dragging not supported for object with parent entity ' + gameObject.parentEntity);
                    break;
            }

        }, this);

        this.input.on('drag', function (pointer: any, gameObject: Phaser.GameObjects.Graphics, dragX: number, dragY: number) {

            // Drags with the pointer
            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        // Setup solitaire model
        const model = new SolitaireModel(3);

        // Setup the board state
        const board = new SolitaireBoardView(0, 0, cards);

        // Connect model and view
        model.moveHook = (data: MoveData) => { board.handleCardsMoved(data); };

        // Setup the board
        model.setup();

        // for (var card of cards) {
        //     board.moveCard(card, BoardEntity.DrawPile);
        // }

        // this.time.delayedCall(1000, () => {
        //     for (var i = 0; i < 10; ++i) {
        //         board.moveCard(cards[i], BoardEntity.WastePile);
        //     }
        // });

        // this.time.delayedCall(1500, () => {
        //     for (var i = 10; i < 20; ++i) {
        //         board.moveCard(cards[i], BoardEntity.Tableau, 0);
        //     }
        // });

        // this.time.delayedCall(1500, () => {
        //     for (var i = 20; i < 23; ++i) {
        //         board.moveCard(cards[i], BoardEntity.Tableau, 1);
        //     }
        // });
    }
}

export default SolitaireScene;