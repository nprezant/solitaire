use crate::{rect::Rect, suit::Suit};
use strum::IntoEnumIterator;

use yew::{html, Html}; // 0.17.1

// todo tweak if cards seemed cropped funny
const RAW_SVG_CARD_WIDTH: f32 = 167.5;
const RAW_SVG_CARD_HEIGHT: f32 = 243.0;

#[derive(Clone, Debug, PartialEq)]
pub struct Card {
    rank: i32,
    suit: Suit,
    pos: Rect, // ui position. viewport units.

    svg_href: String,
    svg_viewbox: String,
}

impl Card {
    pub fn new(rank: i32, suit: Suit) -> Self {
        let pos = Rect::new(20.0, 50.0, 55.0, 90.0);
        let svg_href = Self::get_svg_href(rank, suit);
        let svg_viewbox = Self::get_svg_viewbox(rank, suit);
        Self {
            rank,
            suit,
            pos,
            svg_href,
            svg_viewbox,
        }
    }

    fn get_svg_href(rank: i32, suit: Suit) -> String {
        let raw_rank = rank.to_string();
        let card_rank = match rank {
            1..=10 => raw_rank.as_str(),
            11 => "jack",
            12 => "queen",
            13 => "king",
            _ => "1", // Don't panic
        };
        let mut card_label = format!("{}_{}", card_rank, suit);
        card_label.make_ascii_lowercase();
        let card_href = format!("img/cards.svg#{}", card_label);
        card_href
    }

    fn get_svg_viewbox(rank: i32, suit: Suit) -> String {
        let row = match suit {
            Suit::Club => 0,
            Suit::Diamond => 1,
            Suit::Heart => 2,
            Suit::Spade => 3,
        } - 1;
        let col = rank - 1;

        let vb_top = row as f32 * RAW_SVG_CARD_HEIGHT;
        let vb_left = col as f32 * RAW_SVG_CARD_WIDTH;
        let vb = format!(
            "{} {} {} {}",
            vb_left, vb_top, RAW_SVG_CARD_WIDTH, RAW_SVG_CARD_HEIGHT,
        );
        vb
    }

    pub fn new_deck() -> Vec<Card> {
        let mut deck = Vec::new();
        for suit in Suit::iter() {
            for rank in 1..14 {
                deck.push(Card::new(rank, suit))
            }
        }
        spread(&mut deck, 30.0, 30.0);
        deck
    }

    pub fn render(&self) -> Html {
        let width = format!("{}vw", self.pos.w);
        let height = format!("{}vw", self.pos.h);

        let position = format!("top: {}vw; left: {}vw;", self.pos.y, self.pos.x);

        html! {
        <div class="card" style={position}>
            <svg viewBox={self.svg_viewbox.clone()} {width} {height} >
                < use href={self.svg_href.clone()} />
            </svg>
        </div>
        }
    }
}

fn spread(cards: &mut Vec<Card>, mut x: f32, mut y: f32) {
    (0..cards.len()).for_each(|i| {
        cards[i].pos.x = x;
        cards[i].pos.y = y;
        x += 1.0;
        y += 1.0;
    });
}
