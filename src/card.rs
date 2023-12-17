use core::fmt;

use strum::EnumIter;
use strum::IntoEnumIterator;

use yew::{html, Html}; // 0.17.1

#[derive(Copy, Clone, Debug, PartialEq, EnumIter)]
pub enum Suit {
    Spade,
    Diamond,
    Club,
    Heart,
}

impl fmt::Display for Suit {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
        // or, alternatively:
        // fmt::Debug::fmt(self, f)
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct Card {
    rank: i32,
    suit: Suit,
}

impl Card {
    pub fn new(rank: i32, suit: Suit) -> Self {
        Self { rank, suit }
    }

    pub fn new_deck() -> Vec<Card> {
        let mut deck = Vec::new();
        for suit in Suit::iter() {
            for rank in 0..13 {
                deck.push(Card::new(rank, suit))
            }
        }
        deck
    }

    pub fn render(&self) -> Html {
        let card_name = format!("{}_{}", self.suit, self.rank);
        let classes = format!("card {}", card_name);

        html! { <div class={classes} /> }
    }
}
