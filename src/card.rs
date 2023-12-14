use std::fmt::Write;
use std::iter;

use rand::Rng;
use yew::{html, Html};

use crate::math::{self, Mean, Vector2D, WeightedMean};
use crate::settings::Settings;
use crate::simulation::SIZE;

#[derive(Debug)]
pub enum Suit {
    Spade,
    Diamond,
    Club,
    Heart,
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

    pub fn render(&self) -> Html {
        let card_name = format!("{}_{}", self.suit, self.rank);

        html! { <div class={card_name} /> }
    }
}
