use strum::EnumIter;

use crate::macros::ez_display;

#[derive(Copy, Clone, Debug, PartialEq, EnumIter)]
pub enum Suit {
    Spade,
    Diamond,
    Club,
    Heart,
}

#[derive(Copy, Clone, Debug, PartialEq, EnumIter)]
pub enum SuitColor {
    Red,
    Black,
}

impl Suit {
    pub fn color(&self) -> SuitColor {
        match self {
            Suit::Spade | Suit::Club => SuitColor::Black,
            Suit::Diamond | Suit::Heart => SuitColor::Red,
        }
    }
}

ez_display!(Suit);
ez_display!(SuitColor);
