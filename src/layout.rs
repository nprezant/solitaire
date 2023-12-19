use crate::rect::Rect;

pub struct Layout {
    pub draw_pile: Rect,
    pub waste_pile: Rect,
    pub foundations: Rect,
    pub tableau: Rect,
}

impl Layout {
    pub fn compute() -> Self {
        Self {
            draw_pile: Rect::new(80.0, 5.0, 0.0, 0.0),
            waste_pile: Rect::new(70.0, 5.0, 0.0, 0.0),
            foundations: Rect::new(2.0, 5.0, 0.0, 0.0),
            tableau: Rect::new(2.0, 28.0, 0.0, 0.0),
        }
    }
}
