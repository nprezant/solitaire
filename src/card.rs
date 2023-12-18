use crate::suit::Suit;
use strum::IntoEnumIterator;

use yew::{html, Html}; // 0.17.1

const RAW_SVG_CARD_WIDTH: f32 = 167.5;
const RAW_SVG_CARD_HEIGHT: f32 = 245.0;

#[derive(Clone, Debug, PartialEq)]
pub struct Card {
    rank: i32,
    suit: Suit,
    top: f32,
    left: f32,
}

impl Card {
    pub fn new(rank: i32, suit: Suit) -> Self {
        Self {
            rank,
            suit,
            top: 55.0,
            left: 20.0,
        }
    }

    pub fn new_deck() -> Vec<Card> {
        let mut deck = Vec::new();
        for suit in Suit::iter() {
            for rank in 1..14 {
                deck.push(Card::new(rank, suit))
            }
        }
        deck
    }

    pub fn render(&self) -> Html {
        let raw_rank = self.rank.to_string();
        let card_rank = match self.rank {
            1..=10 => raw_rank.as_str(),
            11 => "jack",
            12 => "queen",
            13 => "king",
            _ => "1", // Don't panic
        };
        let mut card_label = format!("{}_{}", card_rank, self.suit);
        card_label.make_ascii_lowercase();
        let card_href = format!("img/cards.svg#{}", card_label);

        let row = match self.suit {
            Suit::Club => 0,
            Suit::Diamond => 1,
            Suit::Heart => 2,
            Suit::Spade => 3,
        } - 1;
        let col = self.rank - 1;

        let vb_top = row as f32 * RAW_SVG_CARD_HEIGHT;
        let vb_left = col as f32 * RAW_SVG_CARD_WIDTH;
        let vb = format!(
            "{} {} {} {}",
            vb_left, vb_top, RAW_SVG_CARD_WIDTH, RAW_SVG_CARD_HEIGHT,
        );
        let width = format!("{}", RAW_SVG_CARD_WIDTH);
        let height = format!("{}", RAW_SVG_CARD_HEIGHT);

        let positions = format!("top: {}vw; left: {}vw;", self.top, self.left);

        html! {
        <div class="card">
            <svg viewBox={vb} {width} {height} >
                < use href={card_href} />
            </svg>
        </div>
        }
    }
}
