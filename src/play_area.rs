use core::fmt;

use strum::EnumIter;

#[derive(Copy, Clone, Debug, PartialEq, EnumIter)]
pub enum PlayArea {
    DrawPile,
    WastePile,
    Tableau,
    Foundation,
}

impl fmt::Display for PlayArea {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
        // or, alternatively:
        // fmt::Debug::fmt(self, f)
    }
}
