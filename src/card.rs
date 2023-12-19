use core::fmt;

use crate::{layout::Layout, location::Location, play_area::PlayArea, rect::Rect, suit::Suit};
use strum::IntoEnumIterator;

use yew::{html, Html}; // 0.17.1

// todo tweak if cards seemed cropped funny
const SVG_CARD_WIDTH: f32 = 167.5;
const SVG_CARD_HEIGHT: f32 = 243.0;

// Padding between tableau columns
const TABLEAU_INNER_PADDING: f32 = 1.0;

// Padding between foundation columns
const FOUNDATION_INNER_PADDING: f32 = 2.0;

// Padding between foundation columns
const SPREAD_OFFSET: f32 = 2.0;

#[derive(Clone, Debug, PartialEq)]
pub struct Card {
    pub rank: i32,
    pub suit: Suit,

    pos: Rect, // ui position. viewport units.

    svg_href: String,
    svg_viewbox: String,

    pub location: Location,
    pub faceup: bool,
}

impl fmt::Display for Card {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?} of {:?}s", self.rank, self.suit)
    }
}

impl Card {
    pub fn new(rank: i32, suit: Suit) -> Self {
        let w = 100.0 / 8.0;
        let h = Self::get_height(w);
        let pos = Rect::new(0.0, 0.0, w, h);
        let svg_href = Self::get_svg_href(rank, suit);
        let svg_viewbox = Self::get_svg_viewbox(rank, suit);
        let location = {
            let area = PlayArea::DrawPile;
            let area_index = 0;
            let sort_index = 0;
            Location {
                area,
                area_index,
                sort_index,
            }
        };
        let faceup = false;
        Self {
            rank,
            suit,
            pos,
            svg_href,
            svg_viewbox,
            location,
            faceup,
        }
    }

    fn get_height(w: f32) -> f32 {
        w / (SVG_CARD_WIDTH / SVG_CARD_HEIGHT)
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

    fn get_svg_href_back() -> String {
        String::from("img/cards.svg#back")
    }

    fn get_svg_viewbox_back() -> String {
        Self::get_svg_viewbox_rc(3, 2)
    }

    fn get_svg_viewbox(rank: i32, suit: Suit) -> String {
        let row = match suit {
            Suit::Club => 0,
            Suit::Diamond => 1,
            Suit::Heart => 2,
            Suit::Spade => 3,
        } - 1;
        let col = rank - 1;

        Self::get_svg_viewbox_rc(row, col)
    }

    fn get_svg_viewbox_rc(row: i32, col: i32) -> String {
        let vb_top = row as f32 * SVG_CARD_HEIGHT;
        let vb_left = col as f32 * SVG_CARD_WIDTH;
        let vb = format!(
            "{} {} {} {}",
            vb_left, vb_top, SVG_CARD_WIDTH, SVG_CARD_HEIGHT,
        );
        vb
    }

    // Update card position based on location
    pub fn update_positions(&mut self, layout: &Layout) {
        match self.location.area {
            PlayArea::DrawPile => {
                self.pos.x = layout.draw_pile.x;
                self.pos.y = layout.draw_pile.y;
            }
            PlayArea::WastePile => {
                self.pos.x = layout.waste_pile.x;
                self.pos.y = layout.waste_pile.y;
            }
            PlayArea::Tableau => {
                //info!(
                //    "Start: x={}, y={}, area={}, area={}, sort={}",
                //    self.pos.x,
                //    self.pos.y,
                //    self.location.area,
                //    self.location.area_index,
                //    self.location.sort_index
                //);
                self.pos.x = layout.tableau.x
                    + (self.pos.w + TABLEAU_INNER_PADDING) * self.location.area_index as f32;
                self.pos.y = layout.tableau.y + (SPREAD_OFFSET) * self.location.sort_index as f32;
            }
            PlayArea::Foundation => {
                self.pos.x = layout.foundations.x
                    + (self.pos.w + FOUNDATION_INNER_PADDING) * self.location.area_index as f32;
                self.pos.y =
                    layout.foundations.y + (SPREAD_OFFSET) * self.location.sort_index as f32;
            }
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
        let width = format!("{}vw", self.pos.w);
        let height = format!("{}vw", self.pos.h);

        let position = format!("top: {}vw; left: {}vw;", self.pos.y, self.pos.x);

        let back = Self::get_svg_href_back();
        let href: &String = if self.faceup { &self.svg_href } else { &back };

        let back_vb = Self::get_svg_viewbox_back();
        let vb: &String = if self.faceup {
            &self.svg_viewbox
        } else {
            &back_vb
        };

        html! {
        <div class="card" style={position}>
            <svg viewBox={vb.clone()} {width} {height} >
                < use href={href.clone()} />
            </svg>
        </div>
        }
    }
}
