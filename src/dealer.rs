use rand::{seq::SliceRandom, thread_rng};

use crate::{card::Card, layout::Layout, location::Location, play_area::PlayArea};

pub struct Dealer {}

impl Dealer {
    pub fn shuffle(cards: &mut Vec<Card>) {
        cards.shuffle(&mut thread_rng());
    }

    pub fn deal(cards: &mut Vec<Card>, n_cols: i32) {
        Self::set_locations(cards, &{
            let area = PlayArea::DrawPile;
            let area_index = 0;
            let sort_index = 0;
            Location {
                area,
                area_index,
                sort_index,
            }
        });

        let mut i = 0;

        for n in (0..n_cols).rev() {
            // Columns
            for j in 0..n {
                // Cards in column
                let card = &mut cards[i];
                i += 1;

                if j == n - 1 {
                    card.faceup = true;
                }

                card.location.area = PlayArea::Tableau;
                card.location.area_index = n;
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

    fn set_locations(cards: &mut Vec<Card>, loc: &Location) {
        (0..cards.len()).for_each(|i| {
            cards[i].location.copy_from(loc);
        });
    }
}
