use std::collections::HashMap;

use crate::{
    card::Card, dealer::Dealer, dropzone::DropZone, movedata::MoveData, pcard::PlayingCard,
    play_area::PlayArea,
};

pub struct AutoMove {}

impl AutoMove {
    pub fn get_best_move(dealer: &Dealer) -> Option<MoveData> {
        //let n_columns = 4; // todo pass this in
        //let drop_zones = Self::get_drop_zones(cards, n_columns);
        //let movable = Self::get_movable(cards);
        //let mut possible_moves = Vec::new();
        //for m in movable {
        //    let mut moves = Self::get_moves(&m, &drop_zones);
        //    possible_moves.append(&mut moves);
        //}

        //for x in possible_moves {
        //    return Some(x);
        //}
        None
    }

    // Get possible moves for a card
    fn get_moves(card: &PlayingCard, drop_zones: &[DropZone]) -> Vec<MoveData> {
        let mut moves = Vec::new();
        for drop_zone in drop_zones.iter() {
            if let Some(move_data) = Self::drop_ok(card, drop_zone) {
                moves.push(move_data)
            }
        }
        moves
    }

    // Can a card be dropped here
    // And where will it be dropped to
    fn drop_ok(from: &PlayingCard, drop_zone: &DropZone) -> Option<MoveData> {
        let move_data = MoveData {
            pcard: from.clone(), // note np I believe this is a move
            to: drop_zone.location.clone(),
        };

        match &drop_zone.card {
            Some(card) => {
                let suit_matches = from.suit == card.suit;
                let color_matches = from.suit.color() == card.suit.color();
                let rank_delta = from.rank - card.rank;

                match drop_zone.location.area {
                    PlayArea::Foundation if suit_matches && rank_delta == 1 => Some(move_data),
                    PlayArea::Tableau if !color_matches && rank_delta == -1 => Some(move_data),
                    _ => None,
                }
            }
            None => None,
        }
    }
}
