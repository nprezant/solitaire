use rand::{seq::SliceRandom, thread_rng};

use crate::{
    automove::AutoMove, card::Card, layout::Layout, location::Location, play_area::PlayArea,
};

pub struct Dealer {}

impl Dealer {
    pub fn shuffle(cards: &mut Vec<Card>) {
        cards.shuffle(&mut thread_rng());
    }

    pub fn deal(cards: &mut Vec<Card>, n_cols: i32) {
        Self::set_card_data(
            cards,
            &Location {
                area: PlayArea::DrawPile,
                area_index: 0,
                sort_index: 0,
            },
            false,
        );

        let mut i = 0;

        for n in 0..=n_cols {
            // Columns
            for j in 0..n {
                // Cards in column
                let card = &mut cards[i];
                i += 1;

                if j == n - 1 {
                    card.faceup = true;
                }

                card.location.area = PlayArea::Tableau;
                card.location.area_index = n - 1; // why does this happen
                card.location.sort_index = j;
            }
        }
    }

    // Updates the positions of the cards based on the card locations.
    pub fn update_positions(cards: &mut Vec<Card>) {
        let layout = Layout::compute();

        for card in cards {
            card.update_positions(&layout);
        }
    }

    fn set_card_data(cards: &mut Vec<Card>, loc: &Location, faceup: bool) {
        (0..cards.len()).for_each(|i| {
            cards[i].location.copy_from(loc);
            cards[i].faceup = faceup;
        });
    }

    // Performs an auto move
    // Returns true if any cards moved.
    pub fn auto_move(cards: &mut Vec<Card>) -> bool {
        // Create a list of possible moves, pick the best one.
        match AutoMove::get_best_move(cards) {
            Some(_move_data) => {
                // do the move
                true
            }
            None => false,
        }
    }
}
