use std::collections::HashMap;

use crate::{card::Card, location::Location, play_area::PlayArea};

#[derive(Debug, Clone)]
pub struct MoveData<'a> {
    //  Card to be moves
    pub card: &'a Card,
    pub to: Location,
}

#[derive(Debug, Clone)]
pub struct DropZone<'a> {
    // Card underlying drop zone
    pub card: Option<&'a Card>,
    // Location of the drop zone
    pub location: Location,
}

pub struct AutoMove {}

impl AutoMove {
    pub fn get_best_move(_cards: &[Card]) -> Option<MoveData> {
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
    fn get_moves<'a>(card: &'a Card, drop_zones: &[DropZone]) -> Vec<MoveData<'a>> {
        let mut moves = Vec::new();
        for drop_zone in drop_zones {
            if let Some(move_data) = Self::drop_ok(card, drop_zone) {
                moves.push(move_data)
            }
        }
        moves
    }

    // Get cards that can be moved. Like not in the middle of the deck.
    fn get_movable(cards: &[Card]) -> Vec<Card> {
        let mut movable2 = HashMap::new();
        let mut movable = Vec::new();

        for card in cards {
            match card.location.area {
                PlayArea::Tableau if card.location.faceup => {
                    // Any faceup cards in the tableau
                    movable.push(card.clone());
                }
                PlayArea::WastePile | PlayArea::Foundation => {
                    // Top card in waste or foundation
                    let key = (card.location.area, card.location.area_index);
                    let sort_index = card.location.sort_index;

                    let value = movable2.entry(key).or_insert(card.clone());
                    if sort_index > value.location.sort_index {
                        *value = card.clone();
                    }
                }
                _ => (),
            }
        }

        for m in movable2.values() {
            movable.push(m.clone());
        }

        movable
    }

    // Get drop zones
    fn get_drop_zones(cards: &[Card], n_columns: i32) -> Vec<DropZone> {
        let mut zones = HashMap::new();

        // Fill with empty stacks
        for area_index in 0..4 {
            zones.insert(
                (PlayArea::Foundation, area_index),
                DropZone {
                    card: None,
                    location: Location {
                        area: PlayArea::Foundation,
                        area_index,
                        sort_index: 0,
                        faceup: true,
                    },
                },
            );
        }

        for area_index in 0..n_columns {
            zones.insert(
                (PlayArea::Tableau, area_index),
                DropZone {
                    card: None,
                    location: Location {
                        area: PlayArea::Tableau,
                        area_index,
                        sort_index: 0,
                        faceup: true,
                    },
                },
            );
        }

        for card in cards {
            match card.location.area {
                PlayArea::Tableau | PlayArea::Foundation => {
                    let key = (card.location.area, card.location.area_index);
                    let sort_index = card.location.sort_index;
                    let zone = DropZone {
                        card: Some(card),
                        location: Location {
                            area: card.location.area,
                            area_index: card.location.area_index,
                            sort_index: card.location.sort_index + 1,
                            faceup: card.location.faceup,
                        },
                    };

                    let value = zones.entry(key).or_insert(zone.clone());
                    if sort_index > value.location.sort_index {
                        *value = zone;
                    }
                }
                _ => (),
            }
        }

        zones.values().cloned().collect()
    }

    // Can a card be dropped here
    // And where will it be dropped to
    fn drop_ok<'a>(from: &'a Card, drop_zone: &DropZone) -> Option<MoveData<'a>> {
        let move_data = MoveData {
            card: from,
            to: drop_zone.location.clone(),
        };

        match drop_zone.card {
            Some(card) => {
                let suit_matches = from.pcard.suit == card.pcard.suit;
                let color_matches = from.pcard.suit.color() == card.pcard.suit.color();
                let rank_delta = from.pcard.rank - card.pcard.rank;

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
