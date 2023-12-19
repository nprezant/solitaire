use crate::{card::Card, location::Location, play_area::PlayArea};

pub struct MoveData<'a> {
    pub card: &'a Card,
    pub to: Location,
}

pub struct AutoMove {}

impl AutoMove {
    pub fn get_best_move(cards: &Vec<Card>) -> Option<MoveData> {
        let drop_zones = Self::get_drop_zones(cards);
        let possible_moves = cards.iter().flat_map(|c| Self::get_moves(c, drop_zones));

        possible_moves.last()
    }

    // Get possible moves for a card
    fn get_moves<'a>(card: &'a Card, drop_zones: &[Card]) -> Vec<MoveData<'a>> {
        let mut moves = Vec::new();
        for drop_zone in drop_zones {
            if let Some(move_data) = Self::drop_ok(card, drop_zone) {
                moves.push(move_data)
            }
        }
        moves
    }

    // Get drop zones
    fn get_drop_zones(cards: &Vec<Card>) -> &[Card] {
        cards
    }

    // Can a card be dropped here
    // And where will it be dropped to
    fn drop_ok<'a>(from: &'a Card, drop_zone: &Card) -> Option<MoveData<'a>> {
        let suit_matches = from.suit == drop_zone.suit;
        let color_matches = from.suit.color() == drop_zone.suit.color();

        let incremented_drop = MoveData {
            card: from,
            to: Location {
                area: drop_zone.location.area,
                area_index: drop_zone.location.area_index,
                sort_index: drop_zone.location.sort_index + 1,
            },
        };

        let rank_delta = from.rank - drop_zone.rank;

        match drop_zone.location.area {
            PlayArea::Foundation if suit_matches && rank_delta == 1 => Some(incremented_drop),
            PlayArea::Tableau if !color_matches && rank_delta == -1 => Some(incremented_drop),
            _ => None,
        }
    }
}
