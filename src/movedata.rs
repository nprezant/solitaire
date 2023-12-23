use crate::{location::Location, pcard::PlayingCard};

#[derive(Debug, Clone)]
pub struct MoveData {
    //  Card to be moved
    pub pcard: PlayingCard,
    pub to: Location,
}

#[derive(Debug, Clone)]
pub struct PlacedCard {
    //  Card to be moved
    pub pcard: PlayingCard,
    pub location: Location,
}
