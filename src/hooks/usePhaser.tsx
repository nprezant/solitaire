import React from "react";
import Phaser from 'phaser';

function usePhaser(config: Phaser.Types.Core.GameConfig | undefined) {
  const [game, setGame] = React.useState<Phaser.Game>();

  React.useEffect(() => {
      const _game = new Phaser.Game(config);

      setGame(_game);
  
      return (): void => {
          _game.destroy(true);
          setGame(undefined);
      };
  }, []);

  return game;
}

export default usePhaser;