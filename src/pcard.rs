use crate::suit::Suit;

#[derive(Clone, Debug, PartialEq)]
pub struct PlayingCard {
    pub rank: i32,
    pub suit: Suit,
}
