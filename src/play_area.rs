use strum::EnumIter;

use crate::macros::ez_display;

#[derive(Copy, Clone, Debug, PartialEq, EnumIter, Eq, Hash)]
pub enum PlayArea {
    DrawPile,
    WastePile,
    Tableau,
    Foundation,
}

ez_display!(PlayArea);
