use crate::macros::ez_display;
use crate::play_area::PlayArea;

#[derive(Debug, Clone, PartialEq)]
pub struct Location {
    // Area of the board
    pub area: PlayArea,
    // Index of the area: foundation 1, 2, 3, 4
    pub area_index: usize,
    // Index within the area: foundation 1; card index 0;
    pub sort_index: usize,
    // Whether or not the card is faceup
    pub faceup: bool,
}

impl Location {
    pub fn copy_from(&mut self, other: &Location) {
        self.area = other.area;
        self.area_index = other.area_index;
        self.sort_index = other.sort_index;
        self.faceup = other.faceup;
    }

    pub fn stack_id(&self) -> (PlayArea, usize) {
        (self.area, self.area_index)
    }
}

ez_display!(Location);
