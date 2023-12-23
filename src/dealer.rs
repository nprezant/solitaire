use log::info;
use rand::{seq::SliceRandom, thread_rng};
use std::collections::HashMap;
use yew::{html, Html};

use crate::{
    automove::AutoMove,
    card::Card,
    dropzone::DropZone,
    layout::Layout,
    location::Location,
    movedata::{MoveData, PlacedCard},
    pcard::PlayingCard,
    play_area::PlayArea,
};

#[derive(Debug)]
pub struct Dealer {
    deck: Vec<Card>,
    n_columns: i32,
}

impl Dealer {
    pub fn new(n_columns: i32) -> Self {
        let deck = Card::new_deck();
        Self { deck, n_columns } // todo this should be a move?
    }

    pub fn shuffle(&mut self) {
        self.deck.shuffle(&mut thread_rng());
    }

    pub fn deal(&mut self) {
        Self::set_card_data(
            &mut self.deck,
            &Location {
                area: PlayArea::DrawPile,
                area_index: 0,
                sort_index: 0,
                faceup: false,
            },
        );

        let mut i = 0;

        for n in 0..=self.n_columns {
            // Columns
            for j in 0..n {
                // Cards in column
                let card = &mut self.deck[i];
                i += 1;

                if j == n - 1 {
                    card.location.faceup = true;
                }

                card.location.area = PlayArea::Tableau;
                card.location.area_index = n - 1; // why does this happen
                card.location.sort_index = j;
            }
        }
    }

    // Updates the positions of the cards based on the card locations.
    pub fn update_positions(&mut self) {
        let layout = Layout::compute();

        for card in self.deck.iter_mut() {
            card.update_positions(&layout);
        }
    }

    // Sets the location for several cards at once
    fn set_card_data(cards: &mut [Card], loc: &Location) {
        (0..cards.len()).for_each(|i| {
            cards[i].location.copy_from(loc);
        });
    }

    // Performs an auto move
    // Returns true if any cards moved.
    pub fn auto_move(&self) -> bool {
        // Create a list of possible moves, pick the best one.
        match AutoMove::get_best_move(&self.deck) {
            Some(move_data) => {
                // do the move
                let card = move_data.pcard;
                info!("Moving card {:?} to {}", card, move_data.to);
                //cards.last_mut().unwrap().location = move_data.to;
                //Self::update_positions(cards);
                true
            }
            None => {
                info!("No moves available");
                false
            }
        }
    }

    pub fn render(&self) -> Html {
        html! {
            <div class="deck">
            { for self.deck.iter().map(Card::render) }
            </div>
        }
    }
}

impl Dealer {
    fn get_base_foundations() -> Vec<Location> {
        let mut foundations = Vec::new();

        for area_index in 0..4 {
            foundations.push(Location {
                area: PlayArea::Foundation,
                area_index,
                sort_index: 0, // Bottom of the stack
                faceup: true,  // Something getting moved here would probably be faceup
            });
        }

        foundations
    }

    fn get_base_tableau(n_columns: i32) -> Vec<Location> {
        let mut tableau = Vec::new();

        for area_index in 0..n_columns {
            tableau.push(Location {
                area: PlayArea::Tableau,
                area_index,
                sort_index: 0, // Bottom of stack
                faceup: true,  // Something getting moved here might be facedown. Idk. Caller may
                               // need to change.
            });
        }

        tableau
    }

    fn get_drop_zones(&self) -> Vec<DropZone> {
        let mut zones = HashMap::new();

        // Pre-populate drop zones for potentially empty stacks
        let mut base_locations = Vec::new();
        base_locations.extend(Dealer::get_base_foundations());
        base_locations.extend(Dealer::get_base_tableau(self.n_columns));

        for loc in base_locations {
            zones.insert(
                (loc.area, loc.area_index),
                DropZone {
                    card: None,
                    location: loc,
                },
            );
        }

        // Keep only the top card in each stack
        // todo use utility for this
        for card in self.deck.iter() {
            match card.location.area {
                PlayArea::Tableau | PlayArea::Foundation => {
                    let key = (card.location.area, card.location.area_index);

                    let mut drop_location = card.location.clone();
                    drop_location.sort_index += 1;

                    let drop_zone = DropZone {
                        card: Some(card.pcard.clone()),
                        location: drop_location,
                    };

                    let _value = zones
                        .entry(key)
                        .and_modify(|v| {
                            if card.location.sort_index > v.location.sort_index {
                                *v = drop_zone.clone();
                            }
                        })
                        .or_insert(drop_zone);
                }
                _ => (),
            }
        }

        zones.values().cloned().collect()
    }

    fn get_top_card_per_stack(&self, areas: &[PlayArea]) -> Vec<PlayingCard> {
        let mut top_cards = HashMap::new();

        for card in self.deck.iter() {
            if areas.contains(&card.location.area) {
                // Key identifies the area and the stack.
                let key = (card.location.area, card.location.area_index);

                let placed_card = PlacedCard {
                    pcard: card.pcard.clone(),
                    location: card.location.clone(),
                };

                // Replace the card if we've found one higher in the stack.
                _ = top_cards
                    .entry(key)
                    .and_modify(|v: &mut PlacedCard| {
                        if placed_card.location.sort_index > v.location.sort_index {
                            *v = placed_card.clone();
                        }
                    })
                    .or_insert(placed_card);
            }
        }

        top_cards.values().map(|c| c.pcard.clone()).collect()
    }

    // Get cards that can be moved. Like not in the middle of the deck.
    fn get_movable(&self) -> Vec<PlayingCard> {
        let mut movable = Vec::new();

        // Any faceup cards in the tableau are movable
        for card in self.deck.iter() {
            match card.location.area {
                PlayArea::Tableau if card.location.faceup => {
                    movable.push(card.pcard.clone());
                }
                _ => (),
            }
        }

        // Top card of the waste pile or any foundation pile is also movable
        let top_cards = self.get_top_card_per_stack(&[PlayArea::WastePile, PlayArea::Foundation]);
        movable.extend(top_cards);

        movable
    }
}
