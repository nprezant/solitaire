use crate::{location::Location, pcard::PlayingCard};

#[derive(Debug, Clone)]
pub struct DropZone {
    // Card underlying drop zone
    pub card: Option<PlayingCard>,
    // Location of the drop zone
    pub location: Location,
}
