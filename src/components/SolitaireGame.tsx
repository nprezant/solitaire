import Phaser from 'phaser';
import SolitaireScene from '../view/SolitaireScene';
import usePhaser from '../hooks/usePhaser';
import './SolitaireGame.css';

interface GameProps { }

const SolitaireGame: React.FC<GameProps> = () => {
    usePhaser(config);
    return (
    <div id="container">
      <strong>You want a game?</strong>
      <p>You'll get a game</p>
    </div>
  );
};

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'container',
    scene: SolitaireScene
};

export default SolitaireGame;
