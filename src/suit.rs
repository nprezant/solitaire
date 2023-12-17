use core::fmt;

use strum::EnumIter;

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
