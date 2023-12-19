use core::fmt;

use strum::EnumIter;

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

macro_rules! ez_display {
    ($struct_name:ident) => {
        impl fmt::Display for $struct_name {
            fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
                write!(f, "{:?}", self)
                // or, alternatively:
                // fmt::Debug::fmt(self, f)
            }
        }
    };
}

ez_display!(Suit);
ez_display!(SuitColor);
