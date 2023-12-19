use crate::macros::ez_display;
use crate::play_area::PlayArea;

#[derive(Debug, Clone, PartialEq)]
pub struct Location {
    pub area: PlayArea,
    // Index of the area: foundation 1, 2, 3, 4
    pub area_index: i32,
    // Index within the area: foundation 1; card index 0;
    pub sort_index: i32,
}

impl Location {
    pub fn copy_from(&mut self, other: &Location) {
        self.area = other.area;
        self.area_index = other.area_index;
        self.sort_index = other.sort_index;
    }
}

ez_display!(Location);
