use crate::suit::Suit;
use strum::IntoEnumIterator;

use yew::{html, Html}; // 0.17.1

#[derive(Clone, Debug, PartialEq)]
pub struct Card {
    rank: i32,
    suit: Suit,
    //top: i32,
    //left: i32,
}

impl Card {
    pub fn new(rank: i32, suit: Suit) -> Self {
        Self { rank, suit }
    }

    pub fn new_deck() -> Vec<Card> {
        let mut deck = Vec::new();
        for suit in Suit::iter() {
            for rank in 1..13 {
                deck.push(Card::new(rank, suit))
            }
        }
        deck
    }

    pub fn render(&self) -> Html {
        let raw_rank = self.rank.to_string();
        let card_rank = match self.rank {
            1..=10 => raw_rank.as_str(),
            11 => "J",
            12 => "Q",
            13 => "K",
            _ => "1", // Don't panic
        };
        let mut card_name = format!("{}_{}", self.suit, card_rank);
        card_name.make_ascii_lowercase();
        let classes = format!("card {}", card_name);

        html! { <div class={classes} /> }
    }
}
