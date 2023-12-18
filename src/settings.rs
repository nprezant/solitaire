use gloo::storage::{LocalStorage, Storage};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Settings {
    /// number of n_tableau columns
    pub n_columns: usize,
    /// rate at which cards are drawn (typicallys 1, 2, or 3)
    pub draw_rate: usize,
}

impl Settings {
    const KEY: &'static str = "npr.solitaire.settings";

    pub fn load() -> Self {
        LocalStorage::get(Self::KEY).unwrap_or_default()
    }

    pub fn remove() {
        LocalStorage::delete(Self::KEY);
    }

    pub fn store(&self) {
        let _ = LocalStorage::set(Self::KEY, self);
    }
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            n_columns: 7,
            draw_rate: 3,
        }
    }
}
